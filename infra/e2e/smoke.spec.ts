import { test, expect } from "@playwright/test";

const admin = { username: "admin@example.com", password: "secret" };

test("Login logout flow", async ({ page }) => {
  await page.goto("/");

  // Login
  await expect(page.getByRole("heading", { name: "raok" })).toBeVisible();
  await page.getByLabel("Admin username").fill(admin.username);
  await page.getByLabel("Admin password").fill(admin.password);
  await page.getByRole("button", { name: "Login" }).click();

  // Look around
  await expect(page.getByText(admin.username)).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Articles", exact: true })
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Newspaper creator" })
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Send file" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Stats" })).toBeVisible();

  // Logout
  await page.getByRole("link", { name: "Logout" }).click();

  // Look around again
  await expect(page.getByRole("heading", { name: "raok" })).toBeVisible();
  await expect(page.getByLabel("Admin username")).toBeVisible();
  await expect(page.getByLabel("Admin password")).toBeVisible();
});
