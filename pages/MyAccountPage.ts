import { Page, Locator } from '@playwright/test';

export class MyAccountPage {
    private readonly page: Page;

    // Locators
    private readonly myAccountHeading: Locator;
    private readonly myAccountDropdown: Locator;
    private readonly logoutLink: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators
        // this.myAccountHeading = page.locator('#content h1');
        this.myAccountHeading = page.locator('#content').getByRole('heading', { name: 'My Account' });
        // this.myAccountDropdown = page.locator('.dropdown-toggle').nth(1);
        this.myAccountDropdown = page.getByRole('link', { name: ' My Account' });
        // this.logoutLink = page.locator('#top .dropdown-item').filter({ hasText: 'Logout' });
        this.logoutLink = page.locator('#top-links').getByRole('link', { name: 'Logout' });
    }

    /**
     * Verifies the My Account page is displayed (auto-waits for the heading)
     * @returns Promise<boolean> - true if the My Account heading is visible
     */
    async isMyAccountPageExists(): Promise<boolean> {
        try {
            await this.myAccountHeading.waitFor({ state: 'visible', timeout: 10000 });
            return true;
        } catch (error) {
            console.log(`Error checking My Account page: ${error}`);
            return false;
        }
    }

    /**
     * Opens the My Account dropdown menu
     */
    async openMyAccountDropdown(): Promise<void> {
        await this.myAccountDropdown.click();
    }

    /**
     * Clicks the Logout link from the My Account dropdown
     */
    async clickLogout(): Promise<void> {
        await this.logoutLink.click();
    }
}