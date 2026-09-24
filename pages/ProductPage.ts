import { Page, Locator } from '@playwright/test';

export class ProductPage {
    private readonly page: Page;

    // Locators
    private readonly productHeading: Locator;
    private readonly addToCartButton: Locator;
    private readonly quantityInput: Locator;
    private readonly successAlert: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators
        this.productHeading = page.getByRole('heading', { level: 1 });
        this.addToCartButton = page.locator('#button-cart');
        this.quantityInput = page.locator('#input-quantity');
        this.successAlert = page.locator('.alert.alert-success');
    }

    /**
     * Gets the product name from the heading
     * @returns Promise<string> - The product name text
     */
    async getProductName(): Promise<string> {
        return await this.productHeading.textContent() ?? '';
    }

    /**
     * Verifies the product details page is displayed
     * @returns Promise<boolean> - true if the product heading is visible
     */
    async isProductPageExists(): Promise<boolean> {
        try {
            await this.productHeading.waitFor({ state: 'visible' });
            return true;
        } catch (error) {
            console.log(`Error checking product page: ${error}`);
            return false;
        }
    }

    /**
     * Sets the quantity for the product
     * @param quantity - Quantity value
     */
    async setQuantity(quantity: string): Promise<void> {
        await this.quantityInput.fill(quantity);
    }

    /**
     * Clicks the Add to Cart button
     */
    async clickAddToCart(): Promise<void> {
        await this.addToCartButton.click({ force: true });
    }

    /**
     * Gets the success alert text after adding a product to the cart
     * @returns Promise<string> - The success alert message text
     */
    async getSuccessAlertText(): Promise<string> {
        try {
            await this.successAlert.waitFor({ state: 'visible', timeout: 5000 });
            return await this.successAlert.textContent() ?? '';
        } catch (error) {
            console.log(`Error getting success alert: ${error}`);
            return '';
        }
    }
}