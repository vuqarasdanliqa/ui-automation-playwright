import { Page, expect, Locator } from "@playwright/test";

export class BasePage {
  protected readonly DEFAULT_TIMEOUT = 10000;

  constructor(protected page: Page) {}

  
  async navigate(url: string, waitUntil: 'load' | 'domcontentloaded' | 'networkidle' = 'domcontentloaded'): Promise<void> {
    await this.page.goto(url, { 
      waitUntil, 
      timeout: 30000 
    });
  }

 
  async waitForPageLoad(state: 'load' | 'domcontentloaded' | 'networkidle' = 'domcontentloaded'): Promise<void> {
    await this.page.waitForLoadState(state, { timeout: 30000 });
  }

  
  protected findElement(identifier: string): Locator {
    return this.page.getByRole('button', { name: identifier, exact: false })
      .or(this.page.getByText(identifier, { exact: false }))
      .or(this.page.locator(identifier));
  }

  
  protected findInputField(fieldIdentifier: string): Locator {
    return this.page.getByPlaceholder(fieldIdentifier, { exact: false })
      .or(this.page.getByLabel(fieldIdentifier, { exact: false }))
      .or(this.page.locator(`[data-testid*="${fieldIdentifier}"]`))
      .or(this.page.locator(`input[name*="${fieldIdentifier}"]`))
      .or(this.page.locator(`input[id*="${fieldIdentifier}"]`));
  }

 
  protected findDropdown(identifier: string): Locator {
    return this.page.getByLabel(identifier)
      .or(this.page.getByPlaceholder(identifier))
      .or(this.page.locator(`select[name*="${identifier}"]`));
  }

  
  async click(identifier: string, timeout: number = this.DEFAULT_TIMEOUT): Promise<void> {
    const element = this.findElement(identifier).first();
    await element.waitFor({ state: 'visible', timeout });
    await element.click({ timeout });
  }

  
  async fill(fieldIdentifier: string, value: string, timeout: number = this.DEFAULT_TIMEOUT): Promise<void> {
    const element = this.findInputField(fieldIdentifier).first();
    await element.waitFor({ state: 'visible', timeout });
    await element.fill(value);
  }

  
  async selectOption(dropdownIdentifier: string, option: string, timeout: number = this.DEFAULT_TIMEOUT): Promise<void> {
    const element = this.findDropdown(dropdownIdentifier).first();
    await element.waitFor({ state: 'visible', timeout });
    await element.selectOption({ label: option });
  }

  
  async getText(identifier: string, timeout: number = this.DEFAULT_TIMEOUT): Promise<string> {
    const element = this.findElement(identifier).first();
    await element.waitFor({ state: 'visible', timeout });
    return await element.textContent() || "";
  }

  
  async isVisible(identifier: string, timeout: number = 5000): Promise<boolean> {
    try {
      await this.findElement(identifier).first().waitFor({ state: 'visible', timeout });
      return true;
    } catch {
      return false;
    }
  }

  
  async waitForElement(identifier: string, timeout: number = this.DEFAULT_TIMEOUT): Promise<void> {
    await this.findElement(identifier).first().waitFor({ state: 'visible', timeout });
  }

  
  async verifyTextVisible(text: string, timeout: number = this.DEFAULT_TIMEOUT): Promise<void> {
    await expect(this.page.getByText(text, { exact: false }).first())
      .toBeVisible({ timeout });
  }

  
  async verifyUrlContains(path: string, timeout: number = this.DEFAULT_TIMEOUT): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(path), { timeout });
  }

  
  async verifyUrlEquals(url: string, timeout: number = this.DEFAULT_TIMEOUT): Promise<void> {
    await expect(this.page).toHaveURL(url, { timeout });
  }

 
  getCurrentUrl(): string {
    return this.page.url();
  }

  
  async takeScreenshot(name: string): Promise<Buffer> {
    return await this.page.screenshot({ 
      fullPage: true, 
      path: `screenshots/${name}.png`,
      timeout: 5000 
    });
  }

  
  async waitForNetworkIdle(timeout: number = 30000): Promise<void> {
    try {
      await this.page.waitForLoadState('networkidle', { timeout });
    } catch (error) {
      console.warn('Network idle timeout, continuing anyway');
    }
  }


  async reload(): Promise<void> {
    await this.page.reload({ 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });
  }
}