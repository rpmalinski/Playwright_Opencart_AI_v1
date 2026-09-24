import { Page, Locator } from '@playwright/test';

export class SearchResultsPage {
    private readonly page: Page;

    // Locators
    private readonly productLinks: Locator;
    private readonly pageHeading: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators
        this.productLinks = page.locator('.product-thumb .description h4 a');
        this.pageHeading = page.getByRole('heading', { level: 1 });
    }

    /**
     * Verifies the search results page is displayed
     * @returns Promise<boolean> - true if the search results page is displayed
     */
    async isSearchResultsPageExists(): Promise<boolean> {
        try {
            await this.pageHeading.waitFor({ state: 'visible' });
            return true;
        } catch (error) {
            console.log(`Error checking search results page: ${error}`);
            return false;
        }
    }

    /**
     * Checks whether the expected product appears in the search results
     * @param productName - The product name to look for
     * @returns Promise<boolean> - true if the product is displayed in the results
     */
    async isProductDisplayed(productName: string): Promise<boolean> {
        try {
            await this.productLinks.filter({ hasText: productName }).first().waitFor({ state: 'visible' });
            return true;
        } catch (error) {
            console.log(`Error checking product in results: ${error}`);
            return false;
        }
    }

    /**
     * Gets the names of all products displayed in the search results
     * @returns Promise<string[]> - The product names
     */
    async getProductNames(): Promise<string[]> {
        return (await this.productLinks.allTextContents()).map((name) => name.trim());
    }

    /**
     * Opens a product details page by clicking on the product link
     * @param productName - The product name to click
     */
    async openProduct(productName: string): Promise<void> {
        const productLink = this.productLinks.filter({ hasText: productName }).first();
        await productLink.click();
        await this.page.waitForLoadState('networkidle');
    }
}