/**
 * Transaction Reporter
 * Generates spending summaries and reports
 */

class Reporter {
  /**
   * Generate summary report from transactions
   * @param {Array} transactions - Array of transactions
   * @returns {Object} Summary report
   */
  static generateSummary(transactions) {
    if (!transactions || transactions.length === 0) {
      return {
        totalTransactions: 0,
        totalSpent: 0,
        totalReceived: 0,
        netAmount: 0,
        byCategory: {},
        byType: {},
        averageTransaction: 0
      };
    }

    let totalSpent = 0;
    let totalReceived = 0;
    const byCategory = {};
    const byType = {};

    transactions.forEach(transaction => {
      // Sum by amount and type
      if (transaction.type === 'received' || transaction.type === 'Income') {
        totalReceived += transaction.amount;
      } else {
        totalSpent += transaction.amount;
      }

      // Group by category
      if (transaction.category) {
        if (!byCategory[transaction.category]) {
          byCategory[transaction.category] = { count: 0, total: 0 };
        }
        byCategory[transaction.category].count++;
        byCategory[transaction.category].total += transaction.amount;
      }

      // Group by type
      if (transaction.type) {
        if (!byType[transaction.type]) {
          byType[transaction.type] = { count: 0, total: 0 };
        }
        byType[transaction.type].count++;
        byType[transaction.type].total += transaction.amount;
      }
    });

    return {
      totalTransactions: transactions.length,
      totalSpent: parseFloat(totalSpent.toFixed(2)),
      totalReceived: parseFloat(totalReceived.toFixed(2)),
      netAmount: parseFloat((totalReceived - totalSpent).toFixed(2)),
      byCategory: Object.entries(byCategory).reduce((acc, [key, value]) => {
        acc[key] = {
          count: value.count,
          total: parseFloat(value.total.toFixed(2)),
          average: parseFloat((value.total / value.count).toFixed(2))
        };
        return acc;
      }, {}),
      byType: Object.entries(byType).reduce((acc, [key, value]) => {
        acc[key] = {
          count: value.count,
          total: parseFloat(value.total.toFixed(2)),
          average: parseFloat((value.total / value.count).toFixed(2))
        };
        return acc;
      }, {}),
      averageTransaction: transactions.length > 0 
        ? parseFloat((totalSpent / transactions.length).toFixed(2)) 
        : 0
    };
  }

  /**
   * Print formatted summary report
   * @param {Object} summary - Summary object
   */
  static printSummary(summary) {
    console.log('\n' + '='.repeat(50));
    console.log('📊 SPENDING SUMMARY REPORT');
    console.log('='.repeat(50));

    console.log(`\n📈 Overview:`);
    console.log(`  • Total Transactions: ${summary.totalTransactions}`);
    console.log(`  • Total Spent: KSh ${summary.totalSpent.toLocaleString()}`);
    console.log(`  • Total Received: KSh ${summary.totalReceived.toLocaleString()}`);
    console.log(`  • Net Amount: KSh ${summary.netAmount.toLocaleString()}`);
    console.log(`  • Average per Transaction: KSh ${summary.averageTransaction.toLocaleString()}`);

    console.log(`\n💰 Spending by Category:`);
    const categories = Object.entries(summary.byCategory)
      .sort((a, b) => b[1].total - a[1].total);

    if (categories.length === 0) {
      console.log('  • No spending data');
    } else {
      categories.forEach(([category, data]) => {
        const percentage = summary.totalSpent > 0 
          ? ((data.total / summary.totalSpent) * 100).toFixed(1)
          : 0;
        console.log(`  • ${category}: KSh ${data.total.toLocaleString()} (${data.count} transactions, ${percentage}%)`);
      });
    }

    console.log(`\n📋 Transaction Types:`);
    Object.entries(summary.byType).forEach(([type, data]) => {
      console.log(`  • ${type}: KSh ${data.total.toLocaleString()} (${data.count} transactions)`);
    });

    console.log('\n' + '='.repeat(50) + '\n');
  }

  /**
   * Get category spending breakdown as percentage
   * @param {Array} transactions - Array of transactions
   * @returns {Object} Category percentages
   */
  static getCategoryPercentages(transactions) {
    const summary = this.generateSummary(transactions);
    const percentages = {};

    Object.entries(summary.byCategory).forEach(([category, data]) => {
      percentages[category] = summary.totalSpent > 0
        ? ((data.total / summary.totalSpent) * 100).toFixed(2) + '%'
        : '0%';
    });

    return percentages;
  }

  /**
   * Get top spending categories
   * @param {Array} transactions - Array of transactions
   * @param {number} limit - Number of top categories to return
   * @returns {Array} Top categories
   */
  static getTopCategories(transactions, limit = 5) {
    const summary = this.generateSummary(transactions);
    return Object.entries(summary.byCategory)
      .sort((a, b) => b[1].total - a[1].total)
      .slice(0, limit)
      .map(([category, data]) => ({
        category,
        total: data.total,
        count: data.count,
        average: data.average
      }));
  }
}

module.exports = Reporter;
