import { BasePage } from "./BasePage";
import { Page, expect } from "@playwright/test";


export class LoginPage extends BasePage {
  
  private readonly usernameInput = () => this.findInputField("username");
  private readonly passwordInput = () => this.findInputField("password");
  private readonly loginButton = () => this.page.getByRole('button', { name: 'Davam et', exact: true });
  private readonly errorMessage = () => this.page.locator('.alert__description');
  constructor(page: Page) {
    super(page);
  }


  async enterUsername(username: string): Promise<void> {
    await this.waitForPageLoad('domcontentloaded');
    const input = this.usernameInput();
    await input.waitFor({ state: 'visible', timeout: 15000 });
    await input.fill(username);
  }

 
  async enterPassword(password: string): Promise<void> {
    const input = this.passwordInput();
    await input.waitFor({ state: 'visible', timeout: 10000 });
    await input.fill(password);
  }


  async clickLoginButton(): Promise<void> {
    const button = this.loginButton();
    await button.waitFor({ state: 'visible', timeout: 10000 });
    await button.click({ timeout: 10000 });
  }

 
  async login(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLoginButton();
  }

  
  async verifyLoginSuccess(timeout: number = 10000): Promise<void> {
    await this.verifyUrlContains("/dashboard", timeout);
  }

  
  async verifyLoginError(expectedMessage: string, timeout: number = 10000): Promise<void> {
    await expect(this.errorMessage().first()).toBeVisible({ timeout });
    await expect(this.errorMessage().first()).toContainText(expectedMessage);
  }

 
  async getErrorMessage(): Promise<string> {
    await this.errorMessage().first().waitFor({ state: 'visible', timeout: 10000 });
    return await this.errorMessage().first().textContent() || "";
  }

 
  async isLoginButtonEnabled(): Promise<boolean> {
    try {
      await this.loginButton().waitFor({ state: 'visible', timeout: 5000 });
      return await this.loginButton().isEnabled();
    } catch {
      return false;
    }
  }

  
  async waitForPageReady(): Promise<void> {
    await this.usernameInput().waitFor({ state: 'visible', timeout: 15000 });
    await this.passwordInput().waitFor({ state: 'visible', timeout: 15000 });
  }
}