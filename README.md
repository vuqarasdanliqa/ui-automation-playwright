# 🎭 UI Automation Framework

**Modern, scalable BDD-driven UI automation framework built with Playwright, Cucumber, and TypeScript**

---

## Table of Contents

- [Overview]
- [Features]
- [Architecture]
- [Design Patterns]
- [Prerequisites]
- [Installation]
- [Configuration]
- [Project Structure]
- [Running Tests]
- [Writing Tests]
- [Qase Integration]
- [Reporting]
- [Best Practices]

---

## Overview

Enterprise-grade UI automation framework implementing industry-standard design patterns and best practices for modern web application testing. Built on Playwright's cross-browser automation capabilities and Cucumber's BDD approach, this framework enables business-readable test scenarios while maintaining clean, maintainable code architecture.

### Key Highlights

- **Cross-Browser Testing** - Chromium, Firefox, WebKit support
- **BDD Approach** - Business-readable Gherkin scenarios
- **Type Safety** - Full TypeScript implementation
- **Layered Architecture** - Clear separation of concerns
- **Test Management** - Integrated Qase.io reporting
- **Rich Reporting** - Allure & Cucumber HTML reports
- **CI/CD Ready** - Designed for continuous integration
- **Auto Capture** - Screenshots & videos on failure

---

## Features

### Testing Capabilities

- Multi-browser execution (Chromium, Firefox, WebKit)
- Parallel test execution support
- Automatic retry mechanism for flaky tests
- Page object model implementation
- Reusable step definitions
- Data-driven testing with Cucumber tables

### Reporting & Monitoring

- Allure HTML reports with detailed test metrics
- Cucumber HTML reports
- Automatic screenshot capture on failure
- Video recording for failed scenarios
- Qase.io test management integration

### Developer Experience

- TypeScript with strict mode enabled
- Clean layered architecture
- Modular and extensible design
- Flexible element locator strategies
- Fast test execution with optimized waits

---

## Architecture

The framework follows a **3-tier layered architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                    FEATURE LAYER                            │
│  Business-readable scenarios written in Gherkin             │
│  └─ features/**/*.feature                                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    STEP DEFINITION LAYER                    │
│  Glue code connecting features to page objects              │
│  ├─ BaseSteps.ts (Generic reusable steps)                   │
│  └─ AuthenticationSteps.ts (Domain-specific steps)          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    PAGE OBJECT LAYER                        │
│  Encapsulated page elements and actions                     │
│  ├─ BasePage.ts (Common methods & utilities)                │
│  └─ LoginPage.ts (Page-specific locators & actions)         │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    PLAYWRIGHT LAYER                         │
│  Browser automation engine                                  │
└─────────────────────────────────────────────────────────────┘
```

### Layer Responsibilities

| Layer                | Responsibility                              | Examples                                |
| -------------------- | ------------------------------------------- | --------------------------------------- |
| **Feature**          | Define WHAT to test in business language    | Login scenarios, user flows             |
| **Step Definitions** | Define HOW to interpret Gherkin steps       | Map "user clicks login" to page actions |
| **Page Objects**     | Define WHERE elements are & HOW to interact | Locators, element interactions          |
| **Playwright**       | Execute low-level browser commands          | Click, fill, navigate                   |

---

## Design Patterns

### 1. Page Object Model (POM)

**Purpose**: Encapsulate page structure and reduce code duplication

**Benefits**:

- Single source of truth for page elements
- Easy maintenance when UI changes
- Promotes code reusability

### 2. Singleton Pattern

**Purpose**: Ensure single browser instance across test suite

**Benefits**:

- Resource optimization
- Faster test execution
- Consistent browser state

### 3. Factory Pattern

**Purpose**: Flexible locator creation strategy

**Benefits**:

- Multiple fallback strategies
- Resilient element location
- Easy to extend with new strategies

### 4. Facade Pattern

**Purpose**: Simplify complex operations with simple interface

**Benefits**:

- Simplified API for test writers
- Handles complexities internally (waits, retries)
- Consistent behavior across framework

### 5. Strategy Pattern

**Purpose**: Multiple wait strategies for different scenarios

**Benefits**:

- Flexible wait conditions
- Optimized page load handling
- Avoids flaky tests

---

## ⚙️ Prerequisites

| Requirement | Version | Purpose               |
| ----------- | ------- | --------------------- |
| Node.js     | ≥ 18.x  | Runtime environment   |
| npm         | ≥ 9.x   | Package management    |
| TypeScript  | ≥ 5.x   | Type-safe development |

---

## Configuration

### Environment Variables

Create a `.env` file in the project root:

```bash
# Browser Configuration
BROWSER=chromium                    # Options: chromium, firefox, webkit
HEADLESS=false                      # true for CI/CD, false for local debugging

