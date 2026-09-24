import { test, expect } from '@playwright/test';
import { Routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';
import dotenv from 'dotenv';

dotenv.config();

test.describe.serial('End-to-End API Workflow Tests', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------

    const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
    const USER_ID = Number(process.env.USER_ID ?? 1);

    // ---------------------------------------------------------
    // Product CRUD Workflow
    // ---------------------------------------------------------

    test('Product CRUD Workflow @master @end-to-end @api', async ({ request }) => {
        // 1) Create a product
        const createPayload = RandomDataUtil.generateProductPayload();

        const createResponse = await request.post(`${BASE_URL}${Routes.CREATE_PRODUCT}`, {
            data: createPayload
        });

        expect(createResponse.status()).toBe(201);

        const createdProduct = await createResponse.json();
        expect(createdProduct).toHaveProperty('id');

        const productId = createdProduct.id;

        // 2) Update the same product
        const updatePayload = RandomDataUtil.generateUpdatedProductPayload();

        const updateResponse = await request.put(
            `${BASE_URL}${Routes.UPDATE_PRODUCT.replace('{id}', String(productId))}`,
            { data: updatePayload }
        );

        expect(updateResponse.status()).toBe(200);

        const updatedProduct = await updateResponse.json();
        expect(updatedProduct.id).toBe(productId);
        expect(updatedProduct.title).toBe(updatePayload.title);
        expect(updatedProduct.price).toBe(updatePayload.price);

        // 3) Delete the same product
        const deleteResponse = await request.delete(
            `${BASE_URL}${Routes.DELETE_PRODUCT.replace('{id}', String(productId))}`
        );

        expect(deleteResponse.status()).toBe(200);

        console.log('✅ Product CRUD workflow completed successfully!');
    });

    // ---------------------------------------------------------
    // User CRUD Workflow
    // ---------------------------------------------------------

    test('User CRUD Workflow @master @end-to-end @api', async ({ request }) => {
        // 1) Create a user
        const createPayload = RandomDataUtil.generateUserPayload();

        const createResponse = await request.post(`${BASE_URL}${Routes.CREATE_USER}`, {
            data: createPayload
        });

        expect(createResponse.status()).toBe(201);

        const createdUser = await createResponse.json();
        expect(createdUser).toHaveProperty('id');

        const userId = createdUser.id;

        // 2) Update the same user
        const updatePayload = RandomDataUtil.generateUserUpdatePayload();

        const updateResponse = await request.put(
            `${BASE_URL}${Routes.UPDATE_USER.replace('{id}', String(userId))}`,
            { data: updatePayload }
        );

        expect(updateResponse.status()).toBe(200);

        const updatedUser = await updateResponse.json();
        expect(updatedUser.username).toBe(updatePayload.username);
        expect(updatedUser.email).toBe(updatePayload.email);

        // 3) Delete the same user
        const deleteResponse = await request.delete(
            `${BASE_URL}${Routes.DELETE_USER.replace('{id}', String(userId))}`
        );

        expect(deleteResponse.status()).toBe(200);

        console.log('✅ User CRUD workflow completed successfully!');
    });

    // ---------------------------------------------------------
    // Cart CRUD Workflow
    // ---------------------------------------------------------

    test('Cart CRUD Workflow @master @end-to-end @api', async ({ request }) => {
        // 1) Create a cart
        const createPayload = RandomDataUtil.generateCartPayload(USER_ID);

        const createResponse = await request.post(`${BASE_URL}${Routes.CREATE_CART}`, {
            data: createPayload
        });

        expect(createResponse.status()).toBe(201);

        const createdCart = await createResponse.json();
        expect(createdCart).toHaveProperty('id');
        expect(createdCart.userId).toBe(createPayload.userId);
        expect(createdCart).toHaveProperty('products');
        expect(Array.isArray(createdCart.products)).toBeTruthy();
        expect(createdCart.products.length).toBeGreaterThan(0);

        const cartId = createdCart.id;

        // 2) Update the same cart
        const updatePayload = RandomDataUtil.generateUpdatedCartPayload(USER_ID);

        const updateResponse = await request.put(
            `${BASE_URL}${Routes.UPDATE_CART.replace('{id}', String(cartId))}`,
            { data: updatePayload }
        );

        expect(updateResponse.status()).toBe(200);

        const updatedCart = await updateResponse.json();
        expect(updatedCart.id).toBe(cartId);
        expect(updatedCart.userId).toBe(updatePayload.userId);
        expect(updatedCart).toHaveProperty('products');
        expect(Array.isArray(updatedCart.products)).toBeTruthy();

        // 3) Delete the same cart
        const deleteResponse = await request.delete(
            `${BASE_URL}${Routes.DELETE_CART.replace('{id}', String(cartId))}`
        );

        expect(deleteResponse.status()).toBe(200);

        console.log('✅ Cart CRUD workflow completed successfully!');
    });
});