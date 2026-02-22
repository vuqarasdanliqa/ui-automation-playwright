import { Configuration, RunsApi, ResultsApi } from "qase-api-client";
import * as dotenv from "dotenv";
import { BASE_PATH } from "qase-api-client/dist/base";

dotenv.config();

const config = new Configuration({
  apiKey: process.env.QASE_API_TOKEN || "",
  basePath: process.env.QASE_API_BASE_URL,
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
  if(!process.env.QASE_API_BASE_URL) {
    throw new Error("QASE_API_BASE_URL is not set");
  }

  const run = {
    title,
    description: "Automation run via Cucumber + Playwright",
    environment: "Browser: " + (process.env.BROWSER || "chromium"),
  };

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

  console.log(`\nFinishing run ${runId} with ${results.length} results`);


  for (const result of results) {
    try {
      const payload = {
        case_id: result.caseId,
        status: result.status,
        time_ms: 1000, 
      };
      
      console.log(`Sending result for case ${result.caseId}:`, payload);
      const response = await resultsApi.createResult(projectCode, runId, payload);
      console.log(`✓ Result created for case ${result.caseId}`);
    } catch (err: any) {
      if (err?.response) {
        console.error(`Failed to create result for case ${result.caseId}:`, {
          status: err.response.status,
          data: err.response.data,
        });
        
        if (err.response.status === 404) {
          console.error(`→ Case ${result.caseId} doesn't exist in project ${projectCode}`);
        } else if (err.response.status === 400) {
          console.error(`→ Invalid payload:`, err.response.data);
        }
      } else {
        console.error(`Error for case ${result.caseId}:`, err);
      }
    }
  }

  try {
    console.log(`Completing run ${runId}...`);
    await runsApi.completeRun(projectCode, runId);
    console.log(`✓ Run ${runId} completed`);
  } catch (err: any) {
    if (err?.response) {
      console.error(`Failed to complete run ${runId}:`, {
        status: err.response.status,
        data: err.response.data,
      });
    } else {
      console.error(`Error completing run ${runId}:`, err);
    }
  }
}