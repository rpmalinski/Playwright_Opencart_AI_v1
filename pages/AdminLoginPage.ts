import { Page, Locator } from '@playwright/test';
import { AdminDashboardPage } from './AdminDashboardPage';

export class AdminLoginPage {
    private readonly page: Page;

    // Locators
    private readonly usernameInput: Locator;
    private readonly passwordInput: Locator;
    private readonly loginButton: Locator;
    private readonly heading: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators
        this.usernameInput = page.getByRole('textbox', { name: 'Username' });
        this.passwordInput = page.getByRole('textbox', { name: 'Password' });
        this.loginButton = page.getByRole('button', { name: 'Login' });
        this.heading = page.locator('#header');
    }

    /**
     * Navigates to the admin login page
     */
    async goto(): Promise<void> {
        await this.page.goto(process.env.ADMIN_APP_URL || 'http://localhost/opencart/admin/index.php');
    }

    /**
     * Verifies the admin login page is displayed
     * @returns Promise<boolean> - true if the login page is visible
     */
    async isLoginPageExists(): Promise<boolean> {
        try {
            await this.usernameInput.waitFor({ state: 'visible', timeout: 10000 });
            return true;
        } catch (error) {
            console.log(`Error checking admin login page: ${error}`);
            return false;
        }
    }

    /**
     * Performs admin login with the given credentials
     * @param username - Admin username
     * @param password - Admin password
     * @returns Promise<AdminDashboardPage> - Instance of the dashboard page
     */
    async login(username: string, password: string): Promise<AdminDashboardPage> {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
        await this.page.waitForURL(/route=common\/dashboard/, { timeout: 15000 });
        return new AdminDashboardPage(this.page);
    }
}