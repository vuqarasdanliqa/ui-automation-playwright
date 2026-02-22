import { setWorldConstructor, IWorldOptions } from "@cucumber/cucumber";
import { Browser, Page, chromium, firefox, webkit, BrowserContext } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { BasePage } from "../pages/BasePage";

export class CustomWorld {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;
  
  loginPage!: LoginPage;
  currentPage!: BasePage;

  constructor(options: IWorldOptions) {
    console.debug('CustomWorld: constructor called');}

  async launchBrowser() {
    const browserName = (process.env.BROWSER || 'chromium').toLowerCase();
    const headless = process.env.HEADLESS !== 'false'; 

    console.debug(`CustomWorld: launching ${browserName} (headless=${headless})`);

    const launchOptions = { headless };

    switch (browserName) {
      case 'firefox':
        this.browser = await firefox.launch(launchOptions);
        break;
      case 'webkit':
      case 'safari':
        this.browser = await webkit.launch(launchOptions);
        break;
      default:
        this.browser = await chromium.launch(launchOptions);
    }

    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();
    
    this.loginPage = new LoginPage(this.page);
    this.currentPage = this.loginPage; 

    console.debug('CustomWorld: browser and pages initialized');
  }

  async closeBrowser() {
    await this.page?.close();
    await this.context?.close();
    await this.browser?.close();
    console.debug('CustomWorld: browser closed');
  }
}

setWorldConstructor(CustomWorld);
