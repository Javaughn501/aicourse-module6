import { expect, test, type Page } from '@playwright/test'

async function openRegistration(page: Page) {
  await page.goto('/#registration-demo')
  await expect(page.getByTestId('registration-form')).toBeVisible()
}

const validAccount = {
  email: 'test.user@example.com',
  password: 'securePass1',
}
const validProfile = {
  firstName: 'Taylor',
  lastName: 'Nguyen',
}

test.describe('Multi-step registration', () => {
  test('field validation: required fields on step 1', async ({ page }) => {
    await openRegistration(page)

    await page.getByTestId('registration-next').click()

    await expect(page.getByTestId('registration-field-error-email')).toBeVisible()
    await expect(page.getByTestId('registration-field-error-email')).toContainText(/required/i)
    await expect(page.getByTestId('registration-field-error-password')).toBeVisible()
    await expect(page.getByTestId('registration-field-error-password')).toContainText(/required/i)

    await expect(page.getByTestId('reg-email')).toHaveAttribute('aria-invalid', 'true')
    await expect(page.getByTestId('reg-password')).toHaveAttribute('aria-invalid', 'true')
  })

  test('field validation: email format', async ({ page }) => {
    await openRegistration(page)

    await page.getByTestId('reg-email').fill('not-an-email')
    await page.getByTestId('reg-password').fill(validAccount.password)
    await page.getByTestId('registration-next').click()

    await expect(page.getByTestId('registration-field-error-email')).toContainText(/valid email/i)
    await expect(page.getByTestId('reg-email')).toHaveAttribute('aria-invalid', 'true')
  })

  test('field validation: password length and format', async ({ page }) => {
    await openRegistration(page)

    await page.getByTestId('reg-email').fill(validAccount.email)

    await page.getByTestId('reg-password').fill('short')
    await page.getByTestId('registration-next').click()
    await expect(page.getByTestId('registration-field-error-password')).toContainText(/at least 8/i)

    await page.getByTestId('reg-password').fill('allletters!')
    await page.getByTestId('registration-next').click()
    await expect(page.getByTestId('registration-field-error-password')).toContainText(/number/i)

    await page.getByTestId('reg-password').fill('12345678')
    await page.getByTestId('registration-next').click()
    await expect(page.getByTestId('registration-field-error-password')).toContainText(/letter/i)
  })

  test('step navigation: next and previous preserve data', async ({ page }) => {
    await openRegistration(page)

    await page.getByTestId('reg-email').fill(validAccount.email)
    await page.getByTestId('reg-password').fill(validAccount.password)
    await page.getByTestId('registration-next').click()

    await expect(page.getByTestId('reg-first-name')).toBeVisible()
    await expect(page.getByTestId('registration-back')).toBeVisible()

    await page.getByTestId('registration-back').click()

    await expect(page.getByTestId('reg-email')).toHaveValue(validAccount.email)
    await expect(page.getByTestId('reg-password')).toHaveValue(validAccount.password)
  })

  test('field validation: profile name length on step 2', async ({ page }) => {
    await openRegistration(page)

    await page.getByTestId('reg-email').fill(validAccount.email)
    await page.getByTestId('reg-password').fill(validAccount.password)
    await page.getByTestId('registration-next').click()

    await page.getByTestId('reg-first-name').fill('A')
    await page.getByTestId('reg-last-name').fill('B')
    await page.getByTestId('registration-next').click()

    await expect(page.getByTestId('registration-field-error-firstName')).toContainText(/at least 2/i)
    await expect(page.getByTestId('registration-field-error-lastName')).toContainText(/at least 2/i)
  })

  test('form submission: success state', async ({ page }) => {
    await openRegistration(page)

    await page.getByTestId('reg-email').fill(validAccount.email)
    await page.getByTestId('reg-password').fill(validAccount.password)
    await page.getByTestId('registration-next').click()

    await page.getByTestId('reg-first-name').fill(validProfile.firstName)
    await page.getByTestId('reg-last-name').fill(validProfile.lastName)
    await page.getByTestId('registration-next').click()

    await expect(page.getByTestId('registration-summary')).toContainText(validAccount.email)
    await page.getByTestId('registration-submit').click()

    await expect(page.getByTestId('registration-success')).toBeVisible()
    await expect(page.getByTestId('registration-success')).toContainText(/You are registered/i)
    await expect(page.getByTestId('registration-success')).toContainText(validProfile.firstName)
  })

  test('form submission: simulated server error', async ({ page }) => {
    await page.goto('/?simulateRegistrationError=1#registration-demo')
    await expect(page.getByTestId('registration-form')).toBeVisible()

    await page.getByTestId('reg-email').fill(validAccount.email)
    await page.getByTestId('reg-password').fill(validAccount.password)
    await page.getByTestId('registration-next').click()

    await page.getByTestId('reg-first-name').fill(validProfile.firstName)
    await page.getByTestId('reg-last-name').fill(validProfile.lastName)
    await page.getByTestId('registration-next').click()

    await page.getByTestId('registration-submit').click()

    await expect(page.getByTestId('registration-submit-error')).toBeVisible()
    await expect(page.getByTestId('registration-submit-error')).toContainText(/could not be completed/i)
    await expect(page.getByTestId('registration-submit-error')).toHaveAttribute('role', 'alert')
    await expect(page.getByTestId('registration-success')).toHaveCount(0)
  })
})

test.describe('Registration accessibility', () => {
  test('inputs are labeled and errors connect via aria-describedby', async ({ page }) => {
    await openRegistration(page)

    await expect(page.getByLabel(/^email$/i)).toBeVisible()
    await expect(page.getByLabel(/^password$/i)).toBeVisible()

    await page.getByTestId('registration-next').click()

    const describedBy = await page.getByTestId('reg-email').getAttribute('aria-describedby')
    expect(describedBy).toBeTruthy()
    await expect(page.locator(`#${describedBy}`)).toContainText(/required/i)

    await page.getByTestId('reg-email').fill('a@b.co')
    await page.getByTestId('reg-password').fill(validAccount.password)
    await page.getByTestId('registration-next').click()

    await expect(page.getByRole('textbox', { name: /^first name$/i })).toBeVisible()
    await expect(page.getByRole('textbox', { name: /^last name$/i })).toBeVisible()
  })

  test('step progress nav has accessible name', async ({ page }) => {
    await openRegistration(page)

    await expect(page.getByRole('navigation', { name: /registration progress/i })).toBeVisible()
    await expect(page.getByRole('navigation', { name: /registration progress/i }).getByText('Account')).toBeVisible()
  })

  test('status region announces step context', async ({ page }) => {
    await openRegistration(page)

    await expect(page.getByTestId('registration-step-status')).toContainText(/step 1 of 3/i)
    await expect(page.getByTestId('registration-step-status')).toContainText(/account/i)

    await page.getByTestId('reg-email').fill(validAccount.email)
    await page.getByTestId('reg-password').fill(validAccount.password)
    await page.getByTestId('registration-next').click()

    await expect(page.getByTestId('registration-step-status')).toContainText(/step 2 of 3/i)
    await expect(page.getByTestId('registration-step-status')).toContainText(/profile/i)
  })
})
