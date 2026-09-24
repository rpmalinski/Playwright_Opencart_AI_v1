import { Page, Locator } from '@playwright/test';

export class CartPage {
    private readonly page: Page;

    // Locators
    private readonly cartHeading: Locator;
    private readonly productNameCell: Locator;
    private readonly quantityInput: Locator;
    private readonly unitPriceCell: Locator;
    private readonly totalCell: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators
        this.cartHeading = page.getByRole('heading', { name: 'Shopping Cart' });
        this.productNameCell = page.locator('table.table-bordered td.text-start a');
        this.quantityInput = page.locator('table.table-bordered input[name="quantity"]');
        this.unitPriceCell = page.locator('table.table-bordered').nth(1).locator('tbody tr td.text-end').first();
        this.totalCell = page.locator('table.table-bordered').nth(1).locator('tfoot tr:last-child td.text-end').last();
    }

    /**
     * Verifies the shopping cart page is displayed
     * @returns Promise<boolean> - true if the cart heading is visible
     */
    async isCartPageExists(): Promise<boolean> {
        try {
            return await this.cartHeading.isVisible();
        } catch (error) {
            console.log(`Error checking cart page: ${error}`);
            return false;
        }
    }

    /**
     * Gets the product name in the cart
     * @returns Promise<string> - The product name text
     */
    async getProductName(): Promise<string> {
        return await this.productNameCell.textContent() ?? '';
    }

    /**
     * Gets the quantity value from the cart
     * @returns Promise<string> - The quantity value
     */
    async getQuantity(): Promise<string> {
        return await this.quantityInput.inputValue();
    }

    /**
     * Gets the unit price text from the cart
     * @returns Promise<string> - The unit price text
     */
    async getUnitPrice(): Promise<string> {
        return await this.unitPriceCell.first().textContent() ?? '';
    }

    /**
     * Gets the total price text from the cart
     * @returns Promise<string> - The total price text
     */
    async getTotalPrice(): Promise<string> {
        return await this.totalCell.first().textContent() ?? '';
    }
}