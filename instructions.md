# M-Pesa Transaction Analyzer - Development Guide

## Project Overview
This is a Node.js CLI application that analyzes M-Pesa SMS transactions, categorizes spending, and generates reports.

## Architecture

### Core Modules
- **parser.js**: Parses M-Pesa SMS messages using regex patterns
- **categorizer.js**: Categorizes transactions into predefined spending categories
- **storage.js**: Manages persistent JSON file storage
- **reporter.js**: Generates summaries and reports from transaction data
- **index.js**: Interactive CLI and main application flow

## Development Guidelines

### Adding New Categories
Edit the `categories` object in `categorizer.js`:
```javascript
this.categories = {
  'NewCategory': ['keyword1', 'keyword2'],
  // ...
};
```

### Improving Parsing
Add new regex patterns to `MPesaParser.parse()` in `parser.js` to handle additional M-Pesa message formats.

### Adding Reports
Create new methods in `Reporter` class in `reporter.js` following existing patterns.

### Code Style
- Use ES6 class syntax
- Add JSDoc comments for all public methods
- Keep modules focused on single responsibility
- Use meaningful variable names

## Testing

Run the application:
```bash
npm start
```

Test with sample M-Pesa messages from README.md.

## File Locations
- Transactions are stored in `transactions.json` in the project root
- Each transaction includes: amount, type, recipient, category, balance, timestamp

## Future Enhancements
- OpenAI API integration for smarter categorization
- Automatic SMS importing (if available on the system)
- Web dashboard or additional UI
- Budget tracking and alerts
- Multi-user support

## Module Dependencies
- Only Node.js built-in modules (readline, fs, path)
- No external npm dependencies in v1

## Common Tasks

### Debug Parsing Issues
1. Check the regex patterns in `parser.js`
2. Log the raw message and extracted values
3. Test with the exact M-Pesa message format

### Fix Categorization
1. Review keywords in `categorizer.js`
2. Add new keywords for common merchants
3. Test with real recipient names

### Handle Edge Cases
1. Add validation in relevant modules
2. Return sensible defaults
3. Log warnings for unexpected formats

---

For detailed API documentation, see README.md
