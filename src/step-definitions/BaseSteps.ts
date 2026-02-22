import { Given, When, Then, DataTable } from "@cucumber/cucumber";
import { CustomWorld } from "../support/world";
import { LoginPage } from "../pages/LoginPage";
import { expect } from "@playwright/test";

let loginPage: LoginPage;

Given("user navigates to {string}", async function (this: CustomWorld, url: string) {
  loginPage = new LoginPage(this.page);
  await this.page.goto(url);
});

When("user enters the following credentials:", async function (dataTable: DataTable) {
  const credentials = dataTable.rowsHash();
  const username = credentials["username"];
  const password = credentials["password"];

  const loginPage = new LoginPage(this.page);
  await loginPage.login(username, password);
});

When("I click on the {string} button", async function (buttonName: string) {
  await this.currentPage.clickDynamicButton(buttonName);
});

When("I type {string} in the {string} field", async function (text: string, fieldName: string) {
  await this.currentPage.fillDynamicField(fieldName, text);
});

When("I select {string} from the {string} dropdown", async function (option: string, dropdownName: string) {
  await this.currentPage.selectFromDropdown(dropdownName, option);
});

When("user clicks on the {string} button", async function (this: CustomWorld, buttonName: string) {
  await this.currentPage.clickElement(buttonName);
});

Then("I should see {string} text", async function (expectedText: string) {
  const isVisible = await this.currentPage.isTextVisible(expectedText);
  expect(isVisible).toBe(true);
});

Then("user should be redirected to dashboard", async function () {
  await loginPage.verifyLoginSuccess();
});

Then("user should see error message {string}", async function (expectedMessage: string) {
  const loginPage = new LoginPage(this.page);
  await loginPage.verifyLoginError(expectedMessage);
});


