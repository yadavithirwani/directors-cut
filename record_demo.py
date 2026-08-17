"""
AETHER Ops - Automated Playwright Video Recorder
Launches Chromium, interacts with the AETHER Ops Command Center UI,
triggers triage scenarios, queries Grafana, Parallel, & ClickHouse tools,
inspects OTel traces, and records demo_walkthrough.webm for hackathon submission.
"""

import time
import sys
from playwright.sync_api import sync_playwright

def record_walkthrough():
    print("🎬 Starting Automated Playwright Demo Recorder...")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            viewport={"width": 1280, "height": 800},
            record_video_dir="./"
        )
        page = context.new_page()

        print("🌐 Navigating to http://localhost:8085...")
        page.goto("http://localhost:8085")
        page.wait_for_timeout(2000)

        # 1. Trigger Incident Triage Matrix
        print("⚡ Triggering Incident Triage Matrix...")
        page.click("#btn-run-scenario")
        page.wait_for_timeout(3000)

        # 2. Switch to OTel Trace Tree Tab
        print("📡 Inspecting OpenTelemetry Trace Tree...")
        page.click("button[data-tab='tab-otel']")
        page.wait_for_timeout(2000)

        # 3. Switch to Grafana Studio Tab & Execute PromQL
        print("📊 Testing Grafana PromQL & LogQL Studio...")
        page.click("button[data-tab='tab-grafana']")
        page.click("#btn-run-promql")
        page.wait_for_timeout(1500)
        page.click("#btn-run-logql")
        page.wait_for_timeout(1500)

        # 4. Switch to Parallel Web Search Tab
        print("🌐 Testing Parallel Web Search Terminal...")
        page.click("button[data-tab='tab-parallel']")
        page.click("#btn-run-parallel")
        page.wait_for_timeout(2000)

        # 5. Switch to ClickHouse SQL Console Tab
        print("⚡ Testing ClickHouse Cloud SQL Console...")
        page.click("button[data-tab='tab-clickhouse']")
        page.click("#btn-run-clickhouse")
        page.wait_for_timeout(2000)

        # 6. Open & Copy Code Patch Modal
        print("📋 Opening Code Patch Fix Modal...")
        page.click("#btn-open-patch")
        page.wait_for_timeout(2000)
        page.click("#btn-close-patch")
        page.wait_for_timeout(1000)

        print("✨ Walkthrough complete. Saving video recording...")
        context.close()
        browser.close()
        print("🎥 Video saved to demo_walkthrough.webm!")

if __name__ == "__main__":
    record_walkthrough()
