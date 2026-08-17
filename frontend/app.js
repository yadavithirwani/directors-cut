document.addEventListener('DOMContentLoaded', () => {
  const btnRunBreakdown = document.getElementById('btn-run-breakdown');
  const btnAnalyzeImpact = document.getElementById('btn-analyze-impact');
  const btnRunContinuity = document.getElementById('btn-run-continuity');

  const scriptText = document.getElementById('script-text');
  const inputScriptChange = document.getElementById('input-script-change');

  const breakdownOutput = document.getElementById('breakdown-output');
  const impactResults = document.getElementById('impact-results');
  const continuityResults = document.getElementById('continuity-results');

  // USE CASE 1: SCRIPT BREAKDOWN & COST CALCULATOR
  btnRunBreakdown.addEventListener('click', async () => {
    breakdownOutput.innerHTML = '<div class="placeholder-msg">Parsing Screenplay & Calculating Line-Item Costs in ClickHouse...</div>';
    try {
      const resp = await fetch('/api/breakdown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ screenplay_text: scriptText.value })
      });
      const data = await resp.json();
      renderBreakdown(data);
    } catch (err) {
      breakdownOutput.innerHTML = `<p style="color:var(--rose-glow)">Breakdown Failed: ${err.message}</p>`;
    }
  });

  // USE CASE 2: DOWNSTREAM IMPACT & FINANCIAL DELTA
  btnAnalyzeImpact.addEventListener('click', async () => {
    impactResults.innerHTML = '<div class="placeholder-msg">Executing ClickHouse SQL Financial Delta Queries...</div>';
    try {
      const resp = await fetch('/api/impact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ change_request: inputScriptChange.value })
      });
      const data = await resp.json();
      renderImpact(data);
    } catch (err) {
      impactResults.innerHTML = `<p style="color:var(--rose-glow)">Impact Analysis Failed: ${err.message}</p>`;
    }
  });

  // USE CASE 3: CONTINUITY MANAGEMENT & RESHOOT COST CHECK
  btnRunContinuity.addEventListener('click', async () => {
    continuityResults.innerHTML = '<div class="placeholder-msg">Querying ClickHouse Temporal Prop & Actor States...</div>';
    try {
      const resp = await fetch('/api/continuity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target_scene: 3, character: 'SARAH' })
      });
      const data = await resp.json();
      renderContinuity(data);
    } catch (err) {
      continuityResults.innerHTML = `<p style="color:var(--rose-glow)">Continuity Check Failed: ${err.message}</p>`;
    }
  });

  // RENDER FUNCTIONS
  function renderBreakdown(data) {
    const b = data.breakdown;
    const c = data.cost_summary;
    breakdownOutput.innerHTML = `
      <div class="result-card">
        <strong style="color:var(--gold-glow)">✓ Ingested into ClickHouse Master Breakdown</strong>
        <div style="margin-top:6px;padding:8px;background:rgba(234,179,8,0.1);border:1px solid var(--gold-glow);border-radius:6px;">
          <strong style="color:var(--gold-glow)">💰 GRAND TOTAL ESTIMATED COST: ${c.grand_total_cost}</strong>
          <div style="font-size:0.75rem;color:var(--text-muted);margin-top:2px;">
            Locations & Permits: ${c.total_location_cost} | Wardrobe: ${c.total_wardrobe_cost} | Props: ${c.total_prop_cost}
          </div>
        </div>
        <div style="margin-top:8px;"><strong>Scenes & Location Costs (ClickHouse script_scenes):</strong></div>
        <pre style="color:var(--cyan-glow)">${JSON.stringify(b.scenes, null, 2)}</pre>
        <div style="margin-top:8px;"><strong>Props & Rental Costs (ClickHouse scene_props):</strong></div>
        <pre style="color:var(--emerald-glow)">${JSON.stringify(b.props, null, 2)}</pre>
      </div>
    `;
  }

  function renderImpact(data) {
    const imp = data.impact_analysis;
    const cost = imp.itemized_cost_delta;
    impactResults.innerHTML = `
      <div class="result-card">
        <div class="sql-badge">ClickHouse SQL: ${imp.clickhouse_sql_executed}</div>
        <div style="margin-top:8px;">Location Shift: <span style="color:var(--rose-glow)">${imp.location_delta.original}</span> ➔ <span style="color:var(--emerald-glow)">${imp.location_delta.proposed}</span></div>
        <div style="margin-top:6px;padding:8px;background:rgba(244,63,94,0.1);border:1px solid var(--rose-glow);border-radius:6px;">
          <strong style="color:var(--rose-glow)">💵 NET COST INCREASE: ${cost.net_cost_increase}</strong>
          <div style="font-size:0.75rem;color:var(--text-muted);margin-top:2px;">
            Original Location: ${cost.original_location_cost} | New Night Rental: ${cost.new_location_rental_cost} | Night Lighting Rigs: ${cost.new_night_lighting_cost}
          </div>
        </div>
        <div style="margin-top:8px;">Scheduling Impact: ${imp.scheduling_delta.lighting_crew_impact}</div>
        <div style="margin-top:4px;">Permit Required: ${imp.scheduling_delta.permit_required}</div>
      </div>
    `;
  }

  function renderContinuity(data) {
    const c = data.continuity_check;
    const alert = c.continuity_alerts[0];
    continuityResults.innerHTML = `
      <div class="result-card">
        <div class="sql-badge">ClickHouse SQL: ${c.clickhouse_sql_executed}</div>
        <div style="margin-top:8px;"><strong>Temporal State & Prop Timeline:</strong></div>
        <pre style="color:var(--cyan-glow)">${JSON.stringify(c.temporal_timeline, null, 2)}</pre>
        <div style="margin-top:8px;padding:10px;background:rgba(244,63,94,0.15);border:1px solid var(--rose-glow);border-radius:6px;">
          <strong style="color:var(--rose-glow)">⚠️ CONTINUITY ALERT (${alert.severity}):</strong>
          <div style="margin-top:4px;font-size:0.75rem;"><strong>Est. Reshoot Cost Saved: ${alert.estimated_reshoot_cost}</strong></div>
          <div style="margin-top:4px;font-size:0.75rem;">${alert.issue}</div>
          <div style="margin-top:6px;font-size:0.75rem;color:var(--emerald-glow)">💡 Recommendation: ${alert.recommendation}</div>
        </div>
      </div>
    `;
  }
});
