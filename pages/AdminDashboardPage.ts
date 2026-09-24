import { Page, Locator } from '@playwright/test';
import { AdminCustomerPage } from './AdminCustomerPage';

export class AdminDashboardPage {
    private readonly page: Page;

    // Locators
    private readonly securityModalCloseButton: Locator;
    private readonly customersNavLink: Locator;
    private readonly customersSubLink: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators
        this.securityModalCloseButton = page.locator('#modal-security .btn-close');
        this.customersNavLink = page.locator('a.parent[href="#collapse-6"]');
        this.customersSubLink = page.locator('#collapse-6 a').filter({ hasText: 'Customers' }).first();
    }

    /**
     * Dismisses the security notification modal if it appears
     */
    async dismissSecurityModal(): Promise<void> {
        try {
            const modal = this.page.locator('#modal-security');
            if (await modal.isVisible({ timeout: 3000 })) {
                // The close button is an empty button inside the modal header
                await modal.getByRole('button').first().click();
            }
        } catch {
            // Modal not present, continue
        }
    }

    /**
     * Navigates to the Customers page via the sidebar menu
     * @returns Promise<AdminCustomerPage> - Instance of the customer page
     */
    async navigateToCustomers(): Promise<AdminCustomerPage> {
        await this.customersNavLink.click();
        await this.customersSubLink.click();
        await this.page.waitForURL(/route=customer\/customer/, { timeout: 15000 });
        return new AdminCustomerPage(this.page);
    }
}