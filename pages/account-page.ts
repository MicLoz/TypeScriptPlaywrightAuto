// \Users\Mikel\PycharmProjects\TypeScriptPlaywrightAuto\pages\account-page.ts
import { Page, expect } from '@playwright/test';

export class AccountPage {
    constructor(private page: Page) {}

    async fillAccountInfo(data: {
        gender: string;
        fullName: string;
        password: string;
        dob: Date;
    }) {
        await this.page.click(`input#${data.gender}`);
        await this.page.fill('#name', data.fullName);
        await this.page.fill('#password', data.password);

        await this.page.selectOption('#days', `${data.dob.getDate()}`);
        await this.page.selectOption('#months', `${data.dob.getMonth() + 1}`);
        await this.page.selectOption('#years', `${data.dob.getFullYear()}`);

        await this.page.check('#newsletter');
        await this.page.check('#optin');
    }

    async fillAddress(data: {
        firstName: string;
        lastName: string;
        address: {
            line1: string;
            line2: string;
            country: string;
            state: string;
            city: string;
            postcode: string;
            phone: string;
        };
    }) {
        await this.page.fill('#first_name', data.firstName);
        await this.page.fill('#last_name', data.lastName);

        await this.page.fill('#address1', data.address.line1);
        await this.page.fill('#address2', data.address.line2);
        await this.page.selectOption('#country', data.address.country);
        await this.page.fill('#state', data.address.state);
        await this.page.fill('#city', data.address.city);
        await this.page.fill('#zipcode', data.address.postcode);
        await this.page.fill('#mobile_number', data.address.phone);
    }

    async submitAccountCreation() {
        await this.page.click('[data-qa="create-account"]');

        await expect(
            this.page.getByRole('heading', { name: /account created/i })
        ).toBeVisible();
    }

    async continueAfterCreation() {
        await this.page.getByRole('link', { name: /continue/i }).click();
    }

    async deleteAccount() {
        await this.page.getByRole('link', { name: /delete account/i }).click();

        await expect(
            this.page.getByRole('heading', { name: /account deleted/i })
        ).toBeVisible();
    }
}