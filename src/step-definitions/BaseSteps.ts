import { Given, When, Then } from "@cucumber/cucumber";
import { CustomWorld } from "../support/world";
import { expect } from "@playwright/test";


Given("user navigates to {string}", async function (this: CustomWorld, url: string) {
  await this.page.goto(url, { 
    waitUntil: 'domcontentloaded', 
    timeout: 30000 
  });
});

Given("user is on {string} page", async function (this: CustomWorld, url: string) {
  await this.page.goto(url, { 
    waitUntil: 'domcontentloaded',
    timeout: 30000 
  });
});


When("user clicks on the {string} button", async function (this: CustomWorld, buttonName: string) {
  const button = this.page.getByRole('button', { name: buttonName, exact: false })
    .or(this.page.getByText(buttonName, { exact: false }))
    .or(this.page.locator(buttonName));
  await button.first().click({ timeout: 10000 });
});

When("user clicks on {string}", async function (this: CustomWorld, elementIdentifier: string) {
  const element = this.page.getByText(elementIdentifier, { exact: false })
    .or(this.page.locator(elementIdentifier));
  await element.first().click({ timeout: 10000 });
});


When("user enters {string} in the {string} field", async function (this: CustomWorld, text: string, fieldName: string) {
  const field = this.page.getByPlaceholder(fieldName, { exact: false })
    .or(this.page.getByLabel(fieldName, { exact: false }))
    .or(this.page.locator(`[data-testid*="${fieldName}"]`))
    .or(this.page.locator(`input[name*="${fieldName}"]`))
    .or(this.page.locator(`input[id*="${fieldName}"]`));
  
  await field.first().waitFor({ state: 'visible', timeout: 10000 });
  await field.first().fill(text);
});

When("user types {string} into {string}", async function (this: CustomWorld, text: string, fieldName: string) {
  const field = this.page.getByPlaceholder(fieldName, { exact: false })
    .or(this.page.getByLabel(fieldName, { exact: false }))
    .or(this.page.locator(`input[name*="${fieldName}"]`));
  
  await field.first().waitFor({ state: 'visible', timeout: 10000 });
  await field.first().type(text);
});

When("user clears the {string} field", async function (this: CustomWorld, fieldName: string) {
  const field = this.page.getByLabel(fieldName).or(this.page.getByPlaceholder(fieldName));
  await field.first().clear();
});


When("user selects {string} from the {string} dropdown", async function (this: CustomWorld, option: string, dropdownName: string) {
  const dropdown = this.page.getByLabel(dropdownName)
    .or(this.page.getByPlaceholder(dropdownName))
    .or(this.page.locator(`select[name*="${dropdownName}"]`));
  await dropdown.first().selectOption({ label: option });
});


Then("user should see {string}", async function (this: CustomWorld, expectedText: string) {
  await expect(this.page.getByText(expectedText, { exact: false }).first())
    .toBeVisible({ timeout: 10000 });
});

Then("user should see {string} text", async function (this: CustomWorld, expectedText: string) {
  await expect(this.page.getByText(expectedText, { exact: false }).first())
    .toBeVisible({ timeout: 10000 });
});

Then("user should not see {string}", async function (this: CustomWorld, text: string) {
  await expect(this.page.getByText(text).first())
    .not.toBeVisible({ timeout: 5000 });
});

Then("user should see error message {string}", async function (this: CustomWorld, errorMessage: string) {
  const errorLocator = this.page.locator(".alert__description, .error-message, [role='alert'], .error");
  await expect(errorLocator.first()).toBeVisible({ timeout: 10000 });
  await expect(errorLocator.first()).toContainText(errorMessage);
});

Then("the {string} button should be enabled", async function (this: CustomWorld, buttonName: string) {
  const button = this.page.getByRole('button', { name: buttonName });
  await expect(button).toBeEnabled({ timeout: 5000 });
});

Then("the {string} button should be disabled", async function (this: CustomWorld, buttonName: string) {
  const button = this.page.getByRole('button', { name: buttonName });
  await expect(button).toBeDisabled({ timeout: 5000 });
});


Then("user should be redirected to {string}", async function (this: CustomWorld, path: string) {
  await expect(this.page).toHaveURL(new RegExp(path), { timeout: 10000 });
});

Then("current URL should contain {string}", async function (this: CustomWorld, path: string) {
  await expect(this.page).toHaveURL(new RegExp(path), { timeout: 10000 });
});

Then("current URL should be {string}", async function (this: CustomWorld, url: string) {
  await expect(this.page).toHaveURL(url, { timeout: 10000 });
});


When("user waits for {int} seconds", async function (this: CustomWorld, seconds: number) {
  await this.page.waitForTimeout(seconds * 1000);
});

When("user waits for {string} to be visible", async function (this: CustomWorld, elementText: string) {
  await this.page.getByText(elementText).first()
    .waitFor({ state: 'visible', timeout: 15000 });
});

When("user waits for page to load", async function (this: CustomWorld) {
  await this.page.waitForLoadState('domcontentloaded', { timeout: 30000 });
});


When("user checks the {string} checkbox", async function (this: CustomWorld, checkboxName: string) {
  const checkbox = this.page.getByLabel(checkboxName)
    .or(this.page.locator(`input[type="checkbox"][name*="${checkboxName}"]`));
  await checkbox.first().check();
});

When("user unchecks the {string} checkbox", async function (this: CustomWorld, checkboxName: string) {
  const checkbox = this.page.getByLabel(checkboxName)
    .or(this.page.locator(`input[type="checkbox"][name*="${checkboxName}"]`));
  await checkbox.first().uncheck();
});

When("user selects the {string} radio button", async function (this: CustomWorld, radioName: string) {
  const radio = this.page.getByLabel(radioName)
    .or(this.page.locator(`input[type="radio"][value*="${radioName}"]`));
  await radio.first().check();
});