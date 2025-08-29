import asyncio
from playwright.async_api import async_playwright, expect
import os
import re

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Get the absolute path to the index.html file
        file_path = os.path.abspath('index.html')

        # 1. Navigate to the homepage
        await page.goto(f'file://{file_path}')

        # 2. Take a screenshot of the homepage
        await page.screenshot(path="jules-scratch/verification/01_homepage.png")

        # 3. Navigate to the calculator
        await page.get_by_role("link", name="Calculatrice").click()

        # Wait for calculator to be visible
        await expect(page.locator("#calculator")).to_be_visible()

        # 4. Perform a simple calculation: 12 + 34 = 46
        await page.get_by_role("button", name=re.compile("^1$")).click()
        await page.get_by_role("button", name=re.compile("^2$")).click()
        await page.get_by_role("button", name="+" , exact=True).click()
        await page.get_by_role("button", name=re.compile("^3$")).click()
        await page.get_by_role("button", name=re.compile("^4$")).click()
        await page.get_by_role("button", name="=").click()

        # 5. Assert the result is correct
        await expect(page.locator("#display")).to_have_value("46")

        # 6. Take a screenshot of the calculator
        await page.screenshot(path="jules-scratch/verification/02_calculator.png")

        # 7. Navigate to settings, change to dark mode
        await page.get_by_role("link", name="Réglages").click()
        await expect(page.locator("#settings")).to_be_visible()

        # Corrected locator for the theme select dropdown
        await page.locator("#themeSelect").select_option("dark")

        # Assert that the theme has been applied
        await expect(page.locator("body")).to_have_class(re.compile(r"dark-theme"))

        # 8. Take a screenshot of the settings page in dark mode
        await page.screenshot(path="jules-scratch/verification/03_settings_dark.png")

        await browser.close()

asyncio.run(main())
