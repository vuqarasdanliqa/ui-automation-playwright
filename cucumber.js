module.exports = {
  default: {
    require: [
      "src/step-definitions/**/*.ts",
      "src/support/**/*.ts"
    ],
    requireModule: ["ts-node/register"],
    format: [
      'progress-bar',
      'html:cucumber-report.html'
    ],
    formatOptions: {
      resultsDir: "reports/allure-results"
    },
    paths: ["features/**/*.feature"],
    publishQuiet: true
  }
};