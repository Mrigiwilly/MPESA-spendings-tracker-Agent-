/**
 * Example Usage of M-Pesa Transaction Analyzer
 * This file demonstrates how to use the agent programmatically
 * 
 * Run with: node example.js
 */

const MPesaParser = require('./parser');
const Categorizer = require('./categorizer');
const Storage = require('./storage');
const Reporter = require('./reporter');

console.log('\n📚 M-Pesa Analyzer - Programmatic Usage Examples\n');

// Example 1: Parse M-Pesa Messages
console.log('=' .repeat(50));
console.log('Example 1: Parsing M-Pesa Messages');
console.log('='.repeat(50));

const messages = [
  'You have sent KSh1,500 to stem kirigi. Balance is KSh5,234.50',
  'KSh50 paid to Safaricom for airtime. Balance is KSh7,184.50',
  'You have received KSh2,000 from savannah kioko. Balance is KSh9,184.50'
];

const parsedTransactions = messages.map(msg => {
  const parsed = MPesaParser.parse(msg);
  const isValid = MPesaParser.isValid(parsed);
  console.log(`\nMessage: ${msg}`);
  console.log(`├─ Amount: KSh ${parsed.amount}`);
  console.log(`├─ Type: ${parsed.type}`);
  console.log(`├─ Recipient: ${parsed.recipient || 'Unknown'}`);
  console.log(`└─ Valid: ${isValid ? '✅' : '❌'}`);
  return parsed;
});

// Example 2: Categorize Transactions
console.log('\n' + '='.repeat(50));
console.log('Example 2: Categorizing Transactions');
console.log('='.repeat(50));

const categorizer = new Categorizer();

parsedTransactions.forEach((transaction, idx) => {
  const category = categorizer.categorize(transaction);
  console.log(`\nTransaction ${idx + 1}:`);
  console.log(`├─ Amount: KSh ${transaction.amount}`);
  console.log(`├─ Recipient: ${transaction.recipient || 'Unknown'}`);
  console.log(`└─ Category: ${category}`);
});

// Example 3: Store and Retrieve Transactions
console.log('\n' + '='.repeat(50));
console.log('Example 3: Storing and Retrieving Transactions');
console.log('='.repeat(50));

const storage = new Storage('example-transactions.json');

// Add transactions with categories
parsedTransactions.forEach(transaction => {
  transaction.category = categorizer.categorize(transaction);
  storage.addTransaction(transaction);
  console.log(`✓ Saved: KSh ${transaction.amount} - ${transaction.recipient || 'Unknown'}`);
});

// Retrieve all transactions
const allTransactions = storage.loadTransactions();
console.log(`\n📊 Total stored: ${allTransactions.length} transactions`);

// Filter by category
const foodTransactions = storage.getTransactions({ category: 'Food' });
console.log(`🍔 Food transactions: ${foodTransactions.length}`);

// Example 4: Generate Reports
console.log('\n' + '='.repeat(50));
console.log('Example 4: Generating Reports');
console.log('='.repeat(50));

const summary = Reporter.generateSummary(allTransactions);

console.log(`\n📈 Summary Report:`);
console.log(`├─ Total Transactions: ${summary.totalTransactions}`);
console.log(`├─ Total Spent: KSh ${summary.totalSpent.toLocaleString()}`);
console.log(`├─ Total Received: KSh ${summary.totalReceived.toLocaleString()}`);
console.log(`└─ Net Amount: KSh ${summary.netAmount.toLocaleString()}`);

console.log(`\n💰 Spending by Category:`);
Object.entries(summary.byCategory).forEach(([category, data]) => {
  console.log(`├─ ${category}: KSh ${data.total.toLocaleString()} (${data.count} transactions)`);
});

// Example 5: Customize Categories
console.log('\n' + '='.repeat(50));
console.log('Example 5: Adding Custom Categories');
console.log('='.repeat(50));

const customCategorizer = new Categorizer();
customCategorizer.addCategoryKeywords('Gaming', ['steam', 'playstation', 'xbox', 'game']);
customCategorizer.addCategoryKeywords('Travel', ['hotel', 'flight', 'booking', 'airline']);

const gamingTransaction = {
  recipient: 'Steam',
  type: 'sent',
  rawMessage: 'Payment to Steam for game'
};

const gamingCategory = customCategorizer.categorize(gamingTransaction);
console.log(`\nCustom categorization test:`);
console.log(`├─ Recipient: Steam`);
console.log(`└─ Category: ${gamingCategory}`);

// Example 6: Top Categories Analysis
console.log('\n' + '='.repeat(50));
console.log('Example 6: Top Spending Categories');
console.log('='.repeat(50));

const topCategories = Reporter.getTopCategories(allTransactions, 10);
console.log('\nTop spending categories:');
topCategories.forEach((cat, idx) => {
  console.log(`${idx + 1}. ${cat.category}: KSh ${cat.total.toLocaleString()} (${cat.count} transactions)`);
});

// Cleanup
console.log('\n' + '='.repeat(50));
console.log('✅ Examples complete! Check example-transactions.json for stored data.');
console.log('='.repeat(50) + '\n');

// Optional: View the generated file
const fs = require('fs');
if (fs.existsSync('example-transactions.json')) {
  const data = fs.readFileSync('example-transactions.json', 'utf-8');
  console.log('\n📄 Generated transactions.json preview:');
  console.log(JSON.stringify(JSON.parse(data), null, 2).substring(0, 300) + '...\n');
}
