import { PulseLensClient } from '../src/sdk/index';

const BASE_URL = process.env.OBSERVABILITY_URL || 'http://localhost:3000';

const client = new PulseLensClient({
  endpoint: BASE_URL,
  service: 'traffic-generator',
  debug: true,
});

const SERVICES = ['auth-service', 'payment-service', 'order-service', 'notification-service'];

const SAMPLE_LOGS: Array<{ service: string; level: 'info' | 'warn' | 'error'; message: string }> = [
  // Auth service
  { service: 'auth-service', level: 'info', message: 'User user_948 logged in via Google OAuth' },
  { service: 'auth-service', level: 'info', message: 'JWT session refreshed for user_301' },
  { service: 'auth-service', level: 'warn', message: 'Multiple failed login attempts detected for IP 192.168.1.104' },
  { service: 'auth-service', level: 'error', message: 'Failed to verify OAuth state token: Expired token' },

  // Payment service
  { service: 'payment-service', level: 'info', message: 'Stripe webhook received: payment_intent.succeeded ($89.00)' },
  { service: 'payment-service', level: 'info', message: 'Invoice #4810 marked as paid' },
  { service: 'payment-service', level: 'warn', message: 'High latency observed from Stripe API: 2350ms' },
  { service: 'payment-service', level: 'error', message: 'Payment authorization declined: Insufficient funds (card ending 4242)' },
  { service: 'payment-service', level: 'error', message: 'Connection reset by payment gateway socket: 504 Gateway Timeout' },

  // Order service
  { service: 'order-service', level: 'info', message: 'Order #ORD-9821 created for customer user_948' },
  { service: 'order-service', level: 'info', message: 'Inventory allocated for 3 items (SKU-102, SKU-550)' },
  { service: 'order-service', level: 'warn', message: 'Low inventory warning: SKU-102 has only 2 units remaining' },
  { service: 'order-service', level: 'error', message: 'Database transaction lock timeout while updating order #ORD-9820' },

  // Notification service
  { service: 'notification-service', level: 'info', message: 'Order confirmation email sent to customer@example.com' },
  { service: 'notification-service', level: 'info', message: 'SMS dispatch queued via Twilio provider' },
  { service: 'notification-service', level: 'warn', message: 'Email provider retry attempt 2 for order #ORD-9819' },
  { service: 'notification-service', level: 'error', message: 'Twilio API returned 429: Rate limit exceeded on SMS channel' },
];

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomBetween(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 10) / 10;
}

async function emitRandomBatch() {
  console.log(`\n🚀 [Simulator] Sending batch of logs and metrics to ${BASE_URL}...`);

  // 1. Send 3-5 random logs
  const logCount = 4;
  for (let i = 0; i < logCount; i++) {
    const item = randomChoice(SAMPLE_LOGS);
    if (item.level === 'info') {
      await client.logger.info(item.message, item.service);
    } else if (item.level === 'warn') {
      await client.logger.warn(item.message, item.service);
    } else {
      await client.logger.error(item.message, item.service);
    }
  }

  // 2. Send realistic metrics across services
  await client.metrics.timing('response_time_ms', randomBetween(45, 320), 'auth-service');
  await client.metrics.gauge('active_sessions', randomBetween(120, 250), 'auth-service');

  await client.metrics.timing('response_time_ms', randomBetween(120, 850), 'payment-service');
  await client.metrics.record('charge_amount_usd', randomBetween(15, 250), 'payment-service');
  await client.metrics.gauge('memory_usage_mb', randomBetween(380, 520), 'payment-service');

  await client.metrics.timing('response_time_ms', randomBetween(30, 210), 'order-service');
  await client.metrics.increment('orders_created_total', 1, 'order-service');
  await client.metrics.gauge('queue_depth', randomBetween(0, 18), 'order-service');

  await client.metrics.timing('response_time_ms', randomBetween(60, 450), 'notification-service');
  await client.metrics.gauge('cpu_usage_pct', randomBetween(12, 78), 'notification-service');

  console.log(`✅ [Simulator] Batch emitted successfully!`);
}

async function main() {
  const isLoop = process.argv.includes('--loop');

  if (isLoop) {
    console.log('🔄 Running in continuous simulation mode (Ctrl+C to stop)...');
    while (true) {
      await emitRandomBatch();
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  } else {
    // Run 2 batches
    await emitRandomBatch();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await emitRandomBatch();
    console.log('\n🎉 Simulation completed. Run "npm run simulate -- --loop" for continuous streaming.');
  }
}

main().catch((err) => {
  console.error('Fatal simulator error:', err);
  process.exit(1);
});
