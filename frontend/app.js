document.addEventListener('DOMContentLoaded', () => {
  const btnRunBreakdown = document.getElementById('btn-run-breakdown');
  const btnAnalyzeImpact = document.getElementById('btn-analyze-impact');
  const btnRunContinuity = document.getElementById('btn-run-continuity');

  const scriptText = document.getElementById('script-text');
  const inputScriptChange = document.getElementById('input-script-change');

  const breakdownOutput = document.getElementById('breakdown-output');
  const impactResults = document.getElementById('impact-results');
  const continuityResults = document.getElementById('continuity-results');

  // USE CASE 1: SCRIPT BREAKDOWN (THE FOUNDATION)
  btnRunBreakdown.addEventListener('click', async () => {
    breakdownOutput.innerHTML = '<div class="placeholder-msg">Parsing Screenplay & Writing ClickHouse Master Breakdown...</div>';
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

  // USE CASE 2: DOWNSTREAM IMPACT ANALYSIS
  btnAnalyzeImpact.addEventListener('click', async () => {
    impactResults.innerHTML = '<div class="placeholder-msg">Executing ClickHouse SQL Impact Queries...</div>';
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

  // USE CASE 3: CONTINUITY MANAGEMENT SYSTEM
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
    breakdownOutput.innerHTML = `
      <div class="result-card">
        <strong style="color:var(--gold-glow)">✓ Ingested into ClickHouse Master Breakdown</strong>
        <div style="margin-top:6px;">Total Scenes Parsed: <strong>${b.total_scenes}</strong></div>
        <div style="margin-top:8px;"><strong>Scenes Table (ClickHouse script_scenes):</strong></div>
        <pre style="color:var(--cyan-glow)">${JSON.stringify(b.scenes, null, 2)}</pre>
        <div style="margin-top:8px;"><strong>Props Table (ClickHouse scene_props):</strong></div>
        <pre style="color:var(--emerald-glow)">${JSON.stringify(b.props, null, 2)}</pre>
      </div>
    `;
  }

  function renderImpact(data) {
    const imp = data.impact_analysis;
    impactResults.innerHTML = `
      <div class="result-card">
        <div class="sql-badge">ClickHouse SQL: ${imp.clickhouse_sql_executed}</div>
        <div style="margin-top:8px;">Location Delta: <span style="color:var(--rose-glow)">${imp.location_delta.original}</span> ➔ <span style="color:var(--emerald-glow)">${imp.location_delta.proposed}</span></div>
        <div style="margin-top:4px;">Financial Delta: <strong style="color:var(--gold-glow)">${imp.financial_delta.cost_increase}</strong> (Original: ${imp.financial_delta.original_budget} | New: ${imp.financial_delta.new_budget})</div>
        <div style="margin-top:4px;">Scheduling Delta: ${imp.scheduling_delta.lighting_crew_impact}</div>
        <div style="margin-top:4px;">Permit Required: ${imp.scheduling_delta.permit_required}</div>
      </div>
    `;
  }

  function renderContinuity(data) {
    const c = data.continuity_check;
    continuityResults.innerHTML = `
      <div class="result-card">
        <div class="sql-badge">ClickHouse SQL: ${c.clickhouse_sql_executed}</div>
        <div style="margin-top:8px;"><strong>Temporal State Timeline:</strong></div>
        <pre style="color:var(--cyan-glow)">${JSON.stringify(c.temporal_timeline, null, 2)}</pre>
        <div style="margin-top:8px;padding:8px;background:rgba(244,63,94,0.15);border:1px solid var(--rose-glow);border-radius:4px;">
          <strong style="color:var(--rose-glow)">⚠️ CONTINUITY ALERT:</strong>
          <div style="margin-top:4px;font-size:0.75rem;">${c.continuity_alerts[0].issue}</div>
          <div style="margin-top:4px;font-size:0.75rem;color:var(--emerald-glow)">💡 Recommendation: ${c.continuity_alerts[0].recommendation}</div>
        </div>
      </div>
    `;
  }
});
