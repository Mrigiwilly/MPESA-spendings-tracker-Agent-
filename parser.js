/**
 * M-Pesa SMS Parser
 * Extracts transaction details from M-Pesa SMS messages
 */

class MPesaParser {
  /**
   * Parse M-Pesa SMS message and extract transaction details
   * @param {string} message - The SMS message text
   * @returns {Object} Parsed transaction object
   */
  static parse(message) {
    if (!message || typeof message !== 'string') {
      return null;
    }

    const transaction = {
      amount: null,
      type: null, // 'sent' or 'received'
      recipient: null,
      balance: null,
      transactionId: null,
      timestamp: new Date().toISOString(),
      rawMessage: message
    };

    // Detect transaction type
    const lowerMsg = message.toLowerCase();
    if (lowerMsg.includes('sent to') || lowerMsg.includes('have sent')) {
      transaction.type = 'sent';
    } else if (lowerMsg.includes('received from') || lowerMsg.includes('have received')) {
      transaction.type = 'received';
    } else if (lowerMsg.includes('withdrawal') || lowerMsg.includes('bought')) {
      transaction.type = 'withdrawal';
    } else if (lowerMsg.includes('payment') || lowerMsg.includes('paid to') || lowerMsg.includes('paid')) {
      transaction.type = 'payment';
    }

    // Extract amount (looks for "KSh" or "Ksh" followed by number)
    const amountMatch = message.match(/(?:KSh\s*|Ksh\s*|Ksh\.?\s*)([0-9,]+(?:\.[0-9]{2})?)/i);
    if (amountMatch) {
      transaction.amount = parseFloat(amountMatch[1].replace(/,/g, ''));
    }

    // Extract recipient/sender name
    const recipientPatterns = [
      /(?:sent to|have sent.*?to)\s+([A-Za-z\s]+?)(?:\.|,|\s+Balance)/i,
      /(?:received from|have received.*?from)\s+([A-Za-z\s]+?)(?:\.|,|\s+Balance)/i,
      /paid to\s+([A-Za-z\s]+?)(?:\s+for|\s+KSh|\s+Ksh|\.)/i,
      /(?:paid)\s+(?:to\s+)?([A-Za-z\s]+?)\s+(?:for|\s+KSh|\s+Ksh|\.)/i,
      /bought\s+(?:airtime|data|bundle)?\s*(?:from\s+)?([A-Za-z\s]+)?(?:\s+KSh|\s+Ksh|\.)/i
    ];

    for (const pattern of recipientPatterns) {
      const match = message.match(pattern);
      if (match && match[1]) {
        transaction.recipient = match[1].trim();
        break;
      }
    }

    // Extract balance (remaining amount after transaction)
    const balanceMatch = message.match(/Balance\s*(?:is\s*)?(?:KSh|Ksh\.?\s*)?([0-9,]+(?:\.[0-9]{2})?)/i);
    if (balanceMatch) {
      transaction.balance = parseFloat(balanceMatch[1].replace(/,/g, ''));
    }

    // Extract transaction ID
    const transactionIdMatch = message.match(/[A-Z]{2}[0-9]{10,12}/);
    if (transactionIdMatch) {
      transaction.transactionId = transactionIdMatch[0];
    }

    return transaction;
  }

  /**
   * Validate parsed transaction
   * @param {Object} transaction - Parsed transaction object
   * @returns {boolean} True if transaction is valid
   */
  static isValid(transaction) {
    return transaction &&
           transaction.amount !== null &&
           transaction.amount > 0 &&
           transaction.type !== null &&
           transaction.type !== '';
  }
}

module.exports = MPesaParser;
