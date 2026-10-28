import { expect, test } from "@playwright/test";

test("staff login redirects to the AI chat workspace", async ({ page }) => {
  let authenticated = false;

  await page.route("http://localhost:5000/api/**", async (route) => {
    const path = new URL(route.request().url()).pathname;

    if (path === "/api/auth/me") {
      await route.fulfill({
        status: authenticated ? 200 : 401,
        contentType: "application/json",
        body: JSON.stringify(
          authenticated
            ? {
                success: true,
                staff: {
                  id: "staff-test",
                  firstName: "Test",
                  lastName: "Staff",
                  email: "test@example.com",
                  role: "staff",
                  status: "active",
                },
                club: {
                  clubId: "club-test",
                  title: "Test Club",
                  phone: null,
                  status: "active",
                },
              }
            : { success: false, message: "Unauthorized" },
        ),
      });
      return;
    }

    if (path === "/api/auth/login") {
      authenticated = true;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          message: "Signed in",
          staff: {
            id: "staff-test",
            firstName: "Test",
            lastName: "Staff",
            email: "test@example.com",
            role: "staff",
            status: "active",
          },
          club: {
            clubId: "club-test",
            title: "Test Club",
            phone: null,
            status: "active",
          },
        }),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true }),
    });
  });

  await page.goto("/login");
  await page.getByLabel("Club ID").fill("club-test");
  await page.getByLabel("Email address").fill("test@example.com");
  await page.getByLabel("Password").fill("test-password");
  await page.getByRole("button", { name: /sign in/i }).click();

  await expect(page).toHaveURL(/\/ai-chat$/);
  await expect(
    page.getByRole("heading", {
      name: "How can I assist your club today?",
    }),
  ).toBeVisible();
});

test("invalid staff login remains on the login page", async ({ page }) => {
  await page.route("http://localhost:5000/api/**", async (route) => {
    const path = new URL(route.request().url()).pathname;

    if (path === "/api/auth/me" || path === "/api/auth/login") {
      await route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({ success: false, message: "Invalid credentials" }),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true }),
    });
  });

  await page.goto("/login");
  await page.getByLabel("Club ID").fill("club-test");
  await page.getByLabel("Email address").fill("invalid@example.com");
  await page.getByLabel("Password").fill("invalid-password");
  await page.getByRole("button", { name: /sign in/i }).click();

  await expect(page).toHaveURL(/\/login$/);
  await expect(
    page.getByRole("heading", { name: "Staff Login" }),
  ).toBeVisible();
});