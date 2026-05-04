# Development Guide - M-Pesa Analyzer

This guide explains how to extend and improve the M-Pesa Transaction Analyzer.

## Project Architecture

```
User Input (SMS)
    ↓
Parser Module (parse SMS)
    ↓
Categorizer Module (assign category)
    ↓
Storage Module (save to JSON)
    ↓
Reporter Module (generate reports)
    ↓
CLI Interface (display to user)
```

## How to Add New Features

### 1. Adding New Categories

**File**: `categorizer.js`

```javascript
// Add to this.categories object
this.categories = {
  'YourCategory': ['keyword1', 'keyword2', 'keyword3'],
  // Keywords should be lowercase
};

// Example: Gaming category
'Gaming': ['steam', 'playstation', 'xbox', 'game', 'twitch'],
```

**Best Practices**:
- Use lowercase keywords
- Order categories by specificity
- More specific categories first
- Share overlapping merchants carefully

### 2. Improving SMS Parsing

**File**: `parser.js`

Add new regex patterns to `recipientPatterns` array:

```javascript
// Format: /regex pattern that captures recipient in group 1/i
/your new pattern\s+([A-Za-z\s]+?)(?:\.|,|\s+Balance)/i,

// Example for a new format:
/transferred.*?to\s+([A-Za-z\s]+?)(?:\.|,|\s+Balance)/i,
```

**Regex Tips**:
- Use non-greedy matching: `.*?` instead of `.*`
- Capture recipient in group 1: `([A-Za-z\s]+?)`
- Use `(?:...)` for non-capturing groups
- Add patterns before generic ones
- Test with `test.js` after adding

### 3. Adding New Report Types

**File**: `reporter.js`

```javascript
static generateNewReport(transactions) {
  // Filter and calculate
  const result = {};
  transactions.forEach(t => {
    // Your logic here
  });
  return result;
}

// Add public method
static getMonthlyTrends(transactions) {
  // Implementation
}
```

### 4. Adding New CLI Commands

**File**: `index.js`

In the `run()` method, add a new case:

```javascript
case '9':
  await this.yourNewMethod();
  break;

// Add the method:
async yourNewMethod() {
  // Implementation
  console.log('Your output here');
}
```

Also update the menu display.

## Debugging Guide

### Debug Parsing Issues

1. Add logging to `parser.js`:
```javascript
console.log('Message:', message);
console.log('Parsed:', transaction);
```

2. Test with exact M-Pesa message:
```javascript
const MPesaParser = require('./parser');
const msg = 'Your exact M-Pesa message here';
const result = MPesaParser.parse(msg);
console.log(result);
```

3. Check regex patterns:
- Test regex at regexr.com
- Verify capturing groups
- Use raw strings with `/i` flag for case-insensitive

### Debug Categorization

```javascript
const Categorizer = require('./categorizer');
const cat = new Categorizer();
const transaction = {
  recipient: 'YourMerchant',
  rawMessage: 'Your message',
  type: 'sent'
};
console.log(cat.categorize(transaction));
```

### Debug Storage

```javascript
const Storage = require('./storage');
const storage = new Storage();
const all = storage.loadTransactions();
console.log('Transactions:', all);
```

## Testing

### Run Tests
```bash
node test.js       # Basic functionality tests
node example.js    # Comprehensive examples
```

### Create Custom Tests

Create `my-test.js`:
```javascript
const Module = require('./module-name');

// Your test code
console.log('Test passed ✅');
```

Run with:
```bash
node my-test.js
```

## Performance Optimization

### Large Transaction Lists

If handling 1000+ transactions:

```javascript
// Use filtering before generating reports
const recent = storage.getTransactions({
  startDate: '2024-01-01'
});

const summary = Reporter.generateSummary(recent);
```

### Memory Usage

For large datasets:
- Load transactions in chunks
- Process and clear cache
- Archive old data to separate files

## Code Style Guidelines

### Naming Conventions
- Classes: PascalCase (`MPesaParser`, `Categorizer`)
- Functions/methods: camelCase (`parse`, `categorize`)
- Constants: UPPER_SNAKE_CASE (if added)
- Variables: camelCase (`totalSpent`, `transactions`)

