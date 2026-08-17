"""
DIRECTOR'S CUT - Main Backend Server
Serves static UI assets and provides clean REST API endpoints for:
- POST /api/breakdown (Use Case 1: Script Breakdown Engine)
- POST /api/impact (Use Case 2: Downstream Impact Analysis)
- POST /api/continuity (Use Case 3: Continuity Management System)
- POST /api/clickhouse/sql (Direct ClickHouse SQL query runner)
"""

import http.server
import socketserver
import os
import json
import urllib.parse
from agent_adk import adk_agent
from clickhouse_db import db_engine

PORT = 8085
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class DirectorsCutHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_POST(self):
        parsed_path = urllib.parse.urlparse(self.path)
        path = parsed_path.path
        
        content_len = int(self.headers.get('Content-Length', 0))
        body_bytes = self.rfile.read(content_len) if content_len > 0 else b"{}"
        try:
            body = json.loads(body_bytes.decode('utf-8'))
        except Exception:
            body = {}

        # ---------------------------------------------------------------------
        # USE CASE 1: SCRIPT BREAKDOWN ENGINE (THE FOUNDATION)
        # ---------------------------------------------------------------------
        if path == "/api/breakdown":
            screenplay_text = body.get("screenplay_text")
            result = adk_agent.execute_use_case_1_breakdown(screenplay_text)
            self._send_json(result)
            return

        # ---------------------------------------------------------------------
        # USE CASE 2: DOWNSTREAM IMPACT ANALYSIS
        # ---------------------------------------------------------------------
        elif path == "/api/impact":
            change_request = body.get("change_request", "Move Scene 12 from Apartment to Industrial Warehouse.")
            result = adk_agent.execute_use_case_2_impact(change_request)
            self._send_json(result)
            return

        # ---------------------------------------------------------------------
        # USE CASE 3: CONTINUITY MANAGEMENT SYSTEM
        # ---------------------------------------------------------------------
        elif path == "/api/continuity":
            target_scene = body.get("target_scene", 3)
            character = body.get("character", "SARAH")
            result = adk_agent.execute_use_case_3_continuity(target_scene, character)
            self._send_json(result)
            return

        # DIRECT CLICKHOUSE SQL QUERY
        elif path == "/api/clickhouse/sql":
            sql_query = body.get("query", "SELECT * FROM script_scenes LIMIT 5")
            result = db_engine.execute_sql(sql_query)
            self._send_json(result)
            return

        self.send_error(404, "Endpoint Not Found")

    def _send_json(self, data: dict, status: int = 200):
        body = json.dumps(data).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(body)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()

if __name__ == '__main__':
    with socketserver.TCPServer(("", PORT), DirectorsCutHandler) as httpd:
        print(f"===========================================================")
        print(f"🎬 DIRECTOR'S CUT Server Running at http://localhost:{PORT}")
        print(f"Orchestration Engine: Google ADK (Python)")
        print(f"Data Engine: ClickHouse Cloud")
        print(f"===========================================================")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")
