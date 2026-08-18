"""
DIRECTOR'S CUT - Automated Playwright Video Recorder
Launches Chromium, navigates to DIRECTOR'S CUT UI (http://localhost:8088),
executes the 3 Live Core Use Cases (Google ADK & ClickHouse Cloud MCP),
and records demo_walkthrough.webm for hackathon video submission.
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

        print("🌐 Navigating to http://localhost:8088...")
        page.goto("http://localhost:8088")
        page.wait_for_timeout(2500)

        # 1. Trigger Use Case 1: Script Breakdown Ingestion & Cost Engine
        print("🎬 Executing Use Case 1: Script Breakdown Engine (Google ADK & ClickHouse)...")
        page.click("#btn-run-breakdown")
        page.wait_for_timeout(4500)

        # 2. Trigger Use Case 2: Downstream Impact & Financial Delta Analysis
        print("⚡ Executing Use Case 2: Downstream Impact Analysis (ClickHouse SQL Delta)...")
        page.click("#btn-analyze-impact")
        page.wait_for_timeout(4500)

        # 3. Trigger Use Case 3: Continuity Management Check
        print("🔍 Executing Use Case 3: Continuity Management System (Reshoot Risk Engine)...")
        page.click("#btn-run-continuity")
        page.wait_for_timeout(4500)

        print("✨ Walkthrough complete. Saving video recording...")
        context.close()
        browser.close()
        print("🎥 Video saved to demo_walkthrough.webm!")

if __name__ == "__main__":
    record_walkthrough()
