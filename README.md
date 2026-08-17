# 🎬 DIRECTOR'S CUT — Autonomous Hollywood Operations Agent

> **"A screenplay isn't a document. It's a database."**

[![License: MIT](https://img.shields.io/badge/License-MIT-indigo.svg)](LICENSE)
[![Google ADK](https://img.shields.io/badge/Orchestration-Google_ADK-blue.svg)](https://cloud.google.com/vertex-ai)
[![ClickHouse Engine](https://img.shields.io/badge/Data_Engine-ClickHouse-yellow.svg)](https://clickhouse.com/)

**DIRECTOR'S CUT** is an autonomous screenplay intelligence and film production operations platform built with **Google ADK (Agent Development Kit)** and **ClickHouse**.

In movie production, a single script change causes unmapped cascading delays across wardrobe, lighting, scheduling, and budget. Continuity errors alone cost studios millions in reshoots. Current workflows treat screenplays as static text. **DIRECTOR'S CUT** transforms unstructured screenplays into structured, high-speed relational event databases in ClickHouse, allowing AI agents to programmatically track downstream impact, line-item costs, and continuity states.

---

## 📂 Project Directory Layout

The project follows a clean separation between **Frontend** and **Backend**:

```
directors-cut/
├── frontend/                 # UI Command Center
│   ├── index.html            # Dark Hollywood Glassmorphism UI
│   ├── styles.css            # Responsive CSS styling
│   └── app.js                # Frontend Use Case controller
├── backend/                  # Data & AI Logic Backend Layer
│   ├── server.py             # REST API server (/api/breakdown, /api/impact, /api/continuity)
│   ├── agent_adk.py          # Google ADK Line Producer Agent & Sub-Agents
│   ├── clickhouse_db.py      # ClickHouse Relational Event DB & Line-Item Cost Engine
│   └── sample_screenplay.txt # Sample 5-page Hollywood screenplay
├── .env.example              # Environment variables template
├── .gitignore                # Git exclusion rules
├── README.md                 # Project Overview
├── DESIGN.md                 # Technical Architecture & Schema Spec
├── IMPLEMENTATION_PLAN.md    # Development Roadmap
└── record_demo.py            # Playwright Automated Video Recorder
```

---

## 🎯 The Three Core Use Cases (Strict Dependency Architecture)

The system enforces a strict 3-tier dependency architecture where Use Cases 2 and 3 rely on the foundational database created in Use Case 1:

```
┌───────────────────────────────────────────────────────────┐
│ USE CASE 1: Script Breakdown (The Foundation)             │
│ • Google ADK Ingestion Agent parses screenplay text       │
│ • Loads Master Breakdown into ClickHouse Relational Tables │
│ • Itemized Location, Wardrobe & Prop Costs                │
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

### 1. 🎬 Script Breakdown & Line-Item Cost Engine (The Foundation)
Translates unstructured script text into a structured, relational event database in ClickHouse (`script_scenes`, `scene_characters`, `scene_props`) with explicit line-item location, permit, wardrobe, and prop rental costs.

### ⚡ 2. Downstream Impact & Financial Delta Analysis
Calculates the logistical, financial, and scheduling ripple effects of creative changes (e.g. *"Move Scene 12 from Apartment to Industrial Warehouse"*). Sub-agents query ClickHouse to calculate cost deltas and scene count impacts.

### 🔍 3. Continuity Management & Reshoot Risk System
Programmatically tracks the physical and temporal state of actors and props across scenes (`SELECT prop_state FROM scene_props WHERE scene_number < 13 AND character_holding = 'Sarah'`) to catch reshoot bugs before filming.

---

## 🚀 Quick Start & Running Locally

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yadavithirwani/directors-cut.git
   cd directors-cut
   ```

2. **Start the Backend Server**:
   ```bash
   python3 backend/server.py
   ```
   Open your browser at: **`http://localhost:8085`**

3. **Generate Automated Demo Video**:
   ```bash
   python3 record_demo.py
   ```

---

## 📜 License
MIT License. See [LICENSE](LICENSE) for details.
