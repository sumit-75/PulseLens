export type LogLevel = 'info' | 'warn' | 'error';

export interface PulseLensConfig {
  /**
   * Base URL of the PulseLens Observability server (e.g. "http://localhost:3000")
   */
  endpoint: string;
  /**
   * Default service name emitting logs and metrics (e.g. "auth-service")
   */
  service: string;
  /**
   * Enable verbose debug logs on the console (defaults to false)
   */
  debug?: boolean;
  /**
   * Optional custom fetch implementation or timeout
   */
  timeoutMs?: number;
}

export interface LogPayload {
  service?: string;
  level: LogLevel;
  message: string;
  timestamp?: string | Date;
}

export interface MetricPayload {
  service?: string;
  name: string;
  value: number;
  timestamp?: string | Date;
}

export class PulseLensClient {
  private endpoint: string;
  private defaultService: string;
  private debug: boolean;
  private timeoutMs: number;

  constructor(config: PulseLensConfig) {
    if (!config.endpoint) {
      throw new Error('[PulseLens SDK] "endpoint" is required.');
    }
    if (!config.service) {
      throw new Error('[PulseLens SDK] "service" is required.');
    }

    // Strip trailing slash if present
    this.endpoint = config.endpoint.replace(/\/+$/, '');
    this.defaultService = config.service;
    this.debug = config.debug ?? false;
    this.timeoutMs = config.timeoutMs ?? 10000;
  }

  private async sendHttpRequest(path: string, body: Record<string, unknown>): Promise<boolean> {
    const url = `${this.endpoint}${path}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(this.timeoutMs),
      });

      if (!response.ok) {
        const errorText = await response.text();
        if (this.debug) {
          console.error(`[PulseLens SDK] Request failed (${response.status}): ${errorText}`);
        }
        return false;
      }

      return true;
    } catch (err: unknown) {
      if (this.debug) {
        console.error(`[PulseLens SDK] Network error sending to ${url}:`, err);
      }
      return false;
    }
  }

  /**
   * Logger namespace for emitting structured logs
   */
  public logger = {
    /**
     * Send an info log
     */
    info: async (message: string, service?: string): Promise<boolean> => {
      return this.sendLog({
        level: 'info',
        message,
        service: service || this.defaultService,
      });
    },

    /**
     * Send a warning log
     */
    warn: async (message: string, service?: string): Promise<boolean> => {
      return this.sendLog({
        level: 'warn',
        message,
        service: service || this.defaultService,
      });
    },

    /**
     * Send an error log
     */
    error: async (message: string, service?: string): Promise<boolean> => {
      return this.sendLog({
        level: 'error',
        message,
        service: service || this.defaultService,
      });
    },

    /**
     * Send a raw log with custom timestamp or level
     */
    log: async (payload: LogPayload): Promise<boolean> => {
      return this.sendLog(payload);
    },
  };

  /**
   * Metrics namespace for emitting time-series numbers
   */
  public metrics = {
    /**
     * Record an arbitrary numeric value
     */
    record: async (name: string, value: number, service?: string): Promise<boolean> => {
      return this.sendMetric({
        name,
        value,
        service: service || this.defaultService,
      });
    },

    /**
     * Increment a counter metric (e.g. "orders_processed_total")
     */
    increment: async (name: string, by: number = 1, service?: string): Promise<boolean> => {
      return this.sendMetric({
        name,
        value: by,
        service: service || this.defaultService,
      });
    },

    /**
     * Record a duration/latency in milliseconds
     */
    timing: async (name: string, durationMs: number, service?: string): Promise<boolean> => {
      return this.sendMetric({
        name,
        value: durationMs,
        service: service || this.defaultService,
      });
    },

    /**
     * Record a point-in-time gauge value (e.g. "memory_usage_mb", "active_users")
     */
    gauge: async (name: string, value: number, service?: string): Promise<boolean> => {
      return this.sendMetric({
        name,
        value,
        service: service || this.defaultService,
      });
    },
  };

  private async sendLog(payload: LogPayload): Promise<boolean> {
    return this.sendHttpRequest('/api/logs', {
      service: payload.service || this.defaultService,
      level: payload.level,
      message: payload.message,
      ...(payload.timestamp ? { timestamp: payload.timestamp } : {}),
    });
  }

  private async sendMetric(payload: MetricPayload): Promise<boolean> {
    return this.sendHttpRequest('/api/metrics', {
      service: payload.service || this.defaultService,
      name: payload.name,
      value: payload.value,
      ...(payload.timestamp ? { timestamp: payload.timestamp } : {}),
    });
  }
}

/**
 * Factory helper function to create a PulseLens client instance
 */
export function createPulseLens(config: PulseLensConfig): PulseLensClient {
  return new PulseLensClient(config);
}
