const { expect } = require('@playwright/test');

exports.AccountActivityPage = class AccountActivityPage {
  constructor(page) {
    this.page = page;
    this.accountTable = page.locator('#accountTable');
    this.transactionLinks = page.locator('#transactionTable tbody a');
    this.noTransactionsMessage = page.locator('#noTransactions');
  }

  async waitForLoad() {
    await expect(this.page.locator('#accountId')).toBeVisible();
  }

  async getTransactionDescriptions() {
    return this.transactionLinks.allTextContents();
  }

  async hasTransaction(description) {
    const descriptions = await this.getTransactionDescriptions();
    return descriptions.includes(description);
  }
};
