import { test, expect } from "@playwright/test";

test("User can login", async ({ page }) => {
  await page.goto("/login");

  await page.fill('input[name="clubId"]', "club_001");
  await page.fill('input[name="email"]', "test@gmail.com");
  await page.fill('input[name="password"]', "123456");

  await page.click('button[type="submit"]');

  await expect(page).toHaveURL("/Admin/dashboard");
  
 
});