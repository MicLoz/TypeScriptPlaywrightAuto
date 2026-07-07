import { test } from '@playwright/test';

import { launchBrowser } from '../test_utils/test-utils';
import { dismissConsentPopup } from '../test_utils/ui-guards';

import { TestDataFactory, TestUser } from '../test_utils/test-data-factory';

import { SignupPage } from '../pages/signup-page';
import { AccountPage } from '../pages/account-page';

import { RegistrationWorkflow } from '../workflows/registration-workflow';
import { LoginWorkflow } from '../workflows/login-workflow';


test.describe('Existing User Registration Tests', () =>
{
    let user: TestUser;


    test.beforeEach(() =>
    {
        user = TestDataFactory.createUser();
    });


    test('Register Existing User', async ({ page }) =>
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


            //
            // Create initial user
            //

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


            //
            // Logout before attempting duplicate registration.
            // The duplicate registration validation is an unauthenticated flow.
            //

            await accountPage.logout();


            //
            // Attempt duplicate registration
            //

            await signupPage.startSignup(
                user.fullName,
                user.email
            );

            await signupPage.submitSignup();


            await signupPage.expectExistingEmailError();


            //
            // Login again so we can cleanly delete the created account.
            //

            await LoginWorkflow.login(
                signupPage,
                user
            );


            await accountPage.deleteAccount();


            accountCreated = false;

        }
        finally
        {
            //
            // Safety cleanup
            //

            if (accountCreated)
            {
                const deleteLink =
                    page.getByRole(
                        'link',
                        {
                            name: /delete account/i
                        }
                    );


                if (await deleteLink.isVisible().catch(() => false))
                {
                    await accountPage.deleteAccount();
                }
            }
        }

    });

});