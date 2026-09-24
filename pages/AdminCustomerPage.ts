import { Page, Locator, expect } from '@playwright/test';

export class AdminCustomerPage {
    private readonly page: Page;

    // Locators
    private readonly filterEmailInput: Locator;
    private readonly filterButton: Locator;
    private readonly resetButton: Locator;
    private readonly customerTable: Locator;
    private readonly customerRows: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators
        this.filterEmailInput = page.getByRole('textbox', { name: 'E-Mail' });
        this.filterButton = page.getByRole('button', { name: 'Filter' });
        this.resetButton = page.getByRole('button', { name: 'Reset' });
        this.customerTable = page.locator('table.table');
        this.customerRows = page.locator('table.table tbody tr');
    }

    /**
     * Verifies the Customers page is displayed
     * @returns Promise<boolean> - true if the customer table is visible
     */
    async isCustomerPageExists(): Promise<boolean> {
        try {
            await this.customerTable.waitFor({ state: 'visible', timeout: 10000 });
            return true;
        } catch (error) {
            console.log(`Error checking Customers page: ${error}`);
            return false;
        }
    }

    /**
     * Filters customers by email address.
     * Waits for the table to fully reload after filtering.
     * @param email - The email to search for
     */
    async filterByEmail(email: string): Promise<void> {
        await this.filterEmailInput.fill(email);
        await this.filterButton.click();
        // Wait for network to settle and table to re-render
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(1000);
    }

    /**
     * Gets the number of customer rows in the table body
     * @returns Promise<number> - The count of rows
     */
    async getCustomerRowCount(): Promise<number> {
        return await this.customerRows.count();
    }

    /**
     * Gets the customer name from the first row
     * @returns Promise<string> - The customer name text
     */
    async getFirstRowCustomerName(): Promise<string> {
        return await this.customerRows.nth(0).locator('td').nth(1).textContent() || '';
    }

    /**
     * Gets the customer email from the first row
     * @returns Promise<string> - The customer email text
     */
    async getFirstRowEmail(): Promise<string> {
        return await this.customerRows.nth(0).locator('td').nth(2).textContent() || '';
    }

    /**
     * Gets the customer status from the first row
     * @returns Promise<string> - The customer status text
     */
    async getFirstRowStatus(): Promise<string> {
        return await this.customerRows.nth(0).locator('td').nth(4).textContent() || '';
    }

    /**
     * Clicks the Edit link for the first customer row.
     * Uses getByRole on the row's action cell for a reliable locator.
     */
    async clickEditFirstRow(): Promise<void> {
        const editLink = this.customerRows.nth(0).locator('td').nth(5).getByRole('link', { name: 'Edit' });
        await editLink.waitFor({ state: 'visible', timeout: 10000 });
        await editLink.click();
        await this.page.waitForURL(/route=customer\/customer\.form/, { timeout: 15000 });
    }

    /**
     * Gets the customer name from the edit form
     * @returns Promise<string> - The customer name value
     */
    async getEditFormFirstName(): Promise<string> {
        return await this.page.locator('#input-firstname').inputValue();
    }

    /**
     * Gets the customer last name from the edit form
     * @returns Promise<string> - The customer last name value
     */
    async getEditFormLastName(): Promise<string> {
        return await this.page.locator('#input-lastname').inputValue();
    }

    /**
     * Gets the customer email from the edit form
     * @returns Promise<string> - The customer email value
     */
    async getEditFormEmail(): Promise<string> {
        return await this.page.locator('#input-email').inputValue();
    }
}