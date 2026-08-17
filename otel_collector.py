"""
AETHER Ops - OpenTelemetry (OTel) AI Observability Collector & AI Judge Engine
Tracks agent spans, token usage, tool latency, scorecards, and anti-pattern code patches.
"""

import time
import json
from typing import Dict, Any, List

class OTelCollector:
    def __init__(self):
        self.reset_spans()

    def reset_spans(self):
        self.spans = []
        self.root_span_id = f"span_root_{int(time.time())}"

    def generate_scenario_telemetry(self, scenario_type: str = "zero_day") -> Dict[str, Any]:
        """Generates OpenTelemetry span tree and scorecards for scenario execution"""
        now = time.time()
        
        if scenario_type == "zero_day":
            spans = [
                {
                    "span_id": "span_root_01",
                    "parent_span_id": None,
                    "name": "User Request: Triage P1 Zero-Day Alert",
                    "kind": "SERVER",
                    "duration_ms": 2450,
                    "status": "OK",
                    "attributes": {
                        "gen_ai.prompt": "Triage firing alert alert_p1_db_outage, locate stack trace, search web for CVE fix, and store in ClickHouse.",
                        "gen_ai.completion": "Alert triaged. Root cause: DB pool connection timeout (CVE-2026-1142). Web solution found: pool_size=50. Remediated.",
                        "gen_ai.usage.prompt_tokens": 842,
                        "gen_ai.usage.completion_tokens": 284,
                        "gen_ai.total_cost_usd": 0.0038
                    }
                },
                {
                    "span_id": "span_llm_01",
                    "parent_span_id": "span_root_01",
                    "name": "Gemini 3.6 Flash: Initial Triage Planning",
                    "kind": "INTERNAL",
                    "duration_ms": 320,
                    "status": "OK",
                    "attributes": {
                        "gen_ai.model": "gemini-3.6-flash",
                        "gen_ai.tool_calls_planned": ["grafana_irm_triage_alert", "grafana_logql_query"]
                    }
                },
                {
                    "span_id": "span_mcp_grafana_01",
                    "parent_span_id": "span_llm_01",
                    "name": "MCP Call: mcp-grafana/grafana_irm_triage_alert",
                    "kind": "CLIENT",
                    "duration_ms": 84,
                    "status": "OK",
                    "attributes": {
                        "mcp.server": "grafana-cloud-mcp",
                        "mcp.tool": "grafana_irm_triage_alert",
                        "alert_id": "alert_p1_db_outage",
                        "severity": "CRITICAL"
                    }
                },
                {
                    "span_id": "span_mcp_loki_02",
                    "parent_span_id": "span_llm_01",
                    "name": "MCP Call: mcp-grafana/grafana_logql_query",
                    "kind": "CLIENT",
                    "duration_ms": 112,
                    "status": "OK",
                    "attributes": {
                        "mcp.server": "grafana-cloud-mcp",
                        "mcp.tool": "grafana_logql_query",
                        "logql": '{app="payment-gateway"} |= "ConnectionRefusedError"'
                    }
                },
                {
                    "span_id": "span_mcp_parallel_03",
                    "parent_span_id": "span_root_01",
                    "name": "MCP Call: parallel-web/search_web",
                    "kind": "CLIENT",
                    "duration_ms": 195,
                    "status": "OK",
                    "attributes": {
                        "mcp.server": "parallel-web-mcp",
                        "query": "ConnectionRefusedError ConnectionPoolExhausted CVE-2026-1142 patch",
                        "results_count": 3
                    }
                },
                {
                    "span_id": "span_mcp_clickhouse_04",
                    "parent_span_id": "span_root_01",
                    "name": "MCP Call: mcp-clickhouse/query_sql",
                    "kind": "CLIENT",
                    "duration_ms": 48,
                    "status": "OK",
                    "attributes": {
                        "mcp.server": "clickhouse-mcp",
                        "sql": "INSERT INTO agent_telemetry_logs VALUES ('run_842', 'RESOLVED', 0.0038, 2450)",
                        "rows_inserted": 1
                    }
                }
            ]

            scorecard = {
                "overall_score": 96,
                "metrics": {
                    "goal_completion": "100%",
                    "correctness": "98%",
                    "tool_selection": "95%",
                    "tool_efficiency": "92%",
                    "user_interaction": "94%",
                    "final_answer_quality": "97%"
                },
                "token_usage": {
                    "prompt_tokens": 842,
                    "completion_tokens": 284,
                    "total_tokens": 1126,
                    "total_cost_usd": "$0.0038"
                },
                "recommendation": {
                    "title": "Optimal Multi-MCP Execution Pattern Detected",
                    "anti_pattern_found": "None (High Efficiency)",
                    "impact": "Saved ~1.8s latency by parallelizing Grafana LogQL and Parallel Web Search tool calls.",
                    "code_fix": """# Python ADK Parallel Tool Executor Fix
async def optimized_triage(agent, alert_id):
    # Execute Grafana MCP and Parallel Search concurrently
    grafana_task = agent.call_mcp("grafana", "triage_alert", alert_id=alert_id)
    parallel_task = agent.call_mcp("parallel", "search_web", query="DB ConnectionPoolExhausted patch")
    
    alert_info, web_docs = await asyncio.gather(grafana_task, parallel_task)
    return agent.synthesize_patch(alert_info, web_docs)
"""
                }
            }
            return {"spans": spans, "scorecard": scorecard}

        # Fallback Default Scenario
        return {
            "spans": [],
            "scorecard": {
                "overall_score": 90,
                "metrics": {"goal_completion": "90%", "correctness": "90%", "tool_selection": "90%", "tool_efficiency": "90%", "user_interaction": "90%", "final_answer_quality": "90%"},
                "token_usage": {"prompt_tokens": 500, "completion_tokens": 200, "total_tokens": 700, "total_cost_usd": "$0.0025"},
                "recommendation": {"title": "Standard Run", "anti_pattern_found": "None", "impact": "N/A", "code_fix": "# No changes required."}
            }
        }

collector = OTelCollector()
