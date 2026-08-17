# 🎬 DIRECTOR'S CUT — Autonomous Hollywood Operations Agent

> **"A screenplay isn't a document. It's a database."**

[![License: MIT](https://img.shields.io/badge/License-MIT-indigo.svg)](LICENSE)
[![Google ADK](https://img.shields.io/badge/Orchestration-Google_ADK-blue.svg)](https://cloud.google.com/vertex-ai)
[![ClickHouse Engine](https://img.shields.io/badge/Data_Engine-ClickHouse-yellow.svg)](https://clickhouse.com/)

**DIRECTOR'S CUT** is an autonomous screenplay intelligence and film production operations platform built with **Google ADK (Agent Development Kit)** and **ClickHouse**.

In movie production, a single script change causes unmapped cascading delays across wardrobe, lighting, scheduling, and budget. Continuity errors alone cost studios millions in reshoots. Current workflows treat screenplays as static text. **DIRECTOR'S CUT** transforms unstructured screenplays into structured, high-speed relational event databases in ClickHouse, allowing AI agents to programmatically track downstream impact and continuity states.

---

## 🎯 The Three Core Use Cases (Strict Dependency Architecture)

The system enforces a strict 3-tier dependency architecture where Use Cases 2 and 3 rely on the foundational database created in Use Case 1:

```
┌───────────────────────────────────────────────────────────┐
│ USE CASE 1: Script Breakdown (The Foundation)             │
│ • Google ADK Ingestion Agent parses screenplay text       │
│ • Loads Master Breakdown into ClickHouse Relational Tables │
└────────────────────────────┬──────────────────────────────┘
                             │
            ┌────────────────┴────────────────┐
            ▼                                 ▼
┌───────────────────────────────┐ ┌───────────────────────────────┐
│ USE CASE 2: Impact Analysis   │ │ USE CASE 3: Continuity Mgmt   │
│ • Calculates financial/sched  │ │ • Tracks actor & prop states  │
│   delays of script edits      │ │   programmatically via SQL    │
│ • ClickHouse SQL Delta Engine │ │ • Prevents reshoot bugs       │
└───────────────────────────────┘ └───────────────────────────────┘
```

### 1. 🎬 Script Breakdown Engine (The Foundation)
Translates unstructured script text into a structured, relational event database in ClickHouse (`script_scenes`, `scene_characters`, `scene_props`).

### ⚡ 2. Downstream Impact Analysis
Calculates the logistical, financial, and scheduling ripple effects of creative changes (e.g. *"Move Scene 12 from Apartment to Industrial Warehouse"*). Sub-agents query ClickHouse to calculate cost deltas and scene count impacts.

### 🔍 3. Continuity Management System
Programmatically tracks the physical and temporal state of actors and props across scenes (`SELECT prop_state FROM scene_props WHERE scene_number < 13 AND character_holding = 'Sarah'`) to catch reshoot bugs before filming.

---

## 🛠️ Tech Stack & Architecture

- **Orchestration Engine**: **Google ADK (Python)** — A primary *Line Producer Agent* manages state and delegates to specialized sub-agents (*BreakdownAgent*, *ImpactAnalysisAgent*, *ContinuityAgent*).
- **LLM Core**: **Gemini 1.5 Pro / Gemini 3.6 Flash** (Vertex AI / Gemini API).
- **Data Engine**: **ClickHouse Cloud / MCP** — Relational event database supporting sub-millisecond analytical SQL queries.
- **Frontend Command Center**: HTML5, Vanilla CSS3 (Dark Hollywood Glassmorphism), JavaScript (ES6+).
- **Automated Video Recorder**: Playwright Python SDK.

---

## 📊 ClickHouse Schema Design

```sql
-- 1. Script Scenes Table
CREATE TABLE script_scenes (
    scene_id String,
    scene_number UInt32,
    location String,
    time_of_day String,
    description String,
    cost_estimate Float64
) ENGINE = MergeTree() ORDER BY (scene_number);

-- 2. Scene Characters Table
CREATE TABLE scene_characters (
    scene_number UInt32,
    character_name String,
    wardrobe String,
    status String
) ENGINE = MergeTree() ORDER BY (scene_number, character_name);

-- 3. Scene Props & State Table
CREATE TABLE scene_props (
    scene_number UInt32,
    prop_name String,
    prop_state String,
    character_holding String
) ENGINE = MergeTree() ORDER BY (scene_number, prop_name);
```

---

## 🚀 Quick Start & Installation

### Prerequisites
- Python 3.9+
- ClickHouse Cloud Account or Local ClickHouse Instance

### Running Locally

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/directors-cut.git
   cd directors-cut
   ```

2. **Configure Environment Variables**:
   Create a `.env` file:
   ```env
   CLICKHOUSE_HOST=your-clickhouse-host.clickhouse.cloud
   CLICKHOUSE_USER=default
   CLICKHOUSE_PASSWORD=your_password
   GEMINI_API_KEY=your_gemini_api_key
   ```

3. **Start the Director's Cut Server**:
   ```bash
   python3 server.py
   ```
   Open your browser at: `http://localhost:8085`

4. **Generate Demo Video Artifact**:
   ```bash
   python3 record_demo.py
   ```

---

## 📜 License
MIT License. See [LICENSE](LICENSE) for details.
