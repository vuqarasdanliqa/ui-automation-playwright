import { Before, After, AfterAll, Status } from "@cucumber/cucumber";
import { CustomWorld } from "./world";
import { startTestRun, finishTestRun } from "../integration/qaseio";

let runId: number | undefined;
let results: { caseId: number; status: string }[] = [];

Before(async function (this: CustomWorld) {
  await this.launchBrowser();
  if (!runId) {
    runId = await startTestRun("Automation Run " + new Date().toISOString());
  }
});

After(async function (this: CustomWorld, scenario) {
  await this.closeBrowser();

  const qaseTag = scenario.pickle.tags.find((t) => t.name.startsWith("@QASE_"));
  if (qaseTag && runId) {
    const caseId = parseInt(qaseTag.name.replace("@QASE_", ""), 10);
    const status = scenario.result?.status === Status.PASSED ? "passed" : "failed";
    results.push({ caseId, status });
  }
});

AfterAll(async () => {
  if (runId && results.length) {
    await finishTestRun(runId, results);
  }
});