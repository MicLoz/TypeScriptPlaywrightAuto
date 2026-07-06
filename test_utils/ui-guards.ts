// test_utils/ui-guards.ts
import { Page } from '@playwright/test';

export async function dismissConsentPopup(page: Page): Promise<void> {
    const consentButton = page.getByRole('button', { name: 'Consent' });

    if (await consentButton.isVisible().catch(() => false)) {
        await consentButton.click();
    }
}