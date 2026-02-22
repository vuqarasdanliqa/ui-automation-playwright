import { Browser, chromium, firefox, webkit } from "playwright";

class BrowserManager {
  private browser?: Browser;

  async launch(browserName: string = "chromium", headless: boolean = true) {
    if (this.browser) return this.browser;

    switch (browserName) {
      case "firefox":
        this.browser = await firefox.launch({ headless });
        break;
      case "webkit":
        this.browser = await webkit.launch({ headless });
        break;
      default:
        this.browser = await chromium.launch({ headless });
    }

    return this.browser;
  }

  getBrowser(): Browser {
    if (!this.browser) {
      throw new Error("Browser not initialized");
    }
    return this.browser;
  }

  async close() {
    await this.browser?.close();
    this.browser = undefined;
  }
}

export const browserManager = new BrowserManager();