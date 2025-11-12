import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

test('Facebook Login and Post Text with Image', async ({ page }) => {
  await page.goto('https://www.facebook.com/');

  await page.fill('input[name="email"]', process.env.FB_EMAIL);
  await page.fill('input[name="pass"]', process.env.FB_PASS);
  await page.click('button[name="login"]');

  await page.waitForSelector('[aria-label="Create a post"]', { timeout: 30000 });

  const createPostButton = page.locator('[aria-label="Create a post"]');
  await createPostButton.click();

  const postBox = page.locator('div[role="textbox"]');
  await postBox.waitFor({ state: 'visible', timeout: 30000 });

  const postText =
    'Hello my name is Sugrit Areyawerot, you can call me Mark — I love ElysianNxt 💜 (Posted via Playwright with image)';

  await postBox.click();
  await page.keyboard.type(postText);
  await page.waitForTimeout(1000);

  const fileInput = page.locator('input[type="file"]');
  const imagePath = path.resolve('./assets/photo.jpg');
  await fileInput.setInputFiles(imagePath);

  await page.waitForSelector('img[alt="Image may contain"]', { timeout: 20000 });

  const postButton = page.locator('div[aria-label="Post"]');
  await postButton.click();

  for (let i = 0; i < 5; i++) {
    const visible = await page.locator(`text=${postText}`).isVisible();
    if (visible) break;
    await page.waitForTimeout(3000);
  }

  await expect(page.locator(`text=${postText}`)).toBeVisible({ timeout: 15000 });
});
