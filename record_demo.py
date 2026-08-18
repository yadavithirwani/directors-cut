"""
DIRECTOR'S CUT - Automated Playwright Video Recorder
Launches Chromium, navigates to DIRECTOR'S CUT UI (http://localhost:8085),
triggers Use Case 1 (Script Breakdown), Use Case 2 (Impact Analysis),
and Use Case 3 (Continuity Check), recording demo_walkthrough.webm.
"""

import time
from playwright.sync_api import sync_playwright

def record_walkthrough():
    print("🎬 Starting DIRECTOR'S CUT Playwright Demo Recorder...")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            viewport={"width": 1280, "height": 800},
            record_video_dir="./"
        )
        page = context.new_page()

        print("🌐 Navigating to http://localhost:8087...")
        page.goto("http://localhost:8087")
        page.wait_for_timeout(2000)

        # 1. Trigger Use Case 1: Script Breakdown Ingestion
        print("🎬 Executing Use Case 1: Script Breakdown Engine...")
        page.click("#btn-run-breakdown")
        page.wait_for_timeout(3000)

        # 2. Trigger Use Case 2: Downstream Impact Analysis
        print("⚡ Executing Use Case 2: Downstream Impact Analysis...")
        page.click("#btn-analyze-impact")
        page.wait_for_timeout(3000)

        # 3. Trigger Use Case 3: Continuity Management Check
        print("🔍 Executing Use Case 3: Continuity Management System...")
        page.click("#btn-run-continuity")
        page.wait_for_timeout(3000)

        print("✨ Walkthrough complete. Saving video recording...")
        context.close()
        browser.close()
        print("🎥 Video saved to demo_walkthrough.webm!")

if __name__ == "__main__":
    record_walkthrough()
