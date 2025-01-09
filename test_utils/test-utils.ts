import { Page } from 'playwright';

// Launch browser and navigate to URL
export const launchBrowser = async (page: Page, url: string, timeout: number = 30000, retries: number = 3) => {
    for (let attempt = 0; attempt < retries; attempt++)
    {
        try 
        {
            await page.goto(url, { timeout });
            await page.waitForLoadState('domcontentloaded', { timeout });
            return; //Break out of loop on sucessful load
        }
        catch (error)
        {
            if (attempt === retries - 1) 
                {
                    console.error(`Failed to load ${url} after ${retries} attempts.`);
                    throw error;  // Last attempt, throw error
                }
        }
        console.log(`Retrying attempt ${attempt + 1} for ${url}...`);
        await page.waitForTimeout(5000); // Wait 5 seconds before retrying
    }
};

// Check if an element is visible
export const verifyElementVisible = async (page: Page, selector: string) => {
    const element = await page.$(selector);
    if (!element) throw new Error(`Element ${selector} not found.`);
    const isVisible = await element.isVisible();
    if (!isVisible) throw new Error(`Element ${selector} is not visible.`);
};

// Click on an element
export const clickElement = async (page: Page, selector: string) => {
    const element = await page.$(selector);
    if (!element) throw new Error(`Element ${selector} not found.`);
    await element.click();
};
