/**
 * Test Case: Complete Customer Shopping Journey
 *
 * Tags: @master @end-to-end
 *
 * Steps:
 * 1) Open the application
 * 2) Register a new customer using dynamically generated unique data
 * 3) Verify successful registration
 * 4) Log out
 * 5) Log in again using the newly created credentials
 * 6) Verify successful authentication
 * 7) Search for a known product (MacBook)
 * 8) Open the product details page
 * 9) Add the product to the cart
 * 10) Open the shopping cart
 * 11) Verify the correct product
 * 12) Verify the quantity
 * 13) Verify the product price
 * 14) Verify the applicable cart total
 * 15) Verify that the complete journey finishes without errors
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { RandomDataUtil } from '../../utils/dataGenerator';

test.describe('End-to-End Shopping Journey', () => {

    test('Complete customer shopping journey @master @end-to-end', async ({
        homePage, registerPage, successPage, loginPage, myAccountPage,
        searchResultsPage, productPage, cartPage, page
    }) => {

        // Generate unique customer data
        const firstName = RandomDataUtil.getFirstName();
        const lastName = RandomDataUtil.getLastName();
        const email = RandomDataUtil.getEmail();
        const password = RandomDataUtil.getPassword(12);
        const telephone = RandomDataUtil.getPhoneNumber();
        const productName = 'MacBook';
        const expectedQuantity = '1';
        const expectedPrice = '$602.00';
        const expectedTotal = '$602.00';

        // ---------------------------------------------------------
        // Step 1-3: Register a new customer
        // ---------------------------------------------------------

        await test.step('1) Open the application and navigate to Register', async () => {
            // homePage fixture already opened the app
            await homePage.openMyAccountDropdown();
            await homePage.clickRegister();
        });

        await test.step('2) Register a new customer with unique data', async () => {
            await registerPage.registerUser({ firstName, lastName, email, password, telephone, passwordConfirm: password});
        });

        await test.step('3) Verify successful registration', async () => {
            const isSuccess = await successPage.isSuccessPageExists();
            expect(isSuccess).toBeTruthy();
        });

        // ---------------------------------------------------------
        // Step 4: Log out
        // ---------------------------------------------------------

        await test.step('4) Log out from the account', async () => {
            await successPage.clickContinue();
            await myAccountPage.openMyAccountDropdown();
            await myAccountPage.clickLogout();
            // Wait for the logout success page to load
            await page.waitForLoadState('networkidle');
            // Click Continue on the logout page to return to home (button, not link)
            await page.getByRole('link', { name: 'Continue' }).click();
        });

        // ---------------------------------------------------------
        // Step 5-6: Log in with newly created credentials
        // ---------------------------------------------------------

        await test.step('5) Log in with the newly created credentials', async () => {
            await homePage.openMyAccountDropdown();
            await homePage.clickLogin();
            await loginPage.login(email, password);
        });

        await test.step('6) Verify successful authentication', async () => {
            const isLoggedIn = await myAccountPage.isMyAccountPageExists();
            expect(isLoggedIn).toBeTruthy();
        });

        // ---------------------------------------------------------
        // Step 7-9: Search for product and add to cart
        // ---------------------------------------------------------

        await test.step('7) Search for a known product', async () => {
            // Navigate to home page via the logo link
            await page.locator('a[href*="route=common/home"]').first().click();
            await page.waitForLoadState('networkidle');
            await homePage.searchForProduct(productName);
        });

        await test.step('8) Open the product details page', async () => {
            await searchResultsPage.openProduct(productName);
            const name = await productPage.getProductName();
            expect(name).toContain(productName);
        });

        await test.step('9) Add the product to the cart', async () => {
            await productPage.clickAddToCart();
        });

        // ---------------------------------------------------------
        // Step 10-14: Open cart and verify details
        // ---------------------------------------------------------

        await test.step('10) Open the shopping cart', async () => {
            await page.goto('http://localhost/opencart/index.php?route=checkout/cart&language=en-gb', { waitUntil: 'load' });
            await page.waitForLoadState('networkidle');
            const isCart = await cartPage.isCartPageExists();
            expect(isCart).toBeTruthy();
        });

        await test.step('11) Verify the correct product', async () => {
            const cartProductName = await cartPage.getProductName();
            expect(cartProductName).toContain(productName);
        });

        await test.step('12) Verify the quantity', async () => {
            const quantity = await cartPage.getQuantity();
            expect(quantity).toBe(expectedQuantity);
        });

        await test.step('13) Verify the product price', async () => {
            const unitPrice = await cartPage.getUnitPrice();
            expect(unitPrice).toContain(expectedPrice);
        });

        await test.step('14) Verify the applicable cart total', async () => {
            const total = await cartPage.getTotalPrice();
            expect(total).toContain(expectedTotal);
        });

        console.log('✅ Complete customer shopping journey finished successfully!');
    });
});