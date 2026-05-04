/**
 * Transaction Categorizer
 * Assigns categories to transactions based on recipient/description
 */

class Categorizer {
  constructor() {
    this.categories = {
      Food: ['food', 'restaurant', 'cafe', 'pizza', 'burger', 'chips', 'chicken', 'eat', 'uber eats', 'glovo', 'jambas'],
      Transport: ['uber', 'bolt', 'taxi', 'bus', 'transit', 'fuel', 'mpesa pay', 'transport', 'parking'],
      Bills: ['electric', 'water', 'internet', 'phone', 'telkom', 'airtime', 'data', 'bundle', 'credit', 'postpaid', 'safaricom', 'airtel', 'equity', 'kcb', 'stanbic'],
      Shopping: ['shop', 'store', 'market', 'jumia', 'amazon', 'clothes', 'shopping', 'retail', 'mall', 'supermarket'],
      Utilities: ['electricity', 'water', 'gas', 'sewerage', 'waste'],
      Entertainment: ['cinema', 'movie', 'music', 'spotify', 'netflix', 'gaming', 'game', 'entertainment'],
      Health: ['hospital', 'clinic', 'pharmacy', 'doctor', 'medicine', 'health', 'dental'],
      Savings: ['mpesa loan', 'investment', 'savings'],
      Personal: ['loan', 'borrow', 'lend'],
      Other: []
    };
  }

  /**
   * Categorize a transaction based on recipient and description
   * @param {Object} transaction - Parsed transaction object
   * @returns {string} Category name
   */
  categorize(transaction) {
    if (!transaction) {
      return 'Other';
    }

    // For received transactions, typically don't categorize as spending
    if (transaction.type === 'received') {
      return 'Income';
    }

    // Combine recipient and raw message for better matching
    const searchText = `${transaction.recipient || ''} ${transaction.rawMessage || ''}`.toLowerCase();

    // Check each category for matching keywords
    for (const [category, keywords] of Object.entries(this.categories)) {
      if (category === 'Other') continue; // Skip 'Other' in loop

      for (const keyword of keywords) {
        if (searchText.includes(keyword.toLowerCase())) {
          return category;
        }
      }
    }

    // Default to Other if no match found
    return 'Other';
  }

  /**
   * Get all available categories
   * @returns {Array} List of category names
   */
  getCategories() {
    return Object.keys(this.categories);
  }

  /**
   * Add custom category keywords
   * @param {string} category - Category name
   * @param {Array} keywords - Keywords to add
   */
  addCategoryKeywords(category, keywords) {
    if (!this.categories[category]) {
      this.categories[category] = [];
    }
    this.categories[category].push(...keywords);
  }
}

module.exports = Categorizer;
