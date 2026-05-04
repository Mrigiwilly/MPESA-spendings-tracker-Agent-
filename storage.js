/**
 * Transaction Storage Manager
 * Handles reading and writing transactions to JSON file
 */

const fs = require('fs');
const path = require('path');

class Storage {
  constructor(filePath = 'transactions.json') {
    this.filePath = path.resolve(filePath);
    this.ensureFileExists();
  }

  /**
   * Ensure the JSON file exists
   */
  ensureFileExists() {
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify({ transactions: [] }, null, 2));
    }
  }

  /**
   * Load all transactions from file
   * @returns {Array} Array of transactions
   */
  loadTransactions() {
    try {
      const data = fs.readFileSync(this.filePath, 'utf-8');
      const parsed = JSON.parse(data);
      return parsed.transactions || [];
    } catch (error) {
      console.error('Error reading transactions:', error.message);
      return [];
    }
  }

  /**
   * Save transactions to file
   * @param {Array} transactions - Array of transactions
   * @returns {boolean} True if successful
   */
  saveTransactions(transactions) {
    try {
      const data = { transactions };
      fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error('Error saving transactions:', error.message);
      return false;
    }
  }

  /**
   * Add a new transaction
   * @param {Object} transaction - Transaction object with category
   * @returns {boolean} True if successful
   */
  addTransaction(transaction) {
    const transactions = this.loadTransactions();
    transaction.id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    transactions.push(transaction);
    return this.saveTransactions(transactions);
  }

  /**
   * Get transactions filtered by criteria
   * @param {Object} filter - Filter criteria (e.g., { category: 'Food', type: 'sent' })
   * @returns {Array} Filtered transactions
   */
  getTransactions(filter = {}) {
    let transactions = this.loadTransactions();

    if (filter.category) {
      transactions = transactions.filter(t => t.category === filter.category);
    }

    if (filter.type) {
      transactions = transactions.filter(t => t.type === filter.type);
    }

    if (filter.startDate) {
      const start = new Date(filter.startDate);
      transactions = transactions.filter(t => new Date(t.timestamp) >= start);
    }

    if (filter.endDate) {
      const end = new Date(filter.endDate);
      transactions = transactions.filter(t => new Date(t.timestamp) <= end);
    }

    return transactions;
  }

  /**
   * Delete a transaction by ID
   * @param {string} id - Transaction ID
   * @returns {boolean} True if successful
   */
  deleteTransaction(id) {
    const transactions = this.loadTransactions();
    const filtered = transactions.filter(t => t.id !== id);
    return this.saveTransactions(filtered);
  }

  /**
   * Clear all transactions
   * @returns {boolean} True if successful
   */
  clearAll() {
    return this.saveTransactions([]);
  }

  /**
   * Get file path
   * @returns {string} File path
   */
  getFilePath() {
    return this.filePath;
  }
}

module.exports = Storage;
