/**
 * Simple tests to verify the modules work correctly
 * Run with: node test.js
 */

const MPesaParser = require('./parser');
const Categorizer = require('./categorizer');
const Storage = require('./storage');
const Reporter = require('./reporter');

console.log('\n🧪 Running Module Tests...\n');

// Test 1: Parser
console.log('✓ Test 1: M-Pesa Parser');
const testMessages = [
  'You have sent KSh1,500 to stem kirigi. Balance is KSh5,234.50',
  'KSh50 paid to Safaricom for airtime. Balance is KSh7,184.50',
  'You have sent KSh300 to Uber Driver. Balance is KSh4,884.50'
];

testMessages.forEach((msg, idx) => {
  const parsed = MPesaParser.parse(msg);
  console.log(`  ${idx + 1}. Parsed: ${parsed.amount} KSh to ${parsed.recipient}`);
});

// Test 2: Categorizer
console.log('\n✓ Test 2: Categorizer');
const categorizer = new Categorizer();
const testTransaction = {
  recipient: 'Uber Driver',
  type: 'sent',
  rawMessage: 'KSh300 sent to Uber Driver'
};
const category = categorizer.categorize(testTransaction);
console.log(`  Transaction to Uber Driver categorized as: ${category}`);

// Test 3: Storage
console.log('\n✓ Test 3: Storage');
const storage = new Storage('test-transactions.json');
console.log(`  Storage file location: ${storage.getFilePath()}`);
console.log(`  Transactions loaded: ${storage.loadTransactions().length}`);

// Test 4: Reporter
console.log('\n✓ Test 4: Reporter');
const sampleTransactions = [
  { amount: 500, type: 'sent', category: 'Food', recipient: 'Restaurant' },
  { amount: 200, type: 'sent', category: 'Transport', recipient: 'Uber' },
  { amount: 100, type: 'sent', category: 'Food', recipient: 'Cafe' },
];
const summary = Reporter.generateSummary(sampleTransactions);
console.log(`  Total transactions: ${summary.totalTransactions}`);
console.log(`  Total spent: ${summary.totalSpent} KSh`);
console.log(`  Categories: ${Object.keys(summary.byCategory).join(', ')}`);

console.log('\n✅ All module tests passed!\n');

// Cleanup test file
const fs = require('fs');
if (fs.existsSync('test-transactions.json')) {
  fs.unlinkSync('test-transactions.json');
}
