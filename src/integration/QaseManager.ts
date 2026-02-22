class QaseManager {
  private runId?: number;
  private results: { caseId: number; status: string }[] = [];

  setRunId(id: number) {
    this.runId = id;
  }

  getRunId() {
    return this.runId;
  }

  addResult(result: { caseId: number; status: string }) {
    this.results.push(result);
  }

  getResults() {
    return this.results;
  }
}

export const qaseManager = new QaseManager();