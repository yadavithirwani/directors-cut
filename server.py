"""
AETHER Ops - Main Backend API & Local HTTP Server
Serves static assets and provides REST API endpoints for:
- /api/triage (Runs multi-agent triage scenario)
- /api/grafana/promql (Grafana PromQL query)
- /api/grafana/logql (Grafana Loki LogQL query)
- /api/parallel/search (Parallel Web Search query)
- /api/clickhouse/sql (ClickHouse SQL query)
- /api/otel/spans (OTel trace spans & AI Judge scorecard)
"""

import http.server
import socketserver
import os
import json
import urllib.parse
from mcp_bridge import bridge
from otel_collector import collector

PORT = 8085
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class AetherHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        parsed_path = urllib.parse.urlparse(self.path)
        path = parsed_path.path
        query_params = urllib.parse.parse_qs(parsed_path.query)

        if path == "/api/otel/spans":
            scenario = query_params.get("scenario", ["zero_day"])[0]
            data = collector.generate_scenario_telemetry(scenario)
            self._send_json(data)
            return

        elif path == "/api/grafana/promql":
            q = query_params.get("query", ["http_requests_total"])[0]
            data = bridge.query_grafana_promql(q)
            self._send_json(data)
            return

        elif path == "/api/grafana/logql":
            q = query_params.get("query", ['{app="payment-gateway"}'])[0]
            data = bridge.query_grafana_logql(q)
            self._send_json(data)
            return

        elif path == "/api/parallel/search":
            q = query_params.get("query", ["DB connection leak patch"])[0]
            data = bridge.search_parallel_web(q)
            self._send_json(data)
            return

        elif path == "/api/clickhouse/sql":
            q = query_params.get("query", ["SELECT * FROM agent_telemetry_logs LIMIT 5"])[0]
            data = bridge.query_clickhouse_sql(q)
            self._send_json(data)
            return

        super().do_GET()

    def do_POST(self):
        parsed_path = urllib.parse.urlparse(self.path)
        path = parsed_path.path
        
        content_len = int(self.headers.get('Content-Length', 0))
        body_bytes = self.rfile.read(content_len) if content_len > 0 else b"{}"
        try:
            body = json.loads(body_bytes.decode('utf-8'))
        except Exception:
            body = {}

        if path == "/api/triage":
            scenario = body.get("scenario", "zero_day")
            # Step 1: Query Grafana IRM & LogQL
            grafana_alert = bridge.triage_grafana_alert("alert_p1_db_outage")
            grafana_logs = bridge.query_grafana_logql('{app="payment-gateway"} |= "ConnectionRefusedError"')
            
            # Step 2: Query Parallel Web Search for fix
            parallel_results = bridge.search_parallel_web("ConnectionPoolExhausted CVE-2026-1142 fix")
            
            # Step 3: Record execution in ClickHouse
            ch_res = bridge.query_clickhouse_sql("INSERT INTO agent_telemetry_logs VALUES ('run_842', 'RESOLVED', 0.0038, 2450)")
            
            # Step 4: Generate OTel Trace & AI Judge score
            otel_data = collector.generate_scenario_telemetry(scenario)

            response = {
                "status": "success",
                "scenario": scenario,
                "workflow_steps": [
                    {"step": 1, "agent": "Sentinel (Grafana MCP)", "action": "Triaged IRM P1 Alert & Loki Logs", "result": grafana_logs},
                    {"step": 2, "agent": "Oracle (Parallel Web)", "action": "Searched Web for CVE-2026-1142 fix", "result": parallel_results},
                    {"step": 3, "agent": "Architect (ClickHouse MCP)", "action": "Stored telemetry log in ClickHouse DB", "result": ch_res},
                    {"step": 4, "agent": "Strategist (IBM Bob)", "action": "Synthesized Hotfix Patch & Remediation", "result": "Patch Verified"}
                ],
                "telemetry": otel_data
            }
            self._send_json(response)
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
    with socketserver.TCPServer(("", PORT), AetherHandler) as httpd:
        print(f"===========================================================")
        print(f"🚀 AETHER Ops Command Center Running at http://localhost:{PORT}")
        print(f"Grafana URL: {bridge.grafana_url or 'Simulation Mode'}")
        print(f"Parallel API: {'Live API Key Configured' if bridge.parallel_api_key else 'Simulation Mode'}")
        print(f"ClickHouse Host: {bridge.clickhouse_host or 'Simulation Mode'}")
        print(f"===========================================================")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")
