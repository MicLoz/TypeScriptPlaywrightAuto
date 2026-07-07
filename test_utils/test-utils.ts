// C:\Users\Mikel\PycharmProjects\TypeScriptPlaywrightAuto\test_utils\test-utils.ts

import { Page } from '@playwright/test';


// Launch browser page and navigate to URL
export const launchBrowser = async (
    page: Page,
    url: string,
    timeout: number = 30000,
    retries: number = 3
): Promise<void> =>
{
    for (let attempt = 1; attempt <= retries; attempt++)
    {
        try
        {
            await page.goto(
                url,
                {
                    timeout
                }
            );


            await page.waitForLoadState(
                'domcontentloaded',
                {
                    timeout
                }
            );


            return;
        }
        catch (error: unknown)
        {
            if (error instanceof Error)
            {
                console.error(
                    `Attempt ${attempt} failed: ${error.message}`
                );


                if (attempt === retries)
                {
                    throw new Error(
                        `Failed to load ${url} after ${retries} attempts.`
                    );
                }
            }
            else
            {
                console.error(
                    `Attempt ${attempt} failed: Unknown error`
                );
            }


            await page.waitForTimeout(5000);
        }
    }
};