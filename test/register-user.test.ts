// \Users\Mikel\PycharmProjects\TypeScriptPlaywrightAuto\test\register-user.test.ts

import { test, expect } from '@playwright/test';
import { launchBrowser } from '../test_utils/test-utils';
import { dismissConsentPopup } from '../test_utils/ui-guards';
import { Faker, en } from '@faker-js/faker';

const customFaker = new Faker({ locale: [en] });

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
        try
        {
            const url = 'http://automationexercise.com/';
            const timeout = 60000;

            await launchBrowser(page, url, timeout);
            await dismissConsentPopup(page);

            // Navigate to Signup (improved locator)
            await page.getByRole('link', { name: /login/i }).click();

            await expect(
                            page.getByRole('heading', { name: /new user signup/i })
                        ).toBeVisible();

            // Fill Signup Form (GOOD - kept data-qa)
            await page.fill('[data-qa="signup-name"]', randomFullName);
            await page.fill('[data-qa="signup-email"]', randomEmail);
            await page.click('[data-qa="signup-button"]');

            await expect(
                            page.getByRole('heading', { name: /enter account information/i })
                        ).toBeVisible();

            // Account Information
            await page.click(`input#${gender}`);
            await page.fill('#name', randomFullName);
            await page.fill('#password', 'password123');
            await page.selectOption('#days', `${randomDOB.getDate()}`);
            await page.selectOption('#months', `${randomDOB.getMonth() + 1}`);
            await page.selectOption('#years', `${randomDOB.getFullYear()}`);
            await page.check('#newsletter');
            await page.check('#optin');

            // Address Details
            await page.fill('#first_name', randomFirstName);
            await page.fill('#last_name', randomLastName);
            await page.fill('#address1', '123 Test St');
            await page.fill('#address2', 'Testbury');
            await page.selectOption('#country', 'United States');
            await page.fill('#state', 'California');
            await page.fill('#city', 'Test City');
            await page.fill('#zipcode', '12345');
            await page.fill('#mobile_number', '1234567890');

            // Submit
            await page.click('[data-qa="create-account"]');

            await expect(
                            page.getByRole('heading', { name: /account created/i })
                        ).toBeVisible();

            // Continue
            await page.getByRole('link', { name: /continue/i }).click();

            // Login assertion (less brittle)
            await expect(
                            page.getByText(/logged in as/i)
                        ).toBeVisible();

        }

        finally
        {
            // Delete account (improved locator)
            await page.getByRole('link', { name: /delete account/i }).click();

            await expect(
                            page.getByRole('heading', { name: /account deleted/i })
                        ).toBeVisible();
        }

    });
});