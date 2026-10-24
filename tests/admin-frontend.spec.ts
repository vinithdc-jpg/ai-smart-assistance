import { expect, test, type Page } from "@playwright/test";

const admin = {
  id: "admin-1",
  email: "admin@example.com",
  name: "Test Administrator",
  role: "super_admin",
};

async function mockAdminApi(page: Page, initiallyAuthenticated = false) {
  let authenticated = initiallyAuthenticated;
  const clubs = [
    {
      clubId: "club-test",
      title: "Test Club",
      phone: "9876543210",
      status: "active",
    },
  ];

  await page.route("http://localhost:5000/**", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const path = url.pathname;
    let status = 200;
    let body: unknown = { success: true };

    if (path.endsWith("/AdminAuth/adminMe")) {
      status = authenticated ? 200 : 401;
      body = authenticated
        ? { success: true, admin }
        : { success: false, message: "Unauthorized" };
    } else if (path.endsWith("/AdminAuth/adminLogin")) {
      authenticated = true;
      body = { success: true, message: "Signed in", admin };
    } else if (path.endsWith("/AdminAuth/adminLogout")) {
      authenticated = false;
    } else if (path.endsWith("/club/statistics")) {
      body = {
        success: true,
        data: { totalClubs: 1, activeClubs: 1, inactiveClubs: 0, totalStaff: 1 },
      };
    } else if (path.endsWith("/club/getclub")) {
      body = {
        success: true,
        count: clubs.length,
        page: 1,
        limit: 10,
        totalPages: 1,
        clubs,
      };
    } else if (path.endsWith("/staff/getAllStaff")) {
      body = {
        success: true,
        count: 0,
        page: 1,
        limit: 10,
        totalPages: 1,
        staff: [],
      };
    } else if (path.endsWith("/members")) {
      body = {
        success: true,
        count: 0,
        page: 1,
        limit: 10,
        totalPages: 1,
        members: [],
      };
    } else if (path.endsWith("/transactions")) {
      body = {
        success: true,
        count: 0,
        page: 1,
        limit: 10,
        totalPages: 1,
        transactions: [],
      };
    } else if (path.endsWith("/settings/gst")) {
      body = { success: true, gstRate: 18 };
      if (request.method() === "PATCH") {
        const payload = request.postDataJSON() as { gstRate: number };
        body = { success: true, gstRate: payload.gstRate };
      }
    } else if (path.endsWith("/reports/stats")) {
      body = {
        success: true,
        data: {
          totalRevenue: 0,
          totalReceived: 0,
          totalPending: 0,
          totalMembers: 0,
          totalClubs: 1,
          activeStaff: 0,
          chart: [],
        },
      };
    } else if (
      path.endsWith("/reports/staff-performance") ||
      path.endsWith("/reports/transaction-records")
    ) {
      body = {
        success: true,
        data: [],
        pagination: { total: 0, page: 1, limit: 10, totalPages: 1 },
      };
    } else if (path.endsWith("/reports/staff-options")) {
      body = { success: true, data: [] };
    } else if (path.endsWith("/reports/payment-status")) {
      body = { success: true, data: [] };
    }

    await route.fulfill({
      status,
      contentType: "application/json",
      body: JSON.stringify(body),
    });
  });
}

async function signInAsAdmin(page: Page) {
  await page.goto("/Admin/login");
  await page.locator('input[name="email"]').fill("admin@example.com");
  await page.getByLabel("Master Passkey").fill("test-password");
  await page.getByRole("button", { name: /sign in to ledger console/i }).click();
  await expect(page).toHaveURL(/\/Admin\/dashboard$/);
}

test.describe("Admin frontend", () => {
  test("protects the dashboard and redirects unauthenticated users to admin login", async ({
    page,
  }) => {
    await mockAdminApi(page);

    await page.goto("/Admin/dashboard");

    await expect(page).toHaveURL(/\/Admin\/login\?from=/);
    await expect(
      page.getByRole("heading", { name: "Welcome back, Administrator" }),
    ).toBeVisible();
  });

  test("signs in and renders every admin dashboard section", async ({ page }) => {
    await mockAdminApi(page);
    await signInAsAdmin(page);

    await expect(page.getByText("Total Clubs")).toBeVisible();

    await page.getByRole("button", { name: /clubs/i }).click();
    await expect(
      page.getByRole("heading", { name: "Club Directory" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Add Club" }).click();
    await expect(
      page.getByRole("heading", { name: "Create New Club" }),
    ).toBeVisible();
    await page
      .locator("#admin-club-edit-form")
      .getByRole("button", { name: "Cancel" })
      .first()
      .click();

    await page.getByRole("button", { name: /staff management/i }).click();
    await expect(
      page.getByRole("heading", { name: "Staff Management" }),
    ).toBeVisible();

    await page.getByRole("button", { name: /members/i }).click();
    await expect(
      page.getByRole("heading", { name: "Members Overview" }),
    ).toBeVisible();
    await expect(page.getByText("No members found.")).toBeVisible();

    await page.getByRole("button", { name: /transactions/i }).click();
    await expect(page.getByText("No transactions found.")).toBeVisible();

    await page.getByRole("button", { name: /report/i }).click();
    await expect(
      page.getByRole("heading", {
        name: "Financial Reports & Audit Ledger",
      }),
    ).toBeVisible();

    await page.getByRole("button", { name: /gst settings/i }).click();
    await expect(
      page.getByRole("heading", { name: "GST & Tax Configuration" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "5% GST" }).click();
    await expect(page.getByLabel("System GST Percentage (%)")).toHaveValue("5");
    await page
      .getByRole("button", { name: "Save GST Configuration" })
      .click();
    await expect(
      page.getByText("GST rate successfully updated to 5%."),
    ).toBeVisible();

    await page.getByRole("button", { name: /sign out/i }).click();
    await expect(
      page.getByText("Are you sure you want to log out of the admin dashboard?"),
    ).toBeVisible();
    await page.getByRole("button", { name: /^sign out$/i }).click();
    await expect(page).toHaveURL(/\/Admin\/login$/);
  });

  test("supports admin section navigation on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await mockAdminApi(page);
    await signInAsAdmin(page);

    await page.getByRole("button", { name: "Open navigation menu" }).click();
    const navigation = page.getByRole("navigation", {
      name: "Admin navigation",
    });
    await expect(navigation).toBeVisible();
    await navigation.getByRole("button", { name: "GST Settings" }).click();

    await expect(
      page.getByRole("heading", { name: "GST & Tax Configuration" }),
    ).toBeVisible();
    await expect(navigation).toBeHidden();
  });
});
