/**
 * Test Case: Valid Login Flow
 *
 * Tags: @master @sanity @web
 *
 * Steps:
 * 1) Open the application
 * 2) Navigate to My Account -> Login
 * 3) Verify the login page is displayed
 * 4) Enter valid customer credentials from the project's configured test data
 * 5) Submit the login form
 * 6) Verify successful authentication
 * 7) Verify the user is redirected to the My Account section
 * 8) Verify that the account dashboard or appropriate authenticated account navigation is visible
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { Helper } from '../../utils/helper';

test('Valid login flow @master @sanity @web', async ({ homePage, loginPage, myAccountPage }) => {

    const { email, password } = Helper.getLoginDetails();

    await test.step('1-2) Open the application and navigate to My Account -> Login', async () => {
        // homePage fixture already opened the application
        await homePage.openMyAccountDropdown();
        await homePage.clickLogin();
    });

    await test.step('3) Verify the login page is displayed', async () => {
        const isLoginPage = await loginPage.isLoginPageExists();
        expect(isLoginPage).toBeTruthy();
    });

    await test.step('4-5) Enter valid credentials and submit the login form', async () => {
        await loginPage.login(email, password);
    });

    await test.step('6-8) Verify successful authentication and My Account page is displayed', async () => {
        const isMyAccount = await myAccountPage.isMyAccountPageExists();
        expect(isMyAccount).toBeTruthy();
    });

    console.log('✅ Valid login flow completed successfully!');
});