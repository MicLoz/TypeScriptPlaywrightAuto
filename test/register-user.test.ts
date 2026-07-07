// \Users\Mikel\PycharmProjects\TypeScriptPlaywrightAuto\test\register-user.test.ts

import { test } from '@playwright/test';

import { launchBrowser } from '../test_utils/test-utils';
import { dismissConsentPopup } from '../test_utils/ui-guards';
import { TestDataFactory, TestUser } from '../test_utils/test-data-factory';

import { SignupPage } from '../pages/signup-page';
import { AccountPage } from '../pages/account-page';

import { RegistrationWorkflow } from '../workflows/registration-workflow';


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


        try
        {
            await launchBrowser(
                page,
                'http://automationexercise.com/',
                60000
            );


            await dismissConsentPopup(page);


            await signupPage.navigateToLogin();


            await RegistrationWorkflow.register(
                signupPage,
                accountPage,
                user
            );


            accountCreated = true;


            await accountPage.continueAfterCreation();


            await signupPage.assertLoggedIn(
                user.fullName
            );
        }
        finally
        {
            if (accountCreated)
            {
                await accountPage.deleteAccount();
            }
        }
    });
});