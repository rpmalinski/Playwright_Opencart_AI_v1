import { Page, Locator } from '@playwright/test';

export class LoginPage {
    private readonly page: Page;

    // Locators
    private readonly emailInput: Locator;
    private readonly passwordInput: Locator;
    private readonly loginButton: Locator;
    private readonly returningCustomerHeading: Locator;
    private readonly warningMessage: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators
        this.emailInput = page.getByLabel('E-Mail Address');
        this.passwordInput = page.getByLabel('Password');
        this.loginButton = page.getByRole('button', { name: 'Login' });
        this.returningCustomerHeading = page.getByRole('heading', { name: 'Returning Customer' });
        this.warningMessage = page.locator('.alert-danger');
    }

    /**
     * Verifies the login page is displayed
     * @returns Promise<boolean> - true if the login page is visible
     */
    async isLoginPageExists(): Promise<boolean> {
        try {
            await this.returningCustomerHeading.waitFor({ state: 'visible', timeout: 10000 });
            return true;
        } catch (error) {
            console.log(`Error checking Login page: ${error}`);
            return false;
        }
    }

    /**
     * Performs login with the given credentials
     * @param email - User email
     * @param password - User password
     */
    async login(email: string, password: string): Promise<void> {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    /**
     * Gets the warning message text after a failed login attempt
     * @returns Promise<string> - The warning message text
     */
    async getWarningMessage(): Promise<string> {
        try {
            await this.warningMessage.waitFor({ state: 'visible', timeout: 10000 });
            return await this.warningMessage.textContent() || '';
        } catch (error) {
            console.log(`Error getting warning message: ${error}`);
            return '';
        }
    }

    /**
     * Checks if the warning message is displayed
     * @returns Promise<boolean> - true if the warning message is visible
     */
    async isWarningMessageDisplayed(): Promise<boolean> {
        try {
            await this.warningMessage.waitFor({ state: 'visible', timeout: 10000 });
            return true;
        } catch (error) {
            console.log(`Error checking warning message: ${error}`);
            return false;
        }
    }
}