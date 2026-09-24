import { Page, Locator } from '@playwright/test';

export class HomePage {
    private readonly page: Page;

    // Locators
    private readonly myAccountDropdown: Locator;
    private readonly registerLink: Locator;
    private readonly loginLink: Locator;
    private readonly searchBox: Locator;
    private readonly searchButton: Locator;
    private readonly cartButton: Locator;
    private readonly shoppingCartLink: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators
        this.myAccountDropdown = page.locator('.dropdown-toggle').nth(1);
        this.registerLink = page.getByRole('link', { name: 'Register' });
        this.loginLink = page.getByRole('link', { name: 'Login' });
        this.searchBox = page.getByPlaceholder('Search');
        this.searchButton = page.locator('button.btn.btn-light.btn-lg');
        this.cartButton = page.locator('button.btn-lg.btn-dark');
        this.shoppingCartLink = page.getByRole('link', { name: 'Shopping Cart' });
    }

    /**
     * Opens the My Account dropdown menu
     */
    async openMyAccountDropdown(): Promise<void> {
        await this.myAccountDropdown.click();
    }

    /**
     * Clicks the Register link from the My Account dropdown
     */
    async clickRegister(): Promise<void> {
        await this.registerLink.click();
    }

    /**
     * Clicks the Login link from the My Account dropdown
     */
    async clickLogin(): Promise<void> {
        await this.loginLink.click();
    }

    /**
     * Retrieves the text of the items in the open My Account dropdown
     * @returns Promise<string[]> - the dropdown item texts
     */
    async getMyAccountDropdownItems(): Promise<string[]> {
        const items = await this.page.locator('#top .dropdown-menu.dropdown-menu-right a').allTextContents();
        return items.map((item) => item.trim()).filter((item) => item.length > 0);
    }

    /**
     * Checks whether the Logout option is present in the My Account dropdown
     * @returns Promise<boolean> - true if Logout is displayed (user still authenticated)
     */
    async isLogoutOptionVisible(): Promise<boolean> {
        try {
            await this.page.locator('#top .dropdown-menu.dropdown-menu-right a').filter({ hasText: 'Logout' }).waitFor({ state: 'visible', timeout: 5000 });
            return true;
        } catch (error) {
            console.log(`Error checking Logout option: ${error}`);
            return false;
        }
    }

    /**
     * Searches for a product
     * @param productName - The product name to search for
     */
    async searchForProduct(productName: string): Promise<void> {
        await this.searchBox.fill(productName);
        await this.searchButton.click();
        await this.page.waitForURL(/route=product\/search/, { waitUntil: 'domcontentloaded' });
    }

    /**
     * Verifies the main product search field is displayed
     * @returns Promise<boolean> - true if the search field is displayed
     */
    async isSearchFieldVisible(): Promise<boolean> {
        try {
            await this.searchBox.waitFor({ state: 'visible' });
            return true;
        } catch (error) {
            console.log(`Error checking search field: ${error}`);
            return false;
        }
    }

    /**
     * Navigates to the shopping cart
     */
    async openCart(): Promise<void> {
        await this.cartButton.click();
    }

    /**
     * Clicks the Shopping Cart link in the header navigation
     */
    async clickShoppingCartLink(): Promise<void> {
        await this.shoppingCartLink.click();
    }
}