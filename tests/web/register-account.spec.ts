/**
 * Test Case: User Registration Flow
 *
 * Tags: @master @sanity @web
 *
 * Steps:
 * 1) Open the application
 * 2) Navigate to My Account -> Register
 * 3) Verify the registration page is displayed
 * 4) Generate a unique customer email
 * 5) Enter valid values: First Name, Last Name, Email, Password, Telephone, Password Confirm
 *    (Telephone and Password Confirmation fields are handled gracefully if present or absent)
 * 6) Accept the Privacy Policy and submit the registration form
 * 7) Verify that registration succeeds
 * 8) Verify the account-created confirmation "Your Account Has Been Created!"
 * 9) Verify the newly created account is available via account navigation
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { RandomDataUtil } from '../../utils/dataGenerator';

test('User registration flow @master @sanity @web', async ({ homePage, registerPage, successPage, myAccountPage }) => {

    // Generate unique customer data
    const firstName = RandomDataUtil.getFirstName();
    const lastName = RandomDataUtil.getLastName();
    const email = RandomDataUtil.getEmail();
    const password = RandomDataUtil.getPassword(12);
    const telephone = RandomDataUtil.getPhoneNumber();

    await test.step('1-2) Open the application and navigate to My Account -> Register', async () => {
        // homePage fixture already opened the application
        await homePage.openMyAccountDropdown();
        await homePage.clickRegister();
        await registerPage.isRegisterPageExists();
    });

    await test.step('3) Verify the registration page is displayed', async () => {
        const isRegisterPage = await registerPage.isRegisterPageExists();
        expect(isRegisterPage).toBeTruthy();
    });

    await test.step('4-5) Enter valid customer details', async () => {
        await registerPage.registerUser({
            firstName,
            lastName,
            email,
            password,
            telephone,
            passwordConfirm: password
        });
    });

    await test.step('6-7) Verify the success page and confirmation message are displayed', async () => {
        const isSuccess = await successPage.isSuccessPageExists();
        expect(isSuccess).toBeTruthy();
    });

    await test.step('8) Verify the new account is available via account navigation', async () => {
        await successPage.clickContinue();
        const isMyAccount = await myAccountPage.isMyAccountPageExists();
        expect(isMyAccount).toBeTruthy();
    });

    console.log('✅ User registration flow completed successfully!');
});