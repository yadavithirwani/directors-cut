document.addEventListener('DOMContentLoaded', () => {
  // DOM ELEMENTS
  const btnRunScenario = document.getElementById('btn-run-scenario');
  const scenarioSelect = document.getElementById('scenario-select');
  const reelFeed = document.getElementById('reel-feed');
  const otelTree = document.getElementById('otel-tree');
  
  // TABS
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  // STUDIO INPUTS & BUTTONS
  const inputPromql = document.getElementById('input-grafana-promql');
  const inputLogql = document.getElementById('input-grafana-logql');
  const btnRunPromql = document.getElementById('btn-run-promql');
  const btnRunLogql = document.getElementById('btn-run-logql');
  const outputGrafana = document.getElementById('output-grafana');

  const inputParallel = document.getElementById('input-parallel-query');
  const btnRunParallel = document.getElementById('btn-run-parallel');
  const outputParallel = document.getElementById('output-parallel');

  const inputClickhouse = document.getElementById('input-clickhouse-sql');
  const btnRunClickhouse = document.getElementById('btn-run-clickhouse');
  const outputClickhouse = document.getElementById('output-clickhouse');

  // SCORECARD & MODAL
  const modalPatch = document.getElementById('modal-patch');
  const btnOpenPatch = document.getElementById('btn-open-patch');
  const btnClosePatch = document.getElementById('btn-close-patch');
  const btnCopyPatch = document.getElementById('btn-copy-patch');
  const codePatchText = document.getElementById('code-patch-text');

  let currentPatchCode = "";

  // TAB SWITCHING
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      const target = document.getElementById(btn.dataset.tab);
      if (target) target.classList.add('active');
    });
  });

  // RUN TRIAGE MATRIX SCENARIO
  btnRunScenario.addEventListener('click', async () => {
    const selectedScenario = scenarioSelect.value;
    reelFeed.innerHTML = `<div class="feed-step"><div class="step-badge">RUNNING</div><div class="step-body"><div class="step-title">Triggering Multi-Partner Incident Triage...</div></div></div>`;

    try {
      const resp = await fetch('/api/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario: selectedScenario })
      });
      const data = await resp.json();

      renderReelFeed(data.workflow_steps);
      renderOTelTree(data.telemetry.spans);
      renderScorecard(data.telemetry.scorecard);
    } catch (err) {
      console.error('Triage Error:', err);
      reelFeed.innerHTML = `<div class="feed-step"><div class="step-badge" style="background:var(--rose-glow)">ERROR</div><div class="step-body"><div class="step-title">Triage Execution Failed</div><div class="step-desc">${err.message}</div></div></div>`;
    }
  });

  // RENDER PLAY-BY-PLAY REEL FEED
  function renderReelFeed(steps) {
    reelFeed.innerHTML = '';
    steps.forEach((s, idx) => {
      const stepEl = document.createElement('div');
      stepEl.className = 'feed-step';
      stepEl.innerHTML = `
        <div class="step-badge">STEP ${s.step}</div>
        <div class="step-body">
          <div class="step-title">${s.agent} — ${s.action}</div>
          <div class="step-desc"><pre style="background:none;padding:0;color:var(--text-muted);font-family:var(--font-code);">${JSON.stringify(s.result, null, 2)}</pre></div>
        </div>
        <div class="step-time">+00:00.${(idx + 1) * 350}</div>
      `;
      reelFeed.appendChild(stepEl);
    });
  }

  // RENDER OTEL SPAN TREE
  function renderOTelTree(spans) {
    otelTree.innerHTML = '';
    if (!spans || spans.length === 0) {
      otelTree.innerHTML = '<p>No OTel spans captured yet.</p>';
      return;
    }

    spans.forEach(span => {
      const depthClass = span.parent_span_id ? (span.parent_span_id.includes('llm') ? 'depth-2' : 'depth-1') : '';
      const nodeEl = document.createElement('div');
      nodeEl.className = `tree-node ${depthClass}`;
      nodeEl.innerHTML = `
        <div style="display:flex;justify-content:space-between;">
          <strong style="color:var(--cyan-glow);">${span.name}</strong>
          <span style="color:var(--emerald-glow);">${span.duration_ms}ms</span>
        </div>
        <div style="font-size:0.7rem;color:var(--text-muted);margin-top:4px;">
          Span ID: ${span.span_id} | Kind: ${span.kind} | Status: ${span.status}
        </div>
      `;
      otelTree.appendChild(nodeEl);
    });
  }

  // RENDER SCORECARD
  function renderScorecard(scorecard) {
    if (!scorecard) return;
    document.getElementById('score-total').textContent = `${scorecard.overall_score} / 100`;
    document.getElementById('score-goal').textContent = scorecard.metrics.goal_completion;
    document.getElementById('score-correctness').textContent = scorecard.metrics.correctness;
    document.getElementById('score-tool-select').textContent = scorecard.metrics.tool_selection;
    document.getElementById('score-efficiency').textContent = scorecard.metrics.tool_efficiency;

    document.getElementById('val-spans').textContent = '6 Spans';
    document.getElementById('val-latency').textContent = '2.45s';
    document.getElementById('val-cost').textContent = scorecard.token_usage.total_cost_usd;

    if (scorecard.recommendation) {
      document.getElementById('rec-title').textContent = scorecard.recommendation.title;
      document.getElementById('rec-desc').textContent = scorecard.recommendation.impact;
      currentPatchCode = scorecard.recommendation.code_fix;
      codePatchText.textContent = currentPatchCode;
    }
  }

  // QUERY BUTTON LISTENERS
  btnRunPromql.addEventListener('click', async () => {
    outputGrafana.innerHTML = '<pre>Executing PromQL...</pre>';
    const res = await fetch(`/api/grafana/promql?query=${encodeURIComponent(inputPromql.value)}`);
    const data = await res.json();
    outputGrafana.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
  });

  btnRunLogql.addEventListener('click', async () => {
    outputGrafana.innerHTML = '<pre>Executing LogQL...</pre>';
    const res = await fetch(`/api/grafana/logql?query=${encodeURIComponent(inputLogql.value)}`);
    const data = await res.json();
    outputGrafana.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
  });

  btnRunParallel.addEventListener('click', async () => {
    outputParallel.innerHTML = '<pre>Executing Parallel Web Search...</pre>';
    const res = await fetch(`/api/parallel/search?query=${encodeURIComponent(inputParallel.value)}`);
    const data = await res.json();
    outputParallel.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
  });

  btnRunClickhouse.addEventListener('click', async () => {
    outputClickhouse.innerHTML = '<pre>Executing ClickHouse SQL...</pre>';
    const res = await fetch(`/api/clickhouse/sql?query=${encodeURIComponent(inputClickhouse.value)}`);
    const data = await res.json();
    outputClickhouse.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
  });

  // MODAL HANDLERS
  btnOpenPatch.addEventListener('click', () => modalPatch.classList.add('active'));
  btnClosePatch.addEventListener('click', () => modalPatch.classList.remove('active'));
  btnCopyPatch.addEventListener('click', () => {
    navigator.clipboard.writeText(currentPatchCode);
    btnCopyPatch.textContent = '✅ Copied to Clipboard!';
    setTimeout(() => { btnCopyPatch.textContent = '📋 Copy Patch Code'; }, 2000);
  });
});
