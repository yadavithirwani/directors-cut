/**
 * DIRECTOR'S CUT — Frontend Application Engine
 * Connects UI to backend API & live ClickHouse Cloud MCP engine.
 */

document.addEventListener("DOMContentLoaded", () => {
    const btnBreakdown = document.getElementById("btn-run-breakdown");
    const btnImpact = document.getElementById("btn-analyze-impact");
    const btnContinuity = document.getElementById("btn-run-continuity");
    
    const inputScreenplay = document.getElementById("input-screenplay-text");
    const inputChange = document.getElementById("input-change-request");
    const outputJson = document.getElementById("output-json");
    const statusBadge = document.getElementById("status-indicator");

    const costBox = document.getElementById("cost-summary-box");
    const valLocCost = document.getElementById("val-loc-cost");
    const valWardrobeCost = document.getElementById("val-wardrobe-cost");
    const valPropCost = document.getElementById("val-prop-cost");
    const valGrandTotal = document.getElementById("val-grand-total");

    function setStatus(text, type = "loading") {
        statusBadge.textContent = text;
        statusBadge.className = `status-badge ${type}`;
    }

    async function makeApiRequest(endpoint, payload = {}) {
        setStatus("EXECUTING AGENT & CLICKHOUSE...", "loading");
        
        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const data = await response.json();
                setStatus("SUCCESS (200 OK)", "ready");
                return data;
            } else {
                const errText = await response.text();
                setStatus("ERROR", "error");
                return { status: "error", message: errText };
            }
        } catch (err) {
            setStatus("CONNECTION ERROR", "error");
            return { status: "error", message: `Failed to connect to backend: ${err.message}` };
        }
    }

    btnBreakdown.addEventListener("click", async () => {
        const text = inputScreenplay ? inputScreenplay.value : "";
        const data = await makeApiRequest("/api/breakdown", { screenplay_text: text });
        outputJson.textContent = JSON.stringify(data, null, 2);
        
        if (data.cost_summary) {
            valLocCost.textContent = data.cost_summary.total_location_cost;
            valWardrobeCost.textContent = data.cost_summary.total_wardrobe_cost;
            valPropCost.textContent = data.cost_summary.total_prop_cost;
            valGrandTotal.textContent = data.cost_summary.grand_total_cost;
            costBox.classList.remove("hidden");
        }
    });

    btnImpact.addEventListener("click", async () => {
        const changeReq = inputChange.value || "Move Scene 1 to Warehouse Docks at Night";
        const data = await makeApiRequest("/api/impact", { change_request: changeReq });
        outputJson.textContent = JSON.stringify(data, null, 2);
    });

    btnContinuity.addEventListener("click", async () => {
        const data = await makeApiRequest("/api/continuity", { target_scene: 3, character: "SARAH" });
        outputJson.textContent = JSON.stringify(data, null, 2);
    });
});