# Qase.io Integration (Optional)
QASE_API_TOKEN=your_api_token_here
QASE_PROJECT_CODE=your_project_code
QASE_API_BASE_URL=https://api.qase.io/v1
```

### Cucumber Configuration

**File**: `cucumber.js`

### TypeScript Configuration

**File**: `tsconfig.json`

---

## Running Tests

### Basic Execution

```bash
# Run all tests with default browser (Chromium)
npm test

# Run with specific browser
npm run test:chromium
npm run test:firefox
npm run test:webkit

# Run all browsers sequentially
npm run test:all
```

### Execution Modes

```bash
# Headless mode (for CI/CD)
HEADLESS=true npm test

# Headed mode (for debugging)
HEADLESS=false npm test

# With specific browser
BROWSER=firefox HEADLESS=false npm test
```

### Advanced Options

```bash
# Run specific feature file
npx cucumber-js features/authentication/login.feature

# Run scenarios with specific tag
npx cucumber-js --tags "@QASE_2"

# Run with custom format
npx cucumber-js --format json:report.json
```

---

## Writing Tests

### Feature File Structure

**File**: `features/authentication/login.feature`

```gherkin
Feature: User Authentication

  Background:
    Given user navigates to "https://app.example.com/login"

  @QASE_2
  Scenario: Successful login with valid credentials
    When user enters the following credentials:
      | username | testuser        |
      | password | Test12345!@Test |
    And user clicks on the "Davam et" button
    Then user should be redirected to dashboard

  @QASE_3
  Scenario: Login fails with invalid credentials
    When user enters the following credentials:
      | username | invaliduser      |
      | password | Wrong123        |
    And user clicks on the "Davam et" button
    Then user should see error message "Authentication failed"
```

---

## Qase Integration

### Setup

1. **Get API Credentials** from Qase.io dashboard
2. **Configure Environment Variables**:

```bash
QASE_API_TOKEN=your_token_here
QASE_PROJECT_CODE=your_project
QASE_API_BASE_URL=https://api.qase.io/v1
```

3. **Tag Scenarios** with Qase case IDs:

```gherkin
@QASE_2
Scenario: Successful login
  # test steps
```

### How It Works

```
Test Execution Flow with Qase:

1. BeforeAll Hook
   └─> Create test run in Qase

2. Execute Scenarios
   ├─> Extract @QASE_X tag
   └─> Store result (passed/failed/skipped)

3. AfterAll Hook
   ├─> Send all results to Qase
   └─> Complete test run
```

### Test Run Lifecycle

| Hook        | Action                  | Qase API                             |
| ----------- | ----------------------- | ------------------------------------ |
| `BeforeAll` | Create test run         | `POST /run`                          |
| `After`     | Collect result          | Store in memory                      |
| `AfterAll`  | Send results & complete | `POST /result`, `POST /run/complete` |

---

## Reporting

### Cucumber HTML Report

**Location**: `cucumber-report.html`

```bash
# Generated automatically after test execution
npm test

# View report
open cucumber-report.html
```

### Allure Reports

**Generate & View**:

```bash
# Generate Allure report from results
npm run report:generate

# Open Allure report in browser
npm run report:open

# Or both in one command
npm run report
```

**Report Contents**:

- Test execution timeline
- Pass/fail statistics
- Test duration metrics
- Failure screenshots
- Test categorization
- Historical trends

### Test Artifacts

| Artifact       | Location                  | When Created    |
| -------------- | ------------------------- | --------------- |
| Screenshots    | `reports/screenshots/`    | On test failure |
| Videos         | `reports/videos/`         | On test failure |
| Allure Results | `reports/allure-results/` | Every test run  |
| Cucumber HTML  | `cucumber-report.html`    | Every test run  |

---

## Best Practices

### 1. Page Object Design

```typescript
//  GOOD - Clear, focused page objects
export class LoginPage extends BasePage {
  private readonly usernameField = () => this.findInputField("username");

