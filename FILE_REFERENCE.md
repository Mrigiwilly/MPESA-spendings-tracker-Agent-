# File Reference Guide

Quick reference for all files in the M-Pesa Transaction Analyzer project.

## Core Application Files

### index.js (Main Application)
**Purpose**: Interactive CLI interface
**Key Classes**: `MPesaAgent`
**Key Methods**: 
- `run()` - Main event loop
- `addTransaction()` - Add new M-Pesa SMS
- `viewTransactions()` - List all transactions
- `generateSummary()` - Show spending report
- `viewCategoryBreakdown()` - Analyze by category

**When to Edit**: To add new menu options or change UI

---

### parser.js (SMS Parser)
**Purpose**: Extract data from M-Pesa SMS messages
**Key Classes**: `MPesaParser` (static methods)
**Key Methods**:
- `parse(message)` - Parse SMS and return transaction object
- `isValid(transaction)` - Check if transaction is valid

**Extracts**:
- amount (KSh)
- type (sent/received/payment/withdrawal)
- recipient (name of person/merchant)
- balance (remaining M-Pesa balance)
- transactionId (reference number)
- timestamp (date/time)

**When to Edit**: To improve message parsing or handle new M-Pesa formats

---

### categorizer.js (Spending Categorizer)
**Purpose**: Assign spending categories to transactions
**Key Classes**: `Categorizer`
**Key Methods**:
- `categorize(transaction)` - Get category for transaction
- `getCategories()` - List all categories
- `addCategoryKeywords(category, keywords)` - Add custom keywords

**Categories**:
1. Food
2. Transport
3. Bills
4. Shopping
5. Utilities
6. Entertainment
7. Health
8. Savings
9. Personal
10. Income
11. Other

**When to Edit**: To add new categories or keywords

---

### storage.js (Data Persistence)
**Purpose**: Manage JSON file storage for transactions
**Key Classes**: `Storage`
**Key Methods**:
- `loadTransactions()` - Read from file
- `saveTransactions(transactions)` - Write to file
- `addTransaction(transaction)` - Add single transaction
- `getTransactions(filter)` - Filter by category/type/date
- `deleteTransaction(id)` - Remove transaction
- `clearAll()` - Delete all transactions
- `getFilePath()` - Get file location

**Filters**:
- `category` - Filter by spending category
- `type` - Filter by transaction type
- `startDate` - Filter by date range start
- `endDate` - Filter by date range end

**When to Edit**: To add new storage backends or filter types

---

### reporter.js (Report Generation)
**Purpose**: Generate spending summaries and reports
**Key Classes**: `Reporter` (static methods)
**Key Methods**:
- `generateSummary(transactions)` - Create summary object
- `printSummary(summary)` - Display formatted report
- `getCategoryPercentages(transactions)` - Get % breakdown
- `getTopCategories(transactions, limit)` - Top N categories

**Report Contains**:
- Total transactions count
- Total spent amount
- Total received amount
- Net amount (received - spent)
- Average per transaction
- Breakdown by category
- Breakdown by type

**When to Edit**: To add new report types or change formatting

---

## Configuration & Data Files

### package.json (Project Configuration)
**Purpose**: Node.js project metadata and scripts
**Scripts**:
- `npm start` - Run the application
- `npm test` - Run tests (can be customized)
- `npm run dev` - Run in dev mode

**When to Edit**: To add new scripts or update dependencies

---

### transactions.json (Data File)
**Purpose**: Store all user transactions
**Format**: JSON with transactions array
**Auto-created**: Yes (on first run)
**When to Edit**: Manually edit to fix/add transactions

**Example**:
```json
{
  "transactions": [
    {
      "id": "...",
      "amount": 1500,
      "type": "sent",
      "recipient": "John",
      "category": "Personal"
    }
  ]
}
```

---

### .gitignore (Git Configuration)
**Purpose**: Specify files to ignore in version control
**Ignores**:
- node_modules/
- .DS_Store
- transactions.json (local data)

**When to Edit**: To ignore additional file types

---

## Documentation Files

### README.md (Main Documentation)
**Contents**:
- Project overview and features
- Installation instructions
- Usage examples
- API reference
- Troubleshooting
- Future enhancements

**Read this for**: Complete documentation and API reference

---

### QUICKSTART.md (Quick Start Guide)
**Contents**:
- 2-minute setup
- Sample messages
- Menu reference
- Pro tips
- Troubleshooting

**Read this for**: Get started quickly

---

### PROJECT_SUMMARY.md (Project Overview)
**Contents**:
- What was built
- Project structure
- Getting started
- Feature overview
- Data storage format

**Read this for**: High-level project overview

---

