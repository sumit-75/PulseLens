import cron from 'node-cron';
import { evaluateAllAlertRules } from '../src/lib/alerts/checker';

console.log('⚡ [PulseLens Cron Worker] Initializing automated alert monitoring engine...');

async function runCheck() {
  const timestamp = new Date().toISOString();
  console.log(`\n🕒 [${timestamp}] Evaluating alert rules...`);

  try {
    const results = await evaluateAllAlertRules();
    const triggered = results.filter((r) => r.triggered);

    if (results.length === 0) {
      console.log('ℹ️  No active alert rules found in database.');
    } else {
      console.log(`📊 Evaluated ${results.length} active rule(s). Triggered: ${triggered.length}`);
      for (const t of triggered) {
        console.warn(`🚨 ALERT TRIGGERED on ${t.service}: ${t.details}`);
      }
    }
  } catch (err) {
    console.error('❌ Error during alert evaluation cycle:', err);
  }
}

// 1. Run immediately once on startup
runCheck();

// 2. Schedule node-cron to run every 1 minute ('* * * * *')
const task = cron.schedule('* * * * *', () => {
  runCheck();
});

console.log('✅ [PulseLens Cron Worker] Background cron active — running every minute (cron: "* * * * *")');

process.on('SIGINT', () => {
  console.log('\n🛑 Stopping alert cron worker...');
  task.stop();
  process.exit(0);
});
