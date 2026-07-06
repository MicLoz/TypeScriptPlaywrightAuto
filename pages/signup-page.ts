// \Users\Mikel\PycharmProjects\TypeScriptPlaywrightAuto\pages\signup-page.ts
import { Page, expect } from '@playwright/test';

export class SignupPage {
    constructor(private page: Page) {}

    async navigateToLogin() {
        await this.page.getByRole('link', { name: /login/i }).click();
        await expect(
            this.page.getByRole('heading', { name: /new user signup/i })
        ).toBeVisible();
    }

    async startSignup(fullName: string, email: string) {
        await this.page.fill('[data-qa="signup-name"]', fullName);
        await this.page.fill('[data-qa="signup-email"]', email);
        await this.page.click('[data-qa="signup-button"]');

        await expect(
            this.page.getByRole('heading', { name: /enter account information/i })
        ).toBeVisible();
    }

    async assertLoggedIn(fullName: string) {
        await expect(
            this.page.getByText(new RegExp(`logged in as ${fullName}`, 'i'))
        ).toBeVisible();
    }
}