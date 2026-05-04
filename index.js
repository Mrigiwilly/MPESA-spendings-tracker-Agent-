/**
 * M-Pesa Transaction Analyzer Agent
 * Main entry point
 */

const readline = require('readline');
const MPesaParser = require('./parser');
const Categorizer = require('./categorizer');
const Storage = require('./storage');
const Reporter = require('./reporter');

class MPesaAgent {
  constructor() {
    this.storage = new Storage('transactions.json');
    this.categorizer = new Categorizer();
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  /**
   * Display main menu
   */
  showMenu() {
    console.log('\n' + '='.repeat(50));
    console.log('💵 M-PESA TRANSACTION ANALYZER');
    console.log('='.repeat(50));
    console.log('\nOptions:');
    console.log('  1. Add new M-Pesa SMS');
    console.log('  2. View all transactions');
    console.log('  3. Generate spending summary');
    console.log('  4. View spending by category');
    console.log('  5. Delete transaction');
    console.log('  6. Clear all transactions');
    console.log('  7. Export transactions to JSON');
    console.log('  8. Exit');
    console.log('='.repeat(50));
  }

  /**
   * Get user input
   */
  prompt(question) {
    return new Promise(resolve => {
      this.rl.question(question, resolve);
    });
  }

  /**
   * Add new M-Pesa SMS and process it
   */
  async addTransaction() {
    console.log('\n📝 Enter M-Pesa SMS message (or press Enter to skip):');
    const message = await this.prompt('> ');

    if (!message.trim()) {
      console.log('Skipped.');
      return;
    }

    // Parse the SMS
    const parsed = MPesaParser.parse(message);

    if (!parsed || !MPesaParser.isValid(parsed)) {
      console.log('❌ Could not parse M-Pesa message. Please ensure it contains amount and transaction type.');
      return;
    }

    // Categorize the transaction
    const category = this.categorizer.categorize(parsed);
    parsed.category = category;

    // Ask for confirmation
    console.log('\n✅ Parsed Transaction:');
    console.log(`  • Type: ${parsed.type}`);
    console.log(`  • Amount: KSh ${parsed.amount}`);
    console.log(`  • Recipient: ${parsed.recipient || 'Unknown'}`);
    console.log(`  • Category: ${category}`);
    console.log(`  • Balance: ${parsed.balance ? `KSh ${parsed.balance}` : 'N/A'}`);

    const confirm = await this.prompt('\nSave this transaction? (y/n): ');
    if (confirm.toLowerCase() !== 'y') {
      console.log('Transaction not saved.');
      return;
    }

    // Save transaction
    if (this.storage.addTransaction(parsed)) {
      console.log('✅ Transaction saved successfully!');
    } else {
      console.log('❌ Failed to save transaction.');
    }
  }

  /**
   * View all transactions
   */
  viewTransactions() {
    const transactions = this.storage.loadTransactions();

    if (transactions.length === 0) {
      console.log('\n📭 No transactions recorded yet.');
      return;
    }

    console.log('\n' + '='.repeat(70));
    console.log('📋 ALL TRANSACTIONS');
    console.log('='.repeat(70));

    transactions.forEach((t, index) => {
      console.log(`\n${index + 1}. [${t.type.toUpperCase()}] KSh ${t.amount}`);
      console.log(`   Recipient: ${t.recipient || 'Unknown'}`);
      console.log(`   Category: ${t.category || 'Uncategorized'}`);
      console.log(`   Date: ${new Date(t.timestamp).toLocaleString()}`);
      if (t.transactionId) {
        console.log(`   ID: ${t.transactionId}`);
      }
    });

    console.log('\n' + '='.repeat(70));
  }

  /**
   * Generate and display spending summary
   */
  generateSummary() {
    const transactions = this.storage.loadTransactions();

    if (transactions.length === 0) {
      console.log('\n📭 No transactions to summarize.');
      return;
    }

    // Filter for spending only (exclude received/income)
    const spendingTransactions = transactions.filter(t => 
      t.type !== 'received' && t.type !== 'Income'
    );

    const summary = Reporter.generateSummary(spendingTransactions);
    Reporter.printSummary(summary);
  }

  /**
   * View spending by category
   */
  viewCategoryBreakdown() {
    const transactions = this.storage.loadTransactions();

    if (transactions.length === 0) {
      console.log('\n📭 No transactions to analyze.');
      return;
    }

    // Filter for spending only
    const spendingTransactions = transactions.filter(t => 
      t.type !== 'received' && t.type !== 'Income'
    );

    const topCategories = Reporter.getTopCategories(spendingTransactions, 10);

    console.log('\n' + '='.repeat(50));
    console.log('📊 SPENDING BY CATEGORY');
    console.log('='.repeat(50));

    if (topCategories.length === 0) {
      console.log('No spending data.');
    } else {
      topCategories.forEach((cat, index) => {
        const barLength = Math.round((cat.total / topCategories[0].total) * 20);
        const bar = '█'.repeat(barLength) + '░'.repeat(20 - barLength);
        console.log(`\n${index + 1}. ${cat.category}`);
        console.log(`   ${bar}`);
        console.log(`   Total: KSh ${cat.total.toLocaleString()} | Count: ${cat.count} | Avg: KSh ${cat.average.toLocaleString()}`);
      });
    }

    console.log('\n' + '='.repeat(50));
  }

  /**
   * Delete a transaction
   */
  async deleteTransaction() {
    const transactions = this.storage.loadTransactions();

    if (transactions.length === 0) {
      console.log('\n📭 No transactions to delete.');
      return;
    }

    this.viewTransactions();

    const indexStr = await this.prompt('\nEnter transaction number to delete (or press Enter to cancel): ');
    if (!indexStr.trim()) {
      return;
    }

    const index = parseInt(indexStr) - 1;
    if (index < 0 || index >= transactions.length) {
      console.log('❌ Invalid transaction number.');
      return;
    }

    const toDelete = transactions[index];
    const confirm = await this.prompt(`Delete transaction: KSh ${toDelete.amount} from ${toDelete.timestamp}? (y/n): `);

    if (confirm.toLowerCase() === 'y') {
      if (this.storage.deleteTransaction(toDelete.id)) {
        console.log('✅ Transaction deleted.');
      } else {
        console.log('❌ Failed to delete transaction.');
      }
    }
  }

  /**
   * Clear all transactions
   */
  async clearAllTransactions() {
    const transactions = this.storage.loadTransactions();
    if (transactions.length === 0) {
      console.log('\n📭 No transactions to clear.');
      return;
    }

    const confirm = await this.prompt(`\n⚠️  This will delete ALL ${transactions.length} transactions. Are you sure? (yes/no): `);
    if (confirm.toLowerCase() === 'yes') {
      if (this.storage.clearAll()) {
        console.log('✅ All transactions cleared.');
      } else {
        console.log('❌ Failed to clear transactions.');
      }
    } else {
      console.log('Cancelled.');
    }
  }

  /**
   * Export transactions to file
   */
  exportTransactions() {
    const transactions = this.storage.loadTransactions();
    const filePath = this.storage.getFilePath();

    console.log(`\n✅ Transactions exported to: ${filePath}`);
    console.log(`📊 Total transactions: ${transactions.length}`);
  }

  /**
   * Main application loop
   */
  async run() {
    console.log('\n🎉 Welcome to M-Pesa Transaction Analyzer!');
    console.log('Helping you understand where your money is going...\n');

    let running = true;

    while (running) {
      this.showMenu();
      const choice = await this.prompt('Enter your choice (1-8): ');

      switch (choice) {
        case '1':
          await this.addTransaction();
          break;
        case '2':
          this.viewTransactions();
          break;
        case '3':
          this.generateSummary();
          break;
        case '4':
          this.viewCategoryBreakdown();
          break;
        case '5':
          await this.deleteTransaction();
          break;
        case '6':
          await this.clearAllTransactions();
          break;
        case '7':
          this.exportTransactions();
          break;
        case '8':
          console.log('\n👋 Goodbye! Your transactions are saved.\n');
          running = false;
          break;
        default:
          console.log('❌ Invalid option. Please try again.');
      }
    }

    this.rl.close();
  }
}

// Run the agent
const agent = new MPesaAgent();
agent.run();

module.exports = { MPesaAgent };
