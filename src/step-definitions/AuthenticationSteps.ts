import { Given, When, Then, DataTable } from "@cucumber/cucumber";
import { CustomWorld } from "../support/world";
import { LoginPage } from "../pages/LoginPage";


let loginPage: LoginPage;


When("user enters the following credentials:", async function (this: CustomWorld, dataTable: DataTable) {
  const credentials = dataTable.rowsHash();
  const username = credentials["username"];
  const password = credentials["password"];

  loginPage = new LoginPage(this.page);
  await loginPage.login(username, password);
});

When("user logs in with username {string} and password {string}", async function (this: CustomWorld, username: string, password: string) {
  loginPage = new LoginPage(this.page);
  await loginPage.login(username, password);
});

When("user enters username {string}", async function (this: CustomWorld, username: string) {
  loginPage = new LoginPage(this.page);
  await loginPage.enterUsername(username);
});

When("user enters password {string}", async function (this: CustomWorld, password: string) {
  loginPage = new LoginPage(this.page);
  await loginPage.enterPassword(password);
});

When("user clicks login button", async function (this: CustomWorld) {
  loginPage = new LoginPage(this.page);
  await loginPage.clickLoginButton();
});


Then("user should be redirected to dashboard", async function (this: CustomWorld) {
  loginPage = new LoginPage(this.page);
  await loginPage.verifyLoginSuccess();
});

Then("user should be logged in successfully", async function (this: CustomWorld) {
  loginPage = new LoginPage(this.page);
  await loginPage.verifyLoginSuccess();
});

Then("login should fail with error {string}", async function (this: CustomWorld, expectedMessage: string) {
  loginPage = new LoginPage(this.page);
  await loginPage.verifyLoginError(expectedMessage);
});

Then("user should see login error {string}", async function (this: CustomWorld, expectedMessage: string) {
  loginPage = new LoginPage(this.page);
  await loginPage.verifyLoginError(expectedMessage);
});

Then("login button should be enabled", async function (this: CustomWorld) {
  loginPage = new LoginPage(this.page);
  const isEnabled = await loginPage.isLoginButtonEnabled();
  if (!isEnabled) {
    throw new Error("Login button is not enabled");
  }
});

Then("login button should be disabled", async function (this: CustomWorld) {
  loginPage = new LoginPage(this.page);
  const isEnabled = await loginPage.isLoginButtonEnabled();
  if (isEnabled) {
    throw new Error("Login button should be disabled but it is enabled");
  }
});