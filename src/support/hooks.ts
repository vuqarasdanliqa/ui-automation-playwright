import { BeforeAll, AfterAll, Before, After, Status } from "@cucumber/cucumber";
import * as fs from "fs";
import * as path from "path";
import { browserManager } from "./browserManager";
import { CustomWorld } from "./world";
import { qaseManager } from "../integration/QaseManager";
import { startTestRun, finishTestRun } from "../integration/qaseio";

/**
 * Extract Qase Case ID from scenario tags like @QASE_2
 */
function getQaseCaseIdFromTags(tags: readonly { name: string }[]): number {
  for (const tag of tags) {
    const match = tag.name.match(/^@QASE_(\d+)$/i);
    if (match) return Number(match[1]);
  }
  return 0;
}

BeforeAll(async () => {
  // Launch global browser
  await browserManager.launch(
    process.env.BROWSER || "chromium",
    process.env.HEADLESS !== "false"
  );

  // Start Qase run only if token & project code exist
  if (process.env.QASE_API_TOKEN && process.env.QASE_PROJECT_CODE) {
    try {
      const now = new Date().toISOString();
      const runTitle = `Automation Run ${now}`;
      const runId = await startTestRun(runTitle);
      qaseManager.setRunId(runId!);
      console.log(`Qase test run started: ${runTitle} (ID: ${runId})`);
      
    } catch (err) {
      console.warn("Failed to start Qase test run, tests will still run locally.", err);
    }
  } else {
    console.warn("QASE_API_TOKEN or QASE_PROJECT_CODE not set; skipping Qase integration.");
  }
});

Before(async function (this: CustomWorld) {
  // Initialize fresh browser context + page per scenario
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

  // ===== CRITICAL: Add result to Qase FIRST, before any cleanup =====
  // This ensures results are collected even if screenshot/video/cleanup times out
  const runId = qaseManager.getRunId();
  if (runId) {
    const caseId = getQaseCaseIdFromTags(scenario.pickle.tags);
    if (caseId > 0) {
      let status: "passed" | "failed" | "skipped" = "skipped";
      if (scenario.result?.status === Status.PASSED) status = "passed";
      else if (scenario.result?.status === Status.FAILED) status = "failed";

      console.log(`Adding result: Case ${caseId} - ${status}`);
      qaseManager.addResult({ caseId, status });
    } else {
      console.warn(`No Qase tag found for scenario: ${scenario.pickle.name}`);
      console.warn(`Tags found:`, scenario.pickle.tags.map(t => t.name).join(', '));
    }
  }

  // ===== Now handle screenshots/videos (these might timeout) =====
  try {
    // Capture screenshot & video only if scenario failed
    if (scenario.result?.status === Status.FAILED) {
      // SCREENSHOT
      try {
        const screenshotBuffer = await this.page.screenshot({ 
          fullPage: true,
          timeout: 3000 // Add timeout to prevent hanging
        });
        const screenshotDir = path.resolve("reports/screenshots");
        fs.mkdirSync(screenshotDir, { recursive: true });
        const screenshotPath = path.join(screenshotDir, `${safeName}_${timestamp}.png`);
        fs.writeFileSync(screenshotPath, screenshotBuffer);
        await this.attach(screenshotBuffer, "image/png");
      } catch (err) {
        console.warn("Failed to capture screenshot:", err);
      }

      // VIDEO
      try {
        const video = this.page.video();
        if (video) {
          const videoDir = path.resolve("reports/videos");
          fs.mkdirSync(videoDir, { recursive: true });
          const videoPath = path.join(videoDir, `${safeName}_${timestamp}.webm`);
          await video.saveAs(videoPath);
          await video.delete();
        }
      } catch (err) {
        console.warn("Failed to save video:", err);
      }
    }
  } catch (err) {
    console.warn("Error during screenshot/video capture:", err);
  }

  // Cleanup context/page
  try {
    await this.cleanup();
  } catch (err) {
    console.warn("Failed to cleanup:", err);
  }
});

AfterAll(async () => {
  // Close global browser
  await browserManager.close();

  // Finish Qase run only if run exists
  const runId = qaseManager.getRunId();
  if (runId) {
    const results = qaseManager.getResults();
    console.log(`\nSending ${results.length} results to Qase run ${runId}`);
    
    if (results.length === 0) {
      console.warn("⚠️  No results collected! Check that scenarios have @QASE_X tags");
    } else {
      console.log("Results to send:", JSON.stringify(results, null, 2));
    }
    
    try {
      await finishTestRun(runId, results);
      console.log(`Qase test run completed: ID ${runId}`);
    } catch (err) {
      console.warn("Failed to finish Qase test run, but tests ran locally.", err);
    }
  }
});