const { expect } = require('@playwright/test');

exports.TransferFundsPage = class TransferFundsPage {
  constructor(page) {
    this.page = page;
    this.amountInput = page.locator('#amount');
    this.fromAccountSelect = page.locator('#fromAccountId');
    this.toAccountSelect = page.locator('#toAccountId');
    this.transferButton = page.locator('input[value="Transfer"]');
  }

  async waitForLoad() {
    await expect(this.amountInput).toBeVisible();
    await expect(this.fromAccountSelect).toBeVisible();
    await expect(this.toAccountSelect).toBeVisible();
    await expect(this.fromAccountSelect.locator('option')).not.toHaveCount(0);
  }

  async getAccountOptions() {
    return this.fromAccountSelect.locator('option').allTextContents();
  }

  async transferFunds(amount, fromAccount, toAccount) {
    await this.amountInput.fill(amount.toString());
    await this.fromAccountSelect.selectOption(fromAccount);
    await this.toAccountSelect.selectOption(toAccount);
    await this.transferButton.click();
  }

  async waitForTransferComplete() {
    await expect(this.page.locator('#showResult h1.title')).toHaveText('Transfer Complete!');
  }

  async waitForConfirmationDetails() {
    await expect(this.page.locator('#amountResult')).not.toBeEmpty();
  }

  async getConfirmationAmount() {
    return this.page.locator('#amountResult').textContent();
  }

  async getConfirmationFromAccount() {
    return this.page.locator('#fromAccountIdResult').textContent();
  }

  async getConfirmationToAccount() {
    return this.page.locator('#toAccountIdResult').textContent();
  }
};
