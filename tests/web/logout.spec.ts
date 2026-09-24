/**
 * Test Case: Logout Flow
 *
 * Tags: @master @sanity @web
 *
 * Steps:
 * 1) Open the application
 * 2) Log in using valid customer credentials
 * 3) Verify that authentication succeeds
 * 4) Navigate to the account logout option
 * 5) Click Logout
 * 6) Verify that the logout confirmation page is displayed
 * 7) Click Continue
 * 8) Verify the expected redirect, such as the homepage
 * 9) Verify that authenticated account options are no longer available
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { Helper } from '../../utils/helper';

test('Logout flow @master @sanity @web', async ({ homePage, loginPage, myAccountPage, logoutPage, page }) => {

    const { email, password } = Helper.getLoginDetails();

    await test.step('1-2) Open the application and log in with valid credentials', async () => {
        // homePage fixture already opened the application
        await homePage.openMyAccountDropdown();
        await homePage.clickLogin();
        await loginPage.login(email, password);
    });

    await test.step('3) Verify that authentication succeeds', async () => {
        const isMyAccount = await myAccountPage.isMyAccountPageExists();
        expect(isMyAccount).toBeTruthy();
    });

    await test.step('4-5) Navigate to My Account -> Logout and click Logout', async () => {
        await myAccountPage.openMyAccountDropdown();
        await myAccountPage.clickLogout();
    });

    await test.step('6) Verify that the logout confirmation page is displayed', async () => {
        const isLogoutPage = await logoutPage.isLogoutPageExists();
        expect(isLogoutPage).toBeTruthy();
    });

    await test.step('7) Click Continue on the logout page', async () => {
        await logoutPage.clickContinue();
    });

    await test.step('8) Verify the expected redirect to the homepage', async () => {
        await expect(page).toHaveURL(/route=common\/home/);
    });

    await test.step('9) Verify that authenticated account options are no longer available', async () => {
        await homePage.openMyAccountDropdown();
        const dropdownItems = await homePage.getMyAccountDropdownItems();
        // After logout, only Register and Login should be visible
        expect(dropdownItems).toContain('Register');
        expect(dropdownItems).toContain('Login');
        expect(dropdownItems).not.toContain('Logout');
        // Verify Logout option is not present
        const isLogoutVisible = await homePage.isLogoutOptionVisible();
        expect(isLogoutVisible).toBeFalsy();
    });

    console.log('✅ Logout flow completed successfully!');
});