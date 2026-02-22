import { Page, expect } from "@playwright/test";

export class BasePage {
  constructor(protected page: Page) {}

  async navigate(path: string) {
    await this.page.goto(path);
  }

  async clickElement(identifier: string) {
    const locator = this.page.getByRole('button', { name: identifier, exact: false })
      .or(this.page.getByText(identifier, { exact: false }))
      .or(this.page.locator(identifier));
    await locator.first().click();
  }

  async fillField(fieldIdentifier: string, value: string) {
    const locator = this.page.getByPlaceholder(fieldIdentifier, { exact: false })
      .or(this.page.getByLabel(fieldIdentifier, { exact: false }))
      .or(this.page.locator(`[data-testid*="${fieldIdentifier}"]`));

    await locator.first().fill(value);
  }

  async selectOption(dropdownIdentifier: string, option: string) {
    const dropdown = this.page.getByLabel(dropdownIdentifier).or(this.page.getByPlaceholder(dropdownIdentifier));
    await dropdown.selectOption({ label: option });
  }

  async verifyTextVisible(text: string) {
    await expect(this.page.getByText(text).first()).toBeVisible({ timeout: 5000 });
  }

  async verifyUrlContains(path: string) {
    await expect(this.page).toHaveURL(new RegExp(path), { timeout: 5000 });
  }
}
