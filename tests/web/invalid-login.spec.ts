/**
 * Test Case: Invalid Login Flow
 *
 * Tags: @master @sanity @web
 *
 * Steps:
 * 1) Open the application
 * 2) Navigate to My Account -> Login
 * 3) Verify the login page is displayed
 * 4) Enter invalid email and password
 * 5) Submit the login form
 * 6) Verify the warning/error message is displayed
 * 7) Verify the warning message text matches the expected error
 * 8) Verify the customer is not authenticated (My Account page not accessible)
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { RandomDataUtil } from '../../utils/dataGenerator';

test('Invalid login flow @master @sanity @web', async ({ homePage, loginPage, myAccountPage }) => {

    const invalidEmail = RandomDataUtil.getEmail();
    const invalidPassword = RandomDataUtil.getPassword();

    await test.step('1-2) Open the application and navigate to My Account -> Login', async () => {
        // homePage fixture already opened the application
        await homePage.openMyAccountDropdown();
        await homePage.clickLogin();
    });

    await test.step('3) Verify the login page is displayed', async () => {
        const isLoginPage = await loginPage.isLoginPageExists();
        expect(isLoginPage).toBeTruthy();
    });

    await test.step('4-5) Enter invalid credentials and submit the login form', async () => {
        await loginPage.login(invalidEmail, invalidPassword);
    });

    await test.step('6) Verify the warning message is displayed', async () => {
        const isWarningDisplayed = await loginPage.isWarningMessageDisplayed();
        expect(isWarningDisplayed).toBeTruthy();
    });

    await test.step('7) Verify the warning message text matches the expected error', async () => {
        const warningText = await loginPage.getWarningMessage();
        expect(warningText).toContain('Warning: No match for E-Mail Address and/or Password.');
    });

    await test.step('8) Verify the customer is not authenticated', async () => {
        // The My Account page should not be accessible after failed login
        const isMyAccount = await myAccountPage.isMyAccountPageExists();
        expect(isMyAccount).toBeFalsy();
    });

    console.log('✅ Invalid login flow completed successfully!');
});