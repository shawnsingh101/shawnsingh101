// Runs practice answers in real Python (Pyodide) on a background thread, so the page stays responsive and a program
// that never ends can be stopped (the page terminates this worker). Loaded only when a practice card is opened.
// A module worker: Pyodide 314 needs one.
let ready = null;
self.onmessage = async ({ data }) => {
  try {
    if (!ready) ready = (async () => {
      const { loadPyodide } = await import(data.indexURL + 'pyodide.mjs');
      const py = await loadPyodide({ indexURL: data.indexURL });
      py.runPython(await (await fetch(data.runnerURL)).text());
      return py;
    })();
    const py = await ready;
    if (data.init) { self.postMessage({ id: data.id, results: [] }); return; } // just loading, ahead of the first run
    const run = py.globals.get('run_case');
    const results = data.cases.map(c => JSON.parse(run(data.src, c.input ?? '', data.check ?? '')));
    run.destroy();
    self.postMessage({ id: data.id, results });
  } catch (e) {
    ready = null;
    self.postMessage({ id: data.id, failed: String(e && e.message || e) });
  }
};
