# M-Pesa Transaction Analyzer 💵

A simple but powerful Node.js agent that helps you understand where your money is going by analyzing M-Pesa SMS transactions.

## Features ✨

- **SMS Parsing**: Automatically extracts transaction details from M-Pesa SMS messages
- **Smart Categorization**: Intelligently categorizes spending into Food, Transport, Bills, Shopping, and more
- **Transaction Storage**: Saves all transactions in a JSON file for persistence
- **Spending Analysis**: Generates detailed spending summaries and breakdowns
- **Interactive CLI**: User-friendly command-line interface for easy data input and viewing

## Quick Start 🚀

### Installation

```bash
# Clone or navigate to the project directory
cd mpesa-transaction-analyzer

# Install dependencies (Node.js built-ins only)
npm install
```

### Running the Application

```bash
# Start the analyzer
npm start
```

## Usage 📖

### Main Menu Options

```
1. Add new M-Pesa SMS      - Parse and add M-Pesa message
2. View all transactions   - See all recorded transactions
3. Generate spending summary - Get total spending by type
4. View spending by category - See breakdown by categories
5. Delete transaction      - Remove a specific transaction
6. Clear all transactions  - Delete everything (use carefully!)
7. Export transactions     - View JSON file location
8. Exit                    - Close the application
```

### Example M-Pesa Messages

The parser supports various M-Pesa message formats:

```
✅ You have sent KSh1,500 to stem kirigi. Balance is KSh5,234.50
✅ You have received KSh2,000 from savannah kioko. Balance is KSh7,234.50
✅ KSh50 paid to Safaricom for airtime. Balance is KSh7,184.50
✅ Withdrawal of KSh5,000 at MM123456. Balance is KSh2,184.50
```

### Data Storage 💾

All transactions are stored in `transactions.json` in the following format:

```json
{
  "transactions": [
    {
      "id": "1234567890-abc123",
      "amount": 1500,
      "type": "sent",
      "recipient": "stem kirigi",
      "category": "Personal",
      "balance": 5234.50,
      "transactionId": "AB1234567890",
      "timestamp": "2024-05-04T10:30:00.000Z",
      "rawMessage": "You have sent KSh1,500 to stem kirigi..."
    }
  ]
}
```

## Categories 🏷️

Transactions are automatically categorized into:

- **Food**: Restaurants, cafes, food deliveries
- **Transport**: Uber, Bolt, taxi, fuel
- **Bills**: Electricity, water, internet, airtime, data
- **Shopping**: Clothes, groceries, retail purchases
- **Utilities**: Electricity, water, gas, sewerage
- **Entertainment**: Movies, music, gaming
- **Health**: Hospital, pharmacy, doctor visits
- **Savings**: Investments and savings
- **Personal**: Loans, transfers to friends/family
- **Income**: Received payments
- **Other**: Uncategorized transactions

## Project Structure 📁

```
.
├── index.js          # Main application entry point
├── parser.js         # M-Pesa SMS parser
├── categorizer.js    # Transaction categorizer
├── storage.js        # JSON file storage manager
├── reporter.js       # Spending report generator
├── package.json      # Project dependencies
├── transactions.json # Auto-generated transaction database
└── README.md         # This file
```

## API Reference 🔧

### Parser Module

```javascript
const MPesaParser = require('./parser');

// Parse an M-Pesa message
const transaction = MPesaParser.parse("You have sent KSh1,500 to John");
// {
//   amount: 1500,
//   type: 'sent',
//   recipient: 'John',
//   ...
// }

// Validate parsed transaction
const isValid = MPesaParser.isValid(transaction);
```

### Categorizer Module

```javascript
const Categorizer = require('./categorizer');
const categorizer = new Categorizer();

// Categorize a transaction
const category = categorizer.categorize(transaction);
// Returns: "Personal"

// Add custom keywords
categorizer.addCategoryKeywords('Food', ['burger', 'pizza']);
```

### Storage Module

```javascript
const Storage = require('./storage');
const storage = new Storage('transactions.json');

// Load all transactions
const transactions = storage.loadTransactions();

// Add transaction
storage.addTransaction(transaction);

// Filter transactions
const food = storage.getTransactions({ category: 'Food' });

// Delete transaction
storage.deleteTransaction(transactionId);
```

### Reporter Module

```javascript
const Reporter = require('./reporter');

// Generate summary
const summary = Reporter.generateSummary(transactions);
// {
//   totalTransactions: 10,
//   totalSpent: 5000,
//   byCategory: { Food: { total: 1000, count: 5 }, ... }
// }

// Print formatted report
Reporter.printSummary(summary);

// Get top categories
const top = Reporter.getTopCategories(transactions, 5);
```

## Advanced Usage 🔧

### Programmatic Usage

```javascript
const { MPesaAgent } = require('./index.js');

// Create agent instance
const agent = new MPesaAgent();

// Run interactive mode
agent.run();

// Or use individual methods
agent.addTransaction();
agent.generateSummary();
```

### Custom Categorization

Edit `categorizer.js` to add your own categories and keywords:

```javascript
// Add to categories object
this.categories = {
  'Gaming': ['game', 'steam', 'playstation', 'xbox'],
  'Travel': ['flight', 'hotel', 'booking'],
  // ... other categories
};
```

## Tips for Best Results 💡

1. **Consistent Message Format**: The parser works best with standard M-Pesa SMS formats
2. **Full Names**: Use full recipient names when sending money for better categorization
3. **Regular Updates**: Add transactions regularly for accurate tracking
4. **Backup**: Your `transactions.json` file is your data—keep backups!
5. **Review Categories**: Periodically review transactions to ensure correct categorization

## Example Workflow 📱

```
1. Receive M-Pesa SMS: "You have sent KSh500 to Uber Driver. Balance is KSh4,500"
2. Paste into application
3. System parses and categorizes as "Transport"
4. Transaction saved to storage
5. View summary to see transport spending: KSh500
6. Track patterns over time
```

## Limitations & Future Features 🚀

### Current Limitations
- Manual SMS input (no automatic SMS integration)
- Basic regex-based parsing
- Limited AI features in v1

### Future Enhancements (v2+)
- OpenAI API integration for smarter categorization
- Automatic SMS importing
- Monthly/weekly reports
- Spending trends and predictions
- Budget alerts
- Multi-user support
- Web dashboard

## Requirements 📋

- Node.js 12.0+
- No external npm dependencies in v1
- ~2MB disk space for initial setup

## Troubleshooting 🔍

### Message Not Parsing
- Ensure the M-Pesa message includes both amount (KSh) and transaction type
- Check that the amount format matches standard M-Pesa format

### Incorrect Categorization
- Review the transaction recipient name
- Add custom keywords to categorizer.js
- Manually edit the `transactions.json` file if needed

### File Permission Issues
- Ensure write permissions in the application directory
- Check that `transactions.json` is not locked by another process

## Contributing 🤝

This is a starting point! Feel free to:
- Add new categories and keywords
- Improve parsing logic
- Create new report types
- Build UI/API layers on top

## License 📄

MIT License - Feel free to use and modify for your needs

## Support 💬

For questions or issues:
1. Check the API Reference section
2. Review example messages in Usage section
3. Examine the code comments in individual modules

---

**Happy tracking! 📊 Understand your spending, control your money.** 💰
