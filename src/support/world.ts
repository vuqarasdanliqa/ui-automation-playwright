import { setWorldConstructor, World } from "@cucumber/cucumber";
import { BrowserContext, Page, BrowserContextOptions } from "playwright";
import { browserManager } from "./browserManager";

export class CustomWorld extends World {
  context!: BrowserContext;
  page!: Page;

  async init(options?: BrowserContextOptions) {
    const browser = browserManager.getBrowser();
    this.context = await browser.newContext(options);
    this.page = await this.context.newPage();
  }

  async cleanup() {
    if (this.context) {
      await this.context.close();
      this.context = undefined as any;
      this.page = undefined as any;
    }
  }
}

setWorldConstructor(CustomWorld);