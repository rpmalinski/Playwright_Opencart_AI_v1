/**
 * Test Case: Add Product to Cart
 *
 * Tags: @master @sanity @web
 *
 * Steps:
 * 1) Open the application
 * 2) Search for a valid known product
 * 3) Open the product details page
 * 4) Verify that the product details are displayed
 * 5) Set the required quantity
 * 6) Click Add to Cart
 * 7) Verify the product-added success/confirmation message
 * 8) Open the shopping cart
 * 9) Verify that the selected product is present
 * 10) Verify the displayed quantity matches the requested quantity
 */

// using custom fixtures
import { test, expect } from '../../fixtures/pageFixtures';
import { Helper } from '../../utils/helper';

test('Add a product to the shopping cart with specified quantity @master @sanity @web', async ({ homePage, searchResultsPage, productPage, cartPage, page }) => {

    const { productName } = Helper.getProductDetails();
    const expectedQuantity = '2';

    await test.step('1) Open the application', async () => {
        // homePage fixture already opened the application
        const isSearchFieldVisible = await homePage.isSearchFieldVisible();
        expect(isSearchFieldVisible).toBeTruthy();
    });

    await test.step('2) Search for a valid known product', async () => {
        await homePage.searchForProduct(productName);
    });

    await test.step('3) Open the product details page', async () => {
        await searchResultsPage.openProduct(productName);
        const name = await productPage.getProductName();
        expect(name).toContain(productName);
    });

    await test.step('4) Verify that the product details are displayed', async () => {
        const isProductPage = await productPage.isProductPageExists();
        expect(isProductPage).toBeTruthy();
    });

    await test.step('5) Set the required quantity', async () => {
        await productPage.setQuantity(expectedQuantity);
    });

    await test.step('6) Click Add to Cart', async () => {
        await productPage.clickAddToCart();
    });

    await test.step('7) Verify the product-added success/confirmation message', async () => {
        const alertText = await productPage.getSuccessAlertText();
        expect(alertText).toContain('Success: You have added');
        expect(alertText).toContain(productName);
    });

    await test.step('8) Open the shopping cart', async () => {
        // Click the shopping cart link in the success alert
        await page.getByRole('link', { name: 'shopping cart', exact: true }).click();
        await page.waitForURL(/route=checkout\/cart/);
        await page.waitForLoadState('networkidle');
        const isCart = await cartPage.isCartPageExists();
        expect(isCart).toBeTruthy();
    });

    await test.step('9) Verify that the selected product is present', async () => {
        const cartProductName = await cartPage.getProductName();
        expect(cartProductName).toContain(productName);
    });

    await test.step('10) Verify the displayed quantity matches the requested quantity', async () => {
        const quantity = await cartPage.getQuantity();
        expect(quantity).toBe(expectedQuantity);
    });

    console.log('✅ Product added to cart with expected quantity successfully!');
});