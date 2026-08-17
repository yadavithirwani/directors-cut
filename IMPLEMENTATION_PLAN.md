# 🗺️ Implementation Plan: DIRECTOR'S CUT

**Project Name:** DIRECTOR'S CUT (The Autonomous Hollywood Operations Agent)  
**Core Framework:** Google ADK (Python) + ClickHouse Cloud  

---

## 📅 Roadmap & Milestones

### Phase 1: ClickHouse Relational Breakdown Engine (Use Case 1)
- [x] Define ClickHouse MergeTree tables (`script_scenes`, `scene_characters`, `scene_props`).
- [x] Ingest sample 5-page Hollywood screenplay (`sample_screenplay.txt`).
- [x] Parse unstructured text into relational JSON breakdown entities.
- [x] Populate ClickHouse database with Master Breakdown event log.

### Phase 2: Google ADK Multi-Agent Orchestration Engine
- [x] Initialize Google ADK `LineProducerAgent` (Root).
- [x] Implement `BreakdownSubAgent` for script ingestion.
- [x] Implement `ImpactAnalysisSubAgent` for downstream script edit diffs.
- [x] Implement `ContinuitySubAgent` for prop & actor state timeline checks.

### Phase 3: Downstream Impact & Continuity Engines (Use Cases 2 & 3)
- [x] Implement script edit diff calculator ("Move Scene 12 from Apartment to Warehouse").
- [x] Query ClickHouse for budget & schedule delta calculations.
- [x] Execute prop continuity SQL query checks (`SELECT prop_state FROM scene_props WHERE scene_number < 13 AND character_holding = 'Sarah'`).
- [x] Flag continuity anomalies and generate actionable alerts.

### Phase 4: UI Command Center & Demo Video Recorder
- [x] Build dark Hollywood glassmorphism UI (`index.html`, `styles.css`, `app.js`).
- [x] Connect REST API server (`server.py`).
- [x] Create automated Playwright demo video script (`record_demo.py`).
- [x] Generate `demo_walkthrough.webm` for hackathon submission.
