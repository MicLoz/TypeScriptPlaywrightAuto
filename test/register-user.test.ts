// \Users\Mikel\PycharmProjects\TypeScriptPlaywrightAuto\test\register-user.test.ts

import { test } from '@playwright/test';

import { launchBrowser } from '../test_utils/test-utils';
import { dismissConsentPopup } from '../test_utils/ui-guards';
import { TestDataFactory, TestUser } from '../test_utils/test-data-factory';

import { SignupPage } from '../pages/signup-page';
import { AccountPage } from '../pages/account-page';


test.describe('User Registration Tests', () =>
{
    let user: TestUser;


    test.beforeEach(() =>
    {
        user = TestDataFactory.createUser();
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
                user.fullName,
                user.email
            );


            // Complete account details
            await accountPage.fillAccountInfo({
                gender: user.gender,
                fullName: user.fullName,
                password: user.password,
                dob: user.dob
            });


            await accountPage.fillAddress({
                firstName: user.firstName,
                lastName: user.lastName,
                address: user.address
            });


            // Submit account creation
            await accountPage.submitAccountCreation();

            accountCreated = true;


            // Continue after creation
            await accountPage.continueAfterCreation();


            // Validate login
            await signupPage.assertLoggedIn(user.fullName);

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