  async login(user: string, pass: string) {
    await this.enterUsername(user);
    await this.enterPassword(pass);
  }
}

//  BAD - Magic strings and no encapsulation
async test() {
  await page.fill("#username", "user");
  await page.fill("#password", "pass");
}
```

### 2. Wait Strategy

```typescript
//  GOOD - Explicit waits with timeouts
await element.waitFor({ state: "visible", timeout: 10000 });
await element.click();

//  BAD - No waits or arbitrary sleeps
await page.waitForTimeout(3000); // Don't do this
await element.click();
```

### 3. Locator Strategy

```typescript
//  GOOD - Multiple fallback strategies
protected findElement(id: string): Locator {
  return this.page.getByRole('button', { name: id })
    .or(this.page.getByText(id))
    .or(this.page.locator(id));
}

//  BAD - Fragile CSS selectors only
await page.locator('div > div > button.btn-primary').click();
```

### 4. Test Data Management

```typescript
//  GOOD - Data-driven with tables
Scenario: Login with multiple users
  When user logs in with:
    | username | password   |
    | user1    | Pass123!   |
    | user2    | Pass456!   |

//  BAD - Hardcoded in steps
await loginPage.login("hardcoded@test.com", "hardcoded123");
```

### 5. Error Handling

```typescript
//  GOOD - Graceful degradation
try {
  await this.page.screenshot({ fullPage: true, timeout: 3000 });
} catch (err) {
  console.warn("Screenshot failed:", err);
  // Continue execution
}

//  BAD - Unhandled failures
await this.page.screenshot({ fullPage: true }); // Could crash entire test
```

---

## Troubleshooting

### Common Issues

| Issue                        | Solution                                            |
| ---------------------------- | --------------------------------------------------- |
| **Tests timeout**            | Increase timeout in `.env`: `DEFAULT_TIMEOUT=30000` |
| **Browser not launching**    | Run `npx playwright install`                        |
| **Qase results not showing** | Verify `@QASE_X` tags and API credentials           |
| **TypeScript errors**        | Run `npm install` and restart IDE                   |
| **Element not found**        | Check locator strategy in Page Object               |

### Debug Mode

```bash
# Run with headed browser and slow motion
HEADLESS=false npm test

# Enable Playwright debug mode
DEBUG=pw:api npm test

# Verbose Cucumber output
npm test -- --format progress
```

---

## Policies & Principles

### Code Quality Standards

| Principle       | Implementation                                           |
| --------------- | -------------------------------------------------------- |
| **DRY**         | Common logic in BasePage, reusable steps in BaseSteps    |
| **SOLID**       | Each class has single responsibility, open for extension |
| **KISS**        | Simple, readable code over complex abstractions          |
| **Type Safety** | Strict TypeScript mode, explicit return types            |

### Testing Policies

1. **Every scenario must have `@QASE_X` tag** for traceability
2. **Page objects encapsulate all locators** - no selectors in steps
3. **Generic steps in BaseSteps**, specific steps in domain files
4. **Explicit waits over sleep** - never use `waitForTimeout` without good reason
5. **Screenshots on failure only** - keep artifacts manageable

### Naming Conventions

```
Pages:        {PageName}Page.ts        (e.g., LoginPage.ts)
Steps:        {Domain}Steps.ts         (e.g., AuthenticationSteps.ts)
Features:     {feature-name}.feature   (e.g., login.feature)
Methods:      Descriptive verb phrases (e.g., enterUsername, verifyLoginSuccess)
Variables:    camelCase                (e.g., loginButton, usernameField)
```

---

## Contributing

1. Follow existing code structure and patterns
2. Write meaningful commit messages
3. Add tests for new features
4. Update documentation when changing functionality
5. Run `npm test` before committing

---

## License

All rights reserved
---


**Built with ❤️ using Playwright + Cucumber + TypeScript 😊**

