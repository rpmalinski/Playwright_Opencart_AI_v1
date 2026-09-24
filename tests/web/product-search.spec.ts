/**
 * Test Case: Product Search Flow
 *
 * Tags: @master @sanity @web
 *
 * Steps:
 * 1) Open the application
 * 2) Locate the main product search field
 * 3) Enter a valid known product name
 * 4) Submit the search
 * 5) Verify that the search results page is displayed
 * 6) Verify that the expected product appears in the results
 * 7) Verify that the displayed product name matches the search criteria
 */

// using custom fixtures
import { test, expect } from '../../fixtures/pageFixtures';
import { Helper } from '../../utils/helper';

test('Product search returns the expected product @master @sanity @web', async ({ homePage, searchResultsPage }) => {

    const { productName } = Helper.getProductDetails();

    await test.step('1) Open the application and locate the search field', async () => {
        // homePage fixture already opened the application
        const isSearchFieldVisible = await homePage.isSearchFieldVisible();
        expect(isSearchFieldVisible).toBeTruthy();
    });

    await test.step('2) Enter a valid known product name', async () => {
        await homePage.searchForProduct(productName);
    });

    await test.step('3) Verify that the search results page is displayed', async () => {
        const isSearchResults = await searchResultsPage.isSearchResultsPageExists();
        expect(isSearchResults).toBeTruthy();
    });

    await test.step('4) Verify that the expected product appears in the results', async () => {
        const isProductDisplayed = await searchResultsPage.isProductDisplayed(productName);
        expect(isProductDisplayed).toBeTruthy();
    });

    await test.step('5) Verify that the displayed product name matches the search criteria', async () => {
        const productNames = await searchResultsPage.getProductNames();
        expect(productNames).toContain(productName);
    });

    console.log('✅ Product search flow completed successfully!');
});