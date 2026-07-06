// \Users\Mikel\PycharmProjects\TypeScriptPlaywrightAuto\test\register-user.test.ts

import { test, expect } from '@playwright/test';
import { launchBrowser } from '../test_utils/test-utils';
import { dismissConsentPopup } from '../test_utils/ui-guards';
import { Faker, en } from '@faker-js/faker';

const customFaker = new Faker({ locale: [en] });

// ---- Test Data Constants (lightweight improvement) ----
const TEST_PASSWORD = 'password123';

const TEST_ADDRESS = {
    line1: '123 Test St',
    line2: 'Testbury',
    country: 'United States',
    state: 'California',
    city: 'Test City',
    postcode: '12345',
    phone: '1234567890'
};

test.describe('User Registration Tests', () =>
{
    let randomFirstName: string;
    let randomLastName: string;
    let randomFullName: string;
    let randomEmail: string;
    let randomDOB: Date;
    let gender: string;

    test.beforeEach(() =>
    {
        randomFirstName = customFaker.person.firstName();
        randomLastName = customFaker.person.lastName();
        randomFullName = `${randomFirstName} ${randomLastName}`;
        randomEmail = customFaker.internet.email();
        randomDOB = customFaker.date.birthdate();
        gender = Math.random() > 0.5 ? 'id_gender1' : 'id_gender2';
    });

    test('Register User', async ({ page }) =>
    {
        let accountCreated = false;

        const url = 'http://automationexercise.com/';
        const timeout = 60000;

        await launchBrowser(page, url, timeout);
        await dismissConsentPopup(page);

        // Navigate to Signup
        await page.getByRole('link', { name: /login/i }).click();

        await expect(
            page.getByRole('heading', { name: /new user signup/i })
        ).toBeVisible();

        // Fill Signup Form (stable data-qa selectors kept intentionally)
        await page.fill('[data-qa="signup-name"]', randomFullName);
        await page.fill('[data-qa="signup-email"]', randomEmail);
        await page.click('[data-qa="signup-button"]');

        await expect(
            page.getByRole('heading', { name: /enter account information/i })
        ).toBeVisible();

        // Account Information
        await page.click(`input#${gender}`);
        await page.fill('#name', randomFullName);
        await page.fill('#password', TEST_PASSWORD);
        await page.selectOption('#days', `${randomDOB.getDate()}`);
        await page.selectOption('#months', `${randomDOB.getMonth() + 1}`);
        await page.selectOption('#years', `${randomDOB.getFullYear()}`);
        await page.check('#newsletter');
        await page.check('#optin');

        // Address Details
        await page.fill('#first_name', randomFirstName);
        await page.fill('#last_name', randomLastName);
        await page.fill('#address1', TEST_ADDRESS.line1);
        await page.fill('#address2', TEST_ADDRESS.line2);
        await page.selectOption('#country', TEST_ADDRESS.country);
        await page.fill('#state', TEST_ADDRESS.state);
        await page.fill('#city', TEST_ADDRESS.city);
        await page.fill('#zipcode', TEST_ADDRESS.postcode);
        await page.fill('#mobile_number', TEST_ADDRESS.phone);

        // Submit
        await page.click('[data-qa="create-account"]');

        await expect(
            page.getByRole('heading', { name: /account created/i })
        ).toBeVisible();

        accountCreated = true;

        // Continue
        await page.getByRole('link', { name: /continue/i }).click();

        // Login assertion (validated identity, not just presence) - This is still "Copy" reliant, could look at hardening in future commits.
        await expect(
            page.getByText(new RegExp(`logged in as ${randomFullName}`, 'i'))
        ).toBeVisible();

        // ---- Cleanup (safe guard now checks for Account Creation = Success) ----
        if (accountCreated)
        {
            await page.getByRole('link', { name: /delete account/i }).click();

            await expect(
                page.getByRole('heading', { name: /account deleted/i })
            ).toBeVisible();
        }
    });
});