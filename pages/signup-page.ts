// \Users\Mikel\PycharmProjects\TypeScriptPlaywrightAuto\pages\signup-page.ts

import { Page, expect } from '@playwright/test';


export class SignupPage
{

    constructor(private page: Page) {}



    /**
     * Opens the Login / Signup page from the public navigation.
     */
    async navigateToLogin(): Promise<void>
    {
        await this.page
            .getByRole('link', { name: /login/i })
            .click();


        await expect(
            this.page.getByRole(
                'heading',
                {
                    name: /new user signup/i
                }
            )
        ).toBeVisible();
    }



    /**
     * Opens the signup/login page directly.
     */
    async navigateToSignup(): Promise<void>
    {
        await this.page.goto(
            'http://automationexercise.com/login'
        );


        await expect(
            this.page.getByRole(
                'heading',
                {
                    name: /new user signup/i
                }
            )
        ).toBeVisible();
    }



    /**
     * Fills the initial signup identity fields.
     *
     * Does not submit the form.
     *
     * Submission outcome belongs to the workflow/test layer.
     */
    async startSignup(
        fullName: string,
        email: string
    ): Promise<void>
    {
        await this.page.fill(
            '[data-qa="signup-name"]',
            fullName
        );


        await this.page.fill(
            '[data-qa="signup-email"]',
            email
        );
    }



    /**
     * Submits the initial signup form.
     */
    async submitSignup(): Promise<void>
    {
        await this.page.click(
            '[data-qa="signup-button"]'
        );
    }



    /**
     * Completes the existing user login form.
     */
    async login(
        email: string,
        password: string
    ): Promise<void>
    {
        await this.page.fill(
            '[data-qa="login-email"]',
            email
        );


        await this.page.fill(
            '[data-qa="login-password"]',
            password
        );


        await this.page.click(
            '[data-qa="login-button"]'
        );
    }



    async assertLoggedIn(
        fullName: string
    ): Promise<void>
    {
        await expect(
            this.page.getByText(
                new RegExp(
                    `logged in as ${fullName}`,
                    'i'
                )
            )
        ).toBeVisible();
    }



    async expectExistingEmailError(): Promise<void>
    {
        await expect(
            this.page
                .locator('p')
                .filter(
                {
                    hasText: /email address already exist/i
                })
        ).toBeVisible();
    }

}