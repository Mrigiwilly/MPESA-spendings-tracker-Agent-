# Quick Start Guide 🚀

Get your M-Pesa Transaction Analyzer up and running in 2 minutes!

## Step 1: Install & Run

```bash
# Navigate to project directory
cd mpesa-transaction-analyzer

# Start the application
npm start
```

## Step 2: Add Your First Transaction

1. Select option `1` from the menu
2. Paste an M-Pesa SMS message
3. Review the parsed details
4. Type `y` to save

### Example Messages to Try

Copy and paste one of these:

```
You have sent KSh1,500 to stem kirigi. Balance is KSh5,234.50
```

```
KSh50 paid to Safaricom for airtime. Balance is KSh7,184.50
```

```
You have sent KSh300 to Uber Driver. Balance is KSh4,884.50
```

```
You have received KSh2,000 from savannah kioko. Balance is KSh6,884.50
```

## Step 3: View Your Spending

1. Select option `3` - "Generate spending summary"
2. See your total spending and breakdown by category

## Step 4: Analyze By Category

1. Select option `4` - "View spending by category"
2. See which categories you spend most on

## Menu Reference

| Option | Description | Shortcut |
|--------|-------------|----------|
| 1 | Add new M-Pesa SMS | Type and paste SMS |
| 2 | View all transactions | See all records |
| 3 | Generate summary | Get totals |
| 4 | Spending by category | See breakdown |
| 5 | Delete transaction | Remove a record |
| 6 | Clear all | Delete everything |
| 7 | Export transactions | View file location |
| 8 | Exit | Close app |

## File Format

Your transactions are stored in `transactions.json`:

```json
{
  "transactions": [
    {
      "amount": 1500,
      "type": "sent",
      "recipient": "stem kirigi",
      "category": "Personal",
      "balance": 5234.50
    }
  ]
}
```

## Supported Transaction Types

- ✅ `You have sent KSh...` → "sent"
- ✅ `You have received KSh...` → "received"
- ✅ `KSh... paid to...` → "payment"
- ✅ `Withdrawal of KSh...` → "withdrawal"

## Auto Categories

Your transactions are automatically sorted into:

- 🍔 **Food** - Restaurants, cafes, food delivery
- 🚗 **Transport** - Uber, Bolt, taxi, fuel
- 💡 **Bills** - Airtime, data, utilities
- 🛒 **Shopping** - Groceries, clothes, retail
- 🎬 **Entertainment** - Movies, music, gaming
- 🏥 **Health** - Hospital, pharmacy, doctor
- 💰 **Savings** - Investments, savings
- 👥 **Personal** - Friends, family transfers
- 📥 **Income** - Received payments
- ❓ **Other** - Uncategorized

## Pro Tips

1. **Use Full Names**: Include merchant/person names for better categorization
2. **Paste Exact SMS**: Copy the exact M-Pesa message text
3. **Regular Updates**: Add transactions as you receive them
4. **Backup Data**: Keep backup of `transactions.json`

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Ctrl+C | Exit (from any menu) |
| Enter | Confirm choice |
| y/n | Quick yes/no response |

## Sample Workflow

```
1. Receive M-Pesa SMS from Safaricom
2. Open app: npm start
3. Choose option 1
4. Paste the SMS
5. Review parsed data
6. Type 'y' to save
7. Choose option 3 to see summary
8. Check spending by category
9. Exit when done
```

## Troubleshooting

### "Could not parse M-Pesa message"
- Make sure message includes amount (KSh)
- Message must have transaction type (sent/received/paid)

### "No transactions recorded"
- You need to add at least one transaction first
- See Step 2 above

### Want to try with sample data?
- Open `SAMPLE_DATA.json` to see example format
- Copy the transactions into `transactions.json` if you want to test

## Next Steps

- Explore all menu options
- Add 5-10 transactions to see meaningful reports
- Check README.md for advanced features
- Customize categories in `categorizer.js`

---

**Ready? Run `npm start` now!** 🎯
