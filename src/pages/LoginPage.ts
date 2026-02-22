import { BasePage } from "./BasePage";
import { expect } from "@playwright/test";

export class LoginPage extends BasePage {

  async login(username: string, password: string) {
    await this.page.waitForLoadState('networkidle'); 
    await this.fillField("username", username);
    await this.fillField("password", password);
    await this.clickElement("submit");
  }

  async verifyLoginSuccess() {
    await this.verifyUrlContains("/dashboard");
  }

  async verifyLoginError(expectedMessage: string) {
    const errorLocator = this.page.locator(".alert__description");
    
    await expect(errorLocator).toBeVisible({ timeout: 5000 });
    
    await expect(errorLocator).toContainText(expectedMessage);
  }
}