### Comments
```javascript
/**
 * Brief description
 * @param {Type} name - Parameter description
 * @returns {Type} Return description
 */
```

### Error Handling
```javascript
try {
  // Code that might fail
} catch (error) {
  console.error('Meaningful error message:', error.message);
  return null; // or default value
}
```

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-category

# Make changes and test
node test.js

# Commit with clear message
git add .
git commit -m "feat: add gaming category"

# Push
git push origin feature/new-category
```

## Future Enhancement Ideas

### Phase 1: Data Insights
- [ ] Monthly spending trends
- [ ] Budget alerts
- [ ] Spending predictions
- [ ] Category trends

### Phase 2: Integration
- [ ] CSV/Excel import/export
- [ ] Google Sheets integration
- [ ] Automatic SMS parsing
- [ ] Multi-phone support

### Phase 3: UI/UX
- [ ] Web dashboard
- [ ] Charts and graphs
- [ ] Mobile app
- [ ] Dark mode

### Phase 4: AI/ML
- [ ] OpenAI integration for categorization
- [ ] Spending predictions
- [ ] Anomaly detection
- [ ] Personalized recommendations

## Common Tasks

### Task: Add Support for New Bank

1. Update parser regex patterns
2. Add bank-specific categories
3. Test with sample messages
4. Update documentation

### Task: Add Monthly Reports

1. Add method to `reporter.js`
2. Group transactions by month
3. Calculate monthly totals
4. Add CLI command in `index.js`

### Task: Export to CSV

1. Create `export.js` module
2. Convert transactions to CSV format
3. Add menu option in `index.js`
4. Test with sample data

## Module API Reference

### Parser
```javascript
MPesaParser.parse(message)           // Parse SMS
MPesaParser.isValid(transaction)     // Validate
```

### Categorizer
```javascript
categorizer.categorize(transaction)           // Get category
categorizer.getCategories()                   // List all
categorizer.addCategoryKeywords(cat, words)   // Add keywords
```

### Storage
```javascript
storage.loadTransactions()                      // Load all
storage.saveTransactions(transactions)          // Save all
storage.addTransaction(transaction)             // Add one
storage.getTransactions(filter)                 // Filter
storage.deleteTransaction(id)                   // Delete
storage.clearAll()                              // Delete all
storage.getFilePath()                           // File location
```

### Reporter
```javascript
Reporter.generateSummary(transactions)          // Create summary
Reporter.printSummary(summary)                  // Display
Reporter.getCategoryPercentages(transactions)   // Get percentages
Reporter.getTopCategories(transactions, limit)  // Top N
```

## File Dependencies

```
index.js
├── parser.js (requires)
├── categorizer.js (requires)
├── storage.js (requires)
└── reporter.js (requires)

storage.js
└── fs, path (built-in)

All modules are independent and can be used separately
```

## Troubleshooting Development

### Issue: Parser not working
- Check regex syntax
- Verify capture groups
- Test with `node -e` for quick testing
- Use regexr.com to debug patterns

### Issue: Storage not persisting
- Check file permissions
- Verify JSON format
- Ensure transactions.json exists
- Check disk space

### Issue: Categorization wrong
- Add more keywords
- Check keyword order (specificity)
- Verify recipient extraction
- Review transaction type

### Issue: CLI not responding
- Check readline implementation
- Ensure all prompts are handled
- Verify no infinite loops
- Check for exceptions

## Performance Benchmarks

Typical performance (on modern machine):
- Parse message: <1ms
- Categorize: <1ms
- Save transaction: <5ms
- Generate report (100 transactions): <50ms
- Load all (1000 transactions): <100ms

## Security Notes

- No external API calls in v1
- Local JSON storage only
- No authentication/encryption
- Input validation on parsing

## Contributing

1. Fork or create branch
2. Make improvements
3. Test thoroughly
4. Update documentation
5. Create pull request

## Resources

- Regular expressions: regexr.com
- Node.js docs: nodejs.org
- JSON format: json.org
- Git workflow: git-scm.com

---

For questions or issues, check existing tests and examples first!
