const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { AccountsOverviewPage } = require('../pages/AccountsOverviewPage');
const { TransferFundsPage } = require('../pages/TransferFundsPage');
const { AccountActivityPage } = require('../pages/AccountActivityPage');

const TEST_DATA = {
  username: 'john',
  password: 'demo',
  transferAmount: '50.00',
};

test.describe('ParaBank Transfer Funds', () => {
  let loginPage;
  let accountsOverviewPage;
  let transferFundsPage;
  let accountActivityPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    accountsOverviewPage = new AccountsOverviewPage(page);
    transferFundsPage = new TransferFundsPage(page);
    accountActivityPage = new AccountActivityPage(page);

    await loginPage.goto();
    await loginPage.login(TEST_DATA.username, TEST_DATA.password);
    await accountsOverviewPage.waitForLoad();
  });

  test('should transfer funds between accounts successfully', async ({ page }) => {
    const accountIds = await accountsOverviewPage.getAccountIds();
    expect(accountIds.length).toBeGreaterThanOrEqual(2);

    const fromAccount = accountIds[0];
    const toAccount = accountIds[1];
    expect(fromAccount).not.toBe(toAccount);

    await accountsOverviewPage.clickTransferFunds();

    await transferFundsPage.waitForLoad();

    const availableAccounts = await transferFundsPage.getAccountOptions();
    expect(availableAccounts).toContain(fromAccount);
    expect(availableAccounts).toContain(toAccount);

    await transferFundsPage.transferFunds(TEST_DATA.transferAmount, fromAccount, toAccount);

    await transferFundsPage.waitForTransferComplete();
    await transferFundsPage.waitForConfirmationDetails();

    const confirmationAmount = await transferFundsPage.getConfirmationAmount();
    expect(confirmationAmount).toBe(`$${parseFloat(TEST_DATA.transferAmount).toFixed(2)}`);

    const confirmationFromAccount = await transferFundsPage.getConfirmationFromAccount();
    const confirmationToAccount = await transferFundsPage.getConfirmationToAccount();
    expect(confirmationFromAccount).toBe(fromAccount);
    expect(confirmationToAccount).toBe(toAccount);

    const confirmationText = await page.locator('#showResult p').first().textContent();
    expect(confirmationText).toContain('has been transferred');
  });

  test('should show the transfer in the source account activity', async ({ page }) => {
    const accountIds = await accountsOverviewPage.getAccountIds();
    expect(accountIds.length).toBeGreaterThanOrEqual(2);

    const fromAccount = accountIds[0];
    const toAccount = accountIds[1];

    await accountsOverviewPage.clickTransferFunds();
    await transferFundsPage.waitForLoad();

    await transferFundsPage.transferFunds(TEST_DATA.transferAmount, fromAccount, toAccount);
    await transferFundsPage.waitForTransferComplete();

    await page.locator('#leftPanel a[href*="overview"]').click();
    await accountsOverviewPage.waitForLoad();

    await accountsOverviewPage.accountLinks.filter({ hasText: fromAccount }).click();
    await accountActivityPage.waitForLoad();

    const hasTransfer = await accountActivityPage.hasTransaction('Funds Transfer Received');
    const hasTransferSent = await accountActivityPage.hasTransaction('Funds Transfer Sent');
    expect(hasTransfer || hasTransferSent).toBeTruthy();
  });

  test('should reject transfer with empty amount', async ({ page }) => {
    const accountIds = await accountsOverviewPage.getAccountIds();
    expect(accountIds.length).toBeGreaterThanOrEqual(2);

    await accountsOverviewPage.clickTransferFunds();
    await transferFundsPage.waitForLoad();

    const amountInput = page.locator('#amount');
    await amountInput.fill('');
    await transferFundsPage.fromAccountSelect.selectOption(accountIds[0]);
    await transferFundsPage.toAccountSelect.selectOption(accountIds[1]);
    await transferFundsPage.transferButton.click();

    await expect(page.locator('#showError')).toBeVisible();
    await expect(page.locator('#showError h1.title')).toBeVisible();
  });
});
