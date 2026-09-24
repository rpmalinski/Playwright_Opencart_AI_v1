/**
 * Test Case: Login Flow (Data Driven using External File)
 *
 * Tags: @master @datadriven @web
 *
 * Steps:
 * 1) Navigate to the login page
 * 2) Enter email and password from test data (leave blank if whitespace)
 * 3) Submit the login form
 * 4) Validate result based on expected value (success/failure)
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { DataProvider } from '../../utils/DataReader';

interface LoginDataRow {
    testName: string;
    email: string;
    password: string;
    expected: string;
}

const loginData: LoginDataRow[] = DataProvider.readJson('./testdata/opencart_logindata.json');

loginData.forEach((data, index) => {
    const emailLabel = data.email.trim() === '' ? '(blank)' : data.email;
    const passwordLabel = data.password.trim() === '' ? '(blank)' : data.password;
    const uniqueTestName = `${data.testName} — ${emailLabel} / ${passwordLabel}`;

    test(`${uniqueTestName} @master @datadriven @web`, async ({ homePage, loginPage, myAccountPage }) => {

        await test.step('1) Open the application and navigate to the login page', async () => {
            // homePage fixture already opened the application
            await homePage.openMyAccountDropdown();
            await homePage.clickLogin();
        });

        await test.step('2-3) Enter credentials and submit the login form', async () => {
            // If a value is blank/whitespace, leave that field empty
            const email = data.email.trim() === '' ? '' : data.email;
            const password = data.password.trim() === '' ? '' : data.password;
            await loginPage.login(email, password);
        });

        if (data.expected === 'success') {
            await test.step('4) Verify successful login and My Account page is displayed', async () => {
                const isMyAccount = await myAccountPage.isMyAccountPageExists();
                expect(isMyAccount).toBeTruthy();
            });
        } else {
            await test.step('4) Verify login failure and warning message is displayed', async () => {
                const isWarning = await loginPage.isWarningMessageDisplayed();
                expect(isWarning).toBeTruthy();
                const warningText = await loginPage.getWarningMessage();
                expect(warningText).toContain('Warning');
            });
        }

        console.log(`✅ ${uniqueTestName} completed successfully!`);
    });
});