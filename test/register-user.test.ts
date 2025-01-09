import { test, expect, Page } from '@playwright/test';
import { launchBrowser, verifyElementVisible, clickElement } from '../test_utils/test-utils';
import { Faker, en} from '@faker-js/faker';

// Initialize the Faker instance with English locale
const customFaker = new Faker(
  {
    locale: [en] // or any other locale like ['es'] for Spanish, etc.
  });


test('Register User', async ({ page }) => {
  const url = 'http://automationexercise.com/';
  const timeout = 60000; // 60 seconds
  const randomFirstName = customFaker.person.firstName();
  const randomLastName = customFaker.person.lastName();
  const randomFullName = randomFirstName + " " + randomLastName;
  const randomEmail = customFaker.internet.email();
  const randomDOB = customFaker.date.birthdate();
  const gender = Math.random() > 0.5 ? 'id_gender1' : 'id_gender2';

  // Parse the date of birth
  const dob = new Date(randomDOB);
  const day = dob.getDate(); // Extract day (1-31)
  const month = dob.getMonth() + 1; // Extract month (0-based, so +1 for 1-based indexing)
  const year = dob.getFullYear(); // Extract year (e.g., 1977)

  //Launch browser and navigate to the URL
  await launchBrowser(page, url, timeout);

  //Verify that the homepage is visible
  await verifyElementVisible(page, 'body');

  //Click on "Signup / Login" button
  await clickElement(page, 'a[href="/login"]');

  //Wait for the "New User Signup!" text to be visible
  await page.waitForSelector('h2:has-text("New User Signup!")', { state: 'visible' });

  //Verify "New User Signup!" is visible
  await verifyElementVisible(page, 'h2:has-text("New User Signup!")');

  //Enter name and email address
  await page.fill('[data-qa="signup-name"]', randomFullName);
  await page.fill('[data-qa="signup-email"]', randomEmail);

  //Click "Signup" button
  await clickElement(page, 'button[data-qa="signup-button"]');

  //Wait for the "ENTER ACCOUNT INFORMATION" text to be visible
  await page.waitForSelector('h2:has-text("ENTER ACCOUNT INFORMATION")', { state: 'visible' });

  //Verify "ENTER ACCOUNT INFORMATION" is visible
  await verifyElementVisible(page, 'h2:has-text("ENTER ACCOUNT INFORMATION")');


  //Fill in account details
  await page.click(`input#${gender}`);
  await page.fill('#name', randomFullName);
  await page.fill('#password', 'password123');
  await page.selectOption('#days', `${day}`);
  await page.selectOption('#months', `${month}`);
  await page.selectOption('#years', `${year}`);

  //Select checkboxes and create account
  await page.waitForSelector('#newsletter', { state: 'visible' });
  await page.click('#newsletter');

  await page.waitForSelector('#optin', { state: 'visible' });
  await page.click('#optin');

  //Fill in address details
  await page.fill('#first_name', randomFirstName)
  await page.fill('#last_name', randomLastName)
  await page.fill('#address1', '123 Test St');
  await page.fill('#address2', 'Testbury');
  await page.selectOption('#country', 'United States');
  await page.fill('#state', 'California');
  await page.fill('#city', 'Test City');
  await page.fill('#zipcode', '12345');
  await page.fill('#mobile_number', '1234567890');

  //Create Account
  await clickElement(page, 'button[data-qa="create-account"]');

  //Verify account creation and continue
  await page.waitForSelector('b:has-text("Account Created!")', { state: 'visible' });
  await verifyElementVisible(page, 'b:has-text("Account Created!")');
  await clickElement(page, 'a[data-qa="continue-button"]');

  //Verify login message
  await page.waitForSelector(`a:has-text("Logged in as ${randomFullName}")`, { state: 'visible' });
  await verifyElementVisible(page, `a:has-text("Logged in as ${randomFullName}")`);

  //Delete the account
  await page.waitForSelector('a[href="/delete_account"]', { state: 'visible' });
  await clickElement(page, 'a[href="/delete_account"]');
  await page.waitForSelector('b:has-text("Account Deleted!")', { state: 'visible' });
  await verifyElementVisible(page, 'b:has-text("Account Deleted!")');
});
