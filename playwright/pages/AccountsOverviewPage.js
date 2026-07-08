const { expect } = require('@playwright/test');

exports.AccountsOverviewPage = class AccountsOverviewPage {
  constructor(page) {
    this.page = page;
    this.accountTable = page.locator('#accountTable');
    this.accountLinks = page.locator('#accountTable tbody a');
    this.transferFundsLink = page.locator('#leftPanel a[href*="transfer"]');
  }

  async waitForLoad() {
    await expect(this.accountTable).toBeVisible();
    await expect(this.accountLinks.first()).toBeVisible();
  }

  async getAccountIds() {
    return this.accountLinks.allTextContents();
  }

  async clickTransferFunds() {
    await this.transferFundsLink.click();
    await expect(this.page).toHaveURL(/\/transfer\.htm/);
  }
};
