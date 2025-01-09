import { test, expect, Page } from '@playwright/test';
import { launchBrowser } from '../test_utils/test-utils';
import { Faker, en } from '@faker-js/faker';

// Initialize Faker instance
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
        const url = 'http://automationexercise.com/';
        const timeout = 60000;

        // Launch browser and navigate
        await launchBrowser(page, url, timeout);

        // Navigate to Signup
        await page.click('a[href="/login"]');
        await expect(page.locator('h2:has-text("New User Signup!")')).toBeVisible();

        // Fill Signup Form
        await page.fill('[data-qa="signup-name"]', randomFullName);
        await page.fill('[data-qa="signup-email"]', randomEmail);
        await page.click('button[data-qa="signup-button"]');

        // Verify Account Information Page
        await expect(page.locator('h2:has-text("ENTER ACCOUNT INFORMATION")')).toBeVisible();

        // Fill Account Information
        await page.click(`input#${gender}`);
        await page.fill('#name', randomFullName);
        await page.fill('#password', 'password123');
        await page.selectOption('#days', `${randomDOB.getDate()}`);
        await page.selectOption('#months', `${randomDOB.getMonth() + 1}`);
        await page.selectOption('#years', `${randomDOB.getFullYear()}`);
        await page.check('#newsletter');
        await page.check('#optin');

        // Fill Address Details
        await page.fill('#first_name', randomFirstName);
        await page.fill('#last_name', randomLastName);
        await page.fill('#address1', '123 Test St');
        await page.fill('#address2', 'Testbury');
        await page.selectOption('#country', 'United States');
        await page.fill('#state', 'California');
        await page.fill('#city', 'Test City');
        await page.fill('#zipcode', '12345');
        await page.fill('#mobile_number', '1234567890');

        // Submit Account Creation
        await page.click('button[data-qa="create-account"]');
        await expect(page.locator('b:has-text("Account Created!")')).toBeVisible();

        // Verify Login
        await page.click('a[data-qa="continue-button"]');
        await expect(page.locator(`a:has-text("Logged in as ${randomFullName}")`)).toBeVisible();

        // Delete Account
        await page.click('a[href="/delete_account"]');
        await expect(page.locator('b:has-text("Account Deleted!")')).toBeVisible();
    });
});
