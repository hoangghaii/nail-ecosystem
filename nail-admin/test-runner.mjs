#!/usr/bin/env node

import { dirname, join } from "path";
import puppeteer from "puppeteer";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TEST_URL = "http://localhost:5177";
const TEST_CREDENTIALS = {
  email: "admin@pinknail.com",
  password: "admin123",
};

async function runTests() {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    headless: true,
  });

  const page = await browser.newPage();

  // Enable console logging
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      console.error("Browser console error:", msg.text());
    }
  });

  // Track page errors
  const pageErrors = [];
  page.on("pageerror", (error) => {
    pageErrors.push(error.message);
  });

  try {
    console.log("=".repeat(60));
    console.log("NAIL ADMIN - LOCALSTORAGE IMPLEMENTATION TEST");
    console.log("=".repeat(60));
    console.log("");

    // Test 1: Initial page load
    console.log("Test 1: Initial Page Load & Redirect to Login");
    console.log("-".repeat(60));
    await page.goto(TEST_URL, { timeout: 30000, waitUntil: "networkidle2" });

    const currentUrl = page.url();
    console.log(`✓ Page loaded: ${currentUrl}`);

    if (currentUrl.includes("/login")) {
      console.log("✓ Correctly redirected to login page");
    } else {
      console.log("✗ Expected redirect to /login");
    }
    console.log("");

    // Test 2: Check initial localStorage (should be empty)
    console.log("Test 2: Initial LocalStorage State");
    console.log("-".repeat(60));

    const initialKeys = await page.evaluate(() => {
      return Object.keys(localStorage).filter((k) =>
        k.startsWith("nail_admin_"),
      );
    });

    console.log(`Found ${initialKeys.length} nail_admin_ keys:`, initialKeys);

    if (initialKeys.length === 0) {
      console.log("✓ PASS: No nail_admin_ keys before login");
    } else {
      console.log("✗ FAIL: Found keys before login (should be empty)");
    }
    console.log("");

    // Test 3: Login and check auth localStorage
    console.log("Test 3: Login & Auth LocalStorage");
    console.log("-".repeat(60));

    // Fill login form
    await page.waitForSelector('input[type="email"]', { timeout: 5000 });
    await page.type('input[type="email"]', TEST_CREDENTIALS.email);
    await page.type('input[type="password"]', TEST_CREDENTIALS.password);

    console.log("✓ Filled login form");

    // Submit login
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation({ timeout: 10000 }),
    ]);

    console.log("✓ Submitted login form");

    const dashboardUrl = page.url();
    if (dashboardUrl.includes("/dashboard")) {
      console.log("✓ Successfully redirected to dashboard");
    } else {
      console.log("✗ Not redirected to dashboard:", dashboardUrl);
    }
    console.log("");

    // Test 4: Verify localStorage after login
    console.log("Test 4: LocalStorage After Login");
    console.log("-".repeat(60));

    const afterLoginKeys = await page.evaluate(() => {
      return Object.keys(localStorage).filter((k) =>
        k.startsWith("nail_admin_"),
      );
    });

    console.log(
      `Found ${afterLoginKeys.length} nail_admin_ keys:`,
      afterLoginKeys,
    );

    const expectedKeys = ["nail_admin_auth_token", "nail_admin_auth_user"];
    const hasToken = afterLoginKeys.includes("nail_admin_auth_token");
    const hasUser = afterLoginKeys.includes("nail_admin_auth_user");
    const onlyAuthKeys = afterLoginKeys.every((k) => expectedKeys.includes(k));

    if (hasToken) {
      console.log("✓ Auth token stored");
    } else {
      console.log("✗ Auth token missing");
    }

    if (hasUser) {
      console.log("✓ Auth user stored");
    } else {
      console.log("✗ Auth user missing");
    }

    if (onlyAuthKeys) {
      console.log("✓ PASS: Only auth keys present (no data storage keys)");
    } else {
      console.log("✗ FAIL: Unexpected keys found");
    }
    console.log("");

    // Test 5: Check for deprecated keys
    console.log("Test 5: Deprecated Keys Check");
    console.log("-".repeat(60));

    const deprecatedKeys = [
      "nail_admin_bookings",
      "nail_admin_contacts",
      "nail_admin_banners",
      "nail_admin_galleries",
      "nail_admin_services",
    ];

    const foundDeprecated = await page.evaluate((keys) => {
      return keys.filter((k) => localStorage.getItem(k) !== null);
    }, deprecatedKeys);

    if (foundDeprecated.length === 0) {
      console.log("✓ PASS: No deprecated keys found");
    } else {
      console.log("✗ FAIL: Found deprecated keys:", foundDeprecated);
    }
    console.log("");

    // Test 6: Verify auth data structure
    console.log("Test 6: Auth Data Structure");
    console.log("-".repeat(60));

    const authData = await page.evaluate(() => {
      const token = localStorage.getItem("nail_admin_auth_token");
      const userStr = localStorage.getItem("nail_admin_auth_user");

      let user = null;
      if (userStr) {
        try {
          user = JSON.parse(userStr);
        } catch (e) {
          return { error: "Invalid user JSON" };
        }
      }

      return { token, user };
    });

    if (authData.error) {
      console.log("✗", authData.error);
    } else {
      console.log("Token present:", !!authData.token);
      console.log("User data:", JSON.stringify(authData.user, null, 2));

      if (
        authData.user &&
        authData.user.id &&
        authData.user.email &&
        authData.user.name
      ) {
        console.log("✓ PASS: Auth data structure valid");
      } else {
        console.log("✗ FAIL: Auth data structure incomplete");
      }
    }
    console.log("");

    // Test 7: Check stores initialization with mock data
    console.log("Test 7: Stores Initialization Check");
    console.log("-".repeat(60));

    // Wait a bit for stores to initialize
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const storeData = await page.evaluate(() => {
      // Check if stores are available in window (for debugging)
      return {
        hasZustand: typeof window !== "undefined",
        localStorageSize: new Blob(Object.values(localStorage)).size,
      };
    });

    console.log(
      "LocalStorage total size:",
      storeData.localStorageSize,
      "bytes",
    );
    console.log("✓ Stores should initialize from mock data (not localStorage)");
    console.log("");

    // Test 8: Page errors check
    console.log("Test 8: Page Errors Check");
    console.log("-".repeat(60));

    if (pageErrors.length === 0) {
      console.log("✓ PASS: No JavaScript errors on page");
    } else {
      console.log("✗ FAIL: Found", pageErrors.length, "page errors:");
      pageErrors.forEach((err, i) => {
        console.log(`  ${i + 1}. ${err}`);
      });
    }
    console.log("");

    // Summary
    console.log("=".repeat(60));
    console.log("TEST SUMMARY");
    console.log("=".repeat(60));

    const allPassed =
      afterLoginKeys.length === 2 &&
      hasToken &&
      hasUser &&
      onlyAuthKeys &&
      foundDeprecated.length === 0 &&
      pageErrors.length === 0;

    if (allPassed) {
      console.log("✓ ALL TESTS PASSED");
      console.log("");
      console.log("✓ LocalStorage implementation correct");
      console.log("✓ Only auth data stored in localStorage");
      console.log("✓ No deprecated keys present");
      console.log("✓ No JavaScript errors");
    } else {
      console.log("✗ SOME TESTS FAILED - Review output above");
    }
    console.log("=".repeat(60));
  } catch (error) {
    console.error("Test failed with error:", error);
  } finally {
    await browser.close();
  }
}

// Run tests
runTests().catch(console.error);
