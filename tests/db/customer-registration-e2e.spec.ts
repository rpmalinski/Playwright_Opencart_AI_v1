/**
 * Test Case: OpenCart UI + Admin + MySQL End-to-End Customer Registration
 *
 * Tags: @master @end-to-end @db
 *
 * Steps:
 * 1) Register a new customer through the frontend
 * 2) Verify the customer exists in the Admin Portal
 * 3) Verify the customer record in the MySQL oc_customer table
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { RandomDataUtil } from '../../utils/dataGenerator';
import { executeQuery } from '../../utils/dbClient';
import dotenv from 'dotenv';

dotenv.config();

test.describe('OpenCart Customer Registration - End-to-End (UI + Admin + DB)', () => {

    const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';

    test('Register customer and verify in Admin Portal and MySQL @master @end-to-end @db', async ({
        homePage, registerPage, successPage, myAccountPage,
        adminLoginPage, adminDashboardPage, adminCustomerPage
    }) => {

        // ---------------------------------------------------------
        // Generate unique customer data
        // ---------------------------------------------------------
            const firstName = RandomDataUtil.getFirstName();
            const lastName = RandomDataUtil.getLastName();
            const email = RandomDataUtil.getEmail().toLowerCase();
            const password = RandomDataUtil.getPassword(12);
            const telephone = RandomDataUtil.getPhoneNumber();

        console.log(`📧 Generated customer email: ${email}`);

        // =========================================================
        // Step 1: Register Customer Through the Frontend
        // =========================================================

        await test.step('1) Navigate to Register page', async () => {
            await homePage.openMyAccountDropdown();
            await homePage.clickRegister();
        });

        await test.step('2) Verify registration page is displayed', async () => {
            const isRegisterPage = await registerPage.isRegisterPageExists();
            expect(isRegisterPage).toBeTruthy();
        });

        await test.step('3) Fill registration form with unique data', async () => {
            await registerPage.registerUser({
                firstName,
                lastName,
                email,
                password,
                telephone,
                passwordConfirm: password
            });
        });

        await test.step('4) Verify registration success', async () => {
            const isSuccess = await successPage.isSuccessPageExists();
            expect(isSuccess).toBeTruthy();
        });

        await test.step('5) Proceed to My Account page', async () => {
            await successPage.clickContinue();
            const isMyAccount = await myAccountPage.isMyAccountPageExists();
            expect(isMyAccount).toBeTruthy();
        });

        console.log('✅ Step 1: Frontend registration completed successfully');

        // =========================================================
        // Step 2: Verify Customer in Admin Portal
        // =========================================================

        await test.step('6) Navigate to Admin Portal and log in', async () => {
            await adminLoginPage.goto();
            const isLoginPage = await adminLoginPage.isLoginPageExists();
            expect(isLoginPage).toBeTruthy();
            await adminLoginPage.login(ADMIN_USERNAME, ADMIN_PASSWORD);
        });

        await test.step('7) Dismiss security modal if present', async () => {
            await adminDashboardPage.dismissSecurityModal();
        });

        await test.step('8) Navigate to Customers section', async () => {
            const customerPage = await adminDashboardPage.navigateToCustomers();
            const isCustomerPage = await customerPage.isCustomerPageExists();
            expect(isCustomerPage).toBeTruthy();
        });

        await test.step('9) Search for the customer by email', async () => {
            await adminCustomerPage.filterByEmail(email);
        });

        await test.step('10) Verify customer exists in the list', async () => {
            const rowCount = await adminCustomerPage.getCustomerRowCount();
            expect(rowCount).toBeGreaterThanOrEqual(1);
        });

        await test.step('11) Open customer record and verify details', async () => {
            await adminCustomerPage.clickEditFirstRow();

            const actualFirstName = await adminCustomerPage.getEditFormFirstName();
            const actualLastName = await adminCustomerPage.getEditFormLastName();
            const actualEmail = await adminCustomerPage.getEditFormEmail();

            expect(actualFirstName).toBe(firstName);
            expect(actualLastName).toBe(lastName);
            expect(actualEmail).toBe(email);
        });

        console.log('✅ Step 2: Admin Portal verification completed successfully');

        // =========================================================
        // Step 3: Verify Customer in MySQL
        // =========================================================

        await test.step('12) Query oc_customer table for the registered email', async () => {
            let rows: any[] = [];
            try {
                rows = await executeQuery(
                    'SELECT customer_id, firstname, lastname, email, status, date_added FROM oc_customer WHERE email = ?',
                    [email]
                ) as any[];
            } catch (error) {
                console.log(`Error querying database: ${error}`);
                throw error;
            }

            // Verify exactly one record is found
            expect(rows.length).toBe(1, `Expected exactly 1 customer record for email ${email}, found ${rows.length}`);

            const dbCustomer = rows[0];

            // Validate fields
            expect(dbCustomer.firstname).toBe(firstName);
            expect(dbCustomer.lastname).toBe(lastName);
            expect(dbCustomer.email).toBe(email);
            expect(dbCustomer.status).toBe(1);
            expect(dbCustomer.date_added).toBeTruthy();
            expect(dbCustomer.customer_id).toBeGreaterThan(0);

            console.log(`✅ DB record verified: customer_id=${dbCustomer.customer_id}, status=${dbCustomer.status}`);
        });

        console.log('✅ Step 3: MySQL verification completed successfully');
        console.log('✅ ✅ ✅ End-to-end test passed!');
    });
});