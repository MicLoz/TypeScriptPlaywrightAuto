// \Users\Mikel\PycharmProjects\TypeScriptPlaywrightAuto\test\register-user.test.ts

import { test } from '@playwright/test';
import { launchBrowser } from '../test_utils/test-utils';
import { dismissConsentPopup } from '../test_utils/ui-guards';
import { Faker, en } from '@faker-js/faker';

import { SignupPage } from '../pages/signup-page';
import { AccountPage } from '../pages/account-page';

const customFaker = new Faker({ locale: [en] });

// ---- Test Data Constants ----

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

        const signupPage = new SignupPage(page);
        const accountPage = new AccountPage(page);

        const url = 'http://automationexercise.com/';
        const timeout = 60000;


        try
        {
            await launchBrowser(page, url, timeout);
            await dismissConsentPopup(page);


            // Navigate to signup
            await signupPage.navigateToLogin();


            // Create account
            await signupPage.startSignup(
                randomFullName,
                randomEmail
            );

            // Complete account details
            await accountPage.fillAccountInfo({
                gender,
                fullName: randomFullName,
                password: TEST_PASSWORD,
                dob: randomDOB
            });

            await accountPage.fillAddress(
            {
                firstName: randomFirstName,
                lastName: randomLastName,
                address: TEST_ADDRESS
            });

            // Submit account creation
            await accountPage.submitAccountCreation();

            accountCreated = true;

            // Continue after creation
            await accountPage.continueAfterCreation();

            // Validate login
            await signupPage.assertLoggedIn(randomFullName);
        }
        finally
        {
            // Cleanup only if account exists
            if (accountCreated)
            {
                await accountPage.deleteAccount();
            }
        }

    });
});