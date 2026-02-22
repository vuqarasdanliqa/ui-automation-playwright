import { Configuration, RunsApi, ResultsApi } from "qase-api-client";
import * as dotenv from "dotenv";

dotenv.config();

const config = new Configuration({
  apiKey: process.env.QASE_API_TOKEN || "",
  basePath: "https://api.qase.io/v1",
});

const runsApi: any = new RunsApi(config);
const resultsApi: any = new ResultsApi(config);

export async function startTestRun(title: string): Promise<number | undefined> {
  const projectCode = process.env.QASE_PROJECT_CODE || "";
  if (!process.env.QASE_API_TOKEN) {
    throw new Error("QASE_API_TOKEN is not set");
  }
  if (!projectCode) {
    throw new Error("QASE_PROJECT_CODE is not set");
  }

  const run = {
    title,
    description: "Automation run via Cucumber + Playwright",
    environment: "Browser: " + (process.env.BROWSER || "chromium"),};

  try {
    const response = await runsApi.createRun(projectCode, run);
    return response?.data?.result?.id ?? response?.result?.id ?? response?.id;
  } catch (err: any) {
    if (err?.response) {
      console.error("Qase createRun failed:", {
        status: err.response.status,
        data: err.response.data,
      });
    } else {
      console.error("Qase createRun error:", err);
    }
    throw err;
  }
}

export async function finishTestRun(
  runId: number,
  results: { caseId: number; status: string }[]
): Promise<void> {
  const projectCode = process.env.QASE_PROJECT_CODE || "";
  if (!projectCode) {
    console.warn("QASE_PROJECT_CODE not set; skipping sending results");
    return;
  }

  const bulkResults = results.map((r) => ({
    case_id: r.caseId,
    status: r.status,
  }));

  for (const result of bulkResults) {
    try {
      await resultsApi.createResult(projectCode, runId, result);
    } catch (err: any) {
      if (err?.response) {
        console.error("Qase createResult failed for case", result.case_id, {
          status: err.response.status,
          data: err.response.data,
        });
      } else {
        console.error("Qase createResult error for case", result.case_id, err);
      }
    }
  }

  try {
    await runsApi.completeRun(projectCode, runId);
  } catch (err: any) {
    if (err?.response) {
      console.error("Qase completeRun failed for run", runId, {
        status: err.response.status,
        data: err.response.data,
      });
    } else {
      console.error("Qase completeRun error for run", runId, err);
    }
  }
}