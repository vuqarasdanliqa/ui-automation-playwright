Feature: User Authentication

  Background:
    * user navigates to "https://cb.abb-bank.az/login/az/otp"

  @QASE_2
  Scenario: Successful login with valid credentials
    When user enters the following credentials:
      | username | testuser        |
      | password | Test12345!@Test |
    And user clicks on the "Daxil ol" button
    Then user should be redirected to dashboard

  @QASE_3
  Scenario: Login fails with invalid credentials
    When user enters the following credentials:
      | username | invaliduser      |
      | password | Test12345!@Wrong |
    And user clicks on the "Daxil ol" button
    Then user should see error message "İstifadəçi eyniləşdirməsi uğursuzdur"