### DEVELOPMENT.md (Development Guide)
**Contents**:
- How to add features
- Debugging guide
- Testing approach
- Code style guidelines
- Future enhancements

**Read this for**: Extend and customize the project

---

### SAMPLE_DATA.json (Example Data)
**Purpose**: Show example transaction format
**Contains**: 5 sample transactions
**Use for**: Reference, testing, or importing to try features

**When to use**: 
- See expected data format
- Test with pre-populated data
- Learn how transactions are structured

---

### .github/copilot-instructions.md (Development Guidelines)
**Purpose**: Copilot AI customization
**Contains**: Project context and guidelines
**For**: AI-assisted development

---

## Utility Files

### test.js (Test Suite)
**Purpose**: Verify all modules work correctly
**Tests**:
1. Parser functionality
2. Categorizer accuracy
3. Storage operations
4. Reporter calculations

**Run**: `node test.js`
**Output**: Pass/Fail status for each module

---

### example.js (Usage Examples)
**Purpose**: Show how to use modules programmatically
**Examples**:
1. Parsing M-Pesa messages
2. Categorizing transactions
3. Storing transactions
4. Generating reports
5. Custom categories
6. Top categories analysis

**Run**: `node example.js`
**Output**: Detailed examples with output

---

## Directory Structure

```
Student go/
├── Core Application
│   ├── index.js              ← Main app (run this)
│   ├── parser.js             ← Parse SMS
│   ├── categorizer.js        ← Categorize spending
│   ├── storage.js            ← Save data
│   └── reporter.js           ← Generate reports
│
├── Configuration
│   ├── package.json          ← Project config
│   ├── transactions.json     ← Data file (auto-created)
│   └── .gitignore            ← Git config
│
├── Documentation
│   ├── README.md             ← Full docs
│   ├── QUICKSTART.md         ← Quick start
│   ├── PROJECT_SUMMARY.md    ← Overview
│   ├── DEVELOPMENT.md        ← Dev guide
│   └── .github/
│       └── copilot-instructions.md
│
├── Utilities & Examples
│   ├── test.js               ← Tests
│   ├── example.js            ← Examples
│   └── SAMPLE_DATA.json      ← Sample data
│
└── This File
    └── FILE_REFERENCE.md     ← You are here
```

## Quick File Reference Table

| File | Type | Purpose | Edit For | Run With |
|------|------|---------|----------|----------|
| index.js | App | CLI interface | New features | `npm start` |
| parser.js | Module | Parse SMS | New formats | `node test.js` |
| categorizer.js | Module | Categorize | New categories | `node test.js` |
| storage.js | Module | Save/load | Storage backend | `node test.js` |
| reporter.js | Module | Reports | New reports | `node test.js` |
| test.js | Util | Tests | New tests | `node test.js` |
| example.js | Util | Examples | New examples | `node example.js` |
| README.md | Doc | Complete docs | Update docs | Read |
| QUICKSTART.md | Doc | Quick start | Update guide | Read |
| DEVELOPMENT.md | Doc | Dev guide | Update guide | Read |

## File Dependencies

```
Imports Tree:

index.js
├── ./parser.js      (imports)
├── ./categorizer.js (imports)
├── ./storage.js     (imports)
├── ./reporter.js    (imports)
└── readline         (built-in)

storage.js
├── fs               (built-in)
└── path             (built-in)

Other modules: No dependencies (can be used independently)
```

## How Files Work Together

```
1. User runs: npm start
2. index.js loads and displays menu
3. User enters M-Pesa SMS
4. parser.js extracts data
5. categorizer.js assigns category
6. storage.js saves to transactions.json
7. reporter.js generates summary
8. index.js displays report
9. Loop back to step 2
```

## Key Statistics

| Metric | Value |
|--------|-------|
| Total files | 14 |
| Application files | 5 |
| Documentation files | 6 |
| Utility files | 2 |
| Config files | 2 |
| Lines of code | ~800 |
| Test coverage | 4 modules |
| Categories supported | 11 |
| Data format | JSON |

## Common Edits

### Want to...

**Add new M-Pesa format** → Edit `parser.js`
**Add new category** → Edit `categorizer.js`
**Add new menu option** → Edit `index.js`
**Add new report type** → Edit `reporter.js`
**Change data storage** → Edit `storage.js`
**Test changes** → Run `node test.js`
**See examples** → Run `node example.js`
**Understand usage** → Read `README.md`
**Get started quick** → Read `QUICKSTART.md`
**Learn to develop** → Read `DEVELOPMENT.md`

---

All files are located in: `c:\Users\hp\OneDrive\Desktop\Student go\`

Last updated: 2026-05-04
