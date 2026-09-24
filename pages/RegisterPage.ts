import { Page, Locator } from '@playwright/test';
import { SuccessPage } from './SuccessPage';

export class RegisterPage {
    private readonly page: Page;

    // Locators
    private readonly firstNameInput: Locator;
    private readonly lastNameInput: Locator;
    private readonly emailInput: Locator;
    private readonly passwordInput: Locator;
    private readonly subscribeCheckbox: Locator;
    private readonly privacyPolicyCheckbox: Locator;
    private readonly continueButton: Locator;
    private readonly registerHeading: Locator;
    private readonly telephoneInput: Locator;
    private readonly passwordConfirmInput: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators
        this.firstNameInput = page.locator('#input-firstname');
        this.lastNameInput = page.locator('#input-lastname');
        this.emailInput = page.locator('#input-email');
        this.passwordInput = page.locator('#input-password');
        this.subscribeCheckbox = page.locator('#input-newsletter');
        this.privacyPolicyCheckbox = page.locator('input[name="agree"]');
        // this.continueButton = page.locator('#form-register button[type="submit"]');
        this.continueButton = page.getByRole('button', { name: 'Continue' });
        this.registerHeading = page.getByRole('heading', { name: 'Register Account' });
        this.telephoneInput = page.locator('#input-telephone');
        this.passwordConfirmInput = page.locator('#input-confirm');
    }

    /**
     * Verifies the Register Account page is displayed
     * @returns Promise<boolean> - true if the Register Account heading is visible
     */
    async isRegisterPageExists(): Promise<boolean> {
        try {
            return await this.registerHeading.isVisible();
        } catch (error) {
            console.log(`Error checking Register page: ${error}`);
            return false;
        }
    }

    /**
     * Fills the first name field
     * @param firstName - First name value
     */
    async setFirstName(firstName: string): Promise<void> {
        await this.firstNameInput.fill(firstName);
    }

    /**
     * Fills the last name field
     * @param lastName - Last name value
     */
    async setLastName(lastName: string): Promise<void> {
        await this.lastNameInput.fill(lastName);
    }

    /**
     * Fills the email field
     * @param email - Email value
     */
    async setEmail(email: string): Promise<void> {
        await this.emailInput.fill(email);
    }

    /**
     * Fills the password field
     * @param password - Password value
     */
    async setPassword(password: string): Promise<void> {
        await this.passwordInput.fill(password);
    }

    /**
     * Fills the telephone field if it is visible on the registration form
     * @param telephone - Telephone number value
     */
    async setTelephone(telephone: string): Promise<void> {
        if (await this.telephoneInput.isVisible()) {
            await this.telephoneInput.fill(telephone);
        }
    }

    /**
     * Fills the password confirmation field if it is visible on the registration form
     * @param password - Password value to confirm
     */
    async setPasswordConfirm(password: string): Promise<void> {
        if (await this.passwordConfirmInput.isVisible()) {
            await this.passwordConfirmInput.fill(password);
        }
    }

    /**
     * Checks the Subscribe newsletter checkbox
     */
    async checkSubscribe(): Promise<void> {
        await this.subscribeCheckbox.check();
    }

    /**
     * Checks the Privacy Policy agreement checkbox
     */
    async agreeToPrivacyPolicy(): Promise<void> {
        await this.privacyPolicyCheckbox.click({ force: true });
    }

    /**
     * Clicks the Continue button to submit registration
     * @returns Promise<SuccessPage> - Instance of the success page
     */
    async clickContinue(): Promise<SuccessPage> {
        await this.continueButton.click();
        await this.page.waitForURL('**route=account/success**', { timeout: 10000, waitUntil: 'domcontentloaded' });
        return new SuccessPage(this.page);
    }

    /**
     * Completes the full registration form with provided data
     * @param userData - Object containing firstName, lastName, email, password, and optionally telephone & passwordConfirm
     * @returns Promise<SuccessPage> - Instance of the success page
     */
    async registerUser(userData: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        telephone?: string;
        passwordConfirm?: string;
    }): Promise<SuccessPage> {
        await this.setFirstName(userData.firstName);
        await this.setLastName(userData.lastName);
        await this.setEmail(userData.email);
        await this.setPassword(userData.password);
        if (userData.telephone) {
            await this.setTelephone(userData.telephone);
        }
        if (userData.passwordConfirm) {
            await this.setPasswordConfirm(userData.passwordConfirm);
        }
        await this.agreeToPrivacyPolicy();
        return this.clickContinue();
    }
}