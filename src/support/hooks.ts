// src/support/hooks.ts
import { BeforeAll, AfterAll, Before, After, Status } from "@cucumber/cucumber";
import * as fs from "fs";
import * as path from "path";
import { browserManager } from "./browserManager";
import { CustomWorld } from "./world";

BeforeAll(async () => {
  // Launch the global browser before all tests
  await browserManager.launch(
    process.env.BROWSER || "chromium",
    process.env.HEADLESS !== "false"
  );
});

Before(async function (this: CustomWorld) {
  // Initialize a fresh browser context and page per scenario
  await this.init({
    recordVideo: {
      dir: path.resolve("reports/videos-temp"),
      size: { width: 1280, height: 720 },
    },
  });
});

After(async function (this: CustomWorld, scenario) {
  const safeName = scenario.pickle.name.replace(/[^a-zA-Z0-9]+/g, "_").toLowerCase();
  const timestamp = Date.now();

  if (scenario.result?.status === Status.FAILED) {
    // SCREENSHOT
    const screenshotBuffer = await this.page.screenshot({ fullPage: true });
    const screenshotDir = path.resolve("reports/screenshots");
    fs.mkdirSync(screenshotDir, { recursive: true });
    const screenshotPath = path.join(screenshotDir, `${safeName}_${timestamp}.png`);
    fs.writeFileSync(screenshotPath, screenshotBuffer);
    await this.attach(screenshotBuffer, "image/png");

    // VIDEO - avoid duplicates
   const video = this.page.video();
if (video) {
  const videoPath = path.join(path.resolve("reports/videos"), `${safeName}_${timestamp}.webm`);
  await video.saveAs(videoPath); // save to final folder
  await video.delete();           // removes temp file from videos-temp
}
  }

  await this.cleanup();
});

AfterAll(async () => {
  // Close the global browser after all tests
  await browserManager.close();
});