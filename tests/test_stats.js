const path = require("path");
const S = require(path.join(__dirname, "..", "website", "static", "js", "demos", "stats.js"));

// deterministic sampler
function rng(seed) {
  let s = seed >>> 0, spare = null;
  const u = () => { s = (s + 0x6d2b79f5) >>> 0; let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const n = () => { if (spare !== null) { const v = spare; spare = null; return v; }
    const r = Math.sqrt(-2 * Math.log(1 - u())), a = 2 * Math.PI * u();
    spare = r * Math.sin(a); return r * Math.cos(a); };
  return { u, n };
}
const gauss = (r, n, mu, sd) => Array.from({length: n}, () => mu + sd * r.n());
const tsample = (r, n, df, mu, scale) => Array.from({length: n}, () => {
  let c = 0; for (let i = 0; i < df; i++) c += r.n() ** 2;
  return mu + scale * r.n() / Math.sqrt(c / df);
});

let failures = 0;
const check = (name, ok, detail) => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? "  " + detail : ""}`);
  if (!ok) failures++;
};

/* 1. Gaussian closed form vs direct summation of log densities */
{
  const x = gauss(rng(1), 200, 1.3, 0.8);
  const fit = S.fitGaussian(x);
  const direct = x.reduce((t, v) => t + Math.log(S.normalPdf(v, fit.mu, fit.sigma)), 0);
  check("gaussian logL closed form == direct sum", Math.abs(fit.logLikelihood - direct) < 1e-9,
    `closed=${fit.logLikelihood.toFixed(9)} direct=${direct.toFixed(9)}`);
  const m = x.reduce((a,b)=>a+b,0)/x.length;
  check("gaussian mu == sample mean", Math.abs(fit.mu - m) < 1e-12);
}

/* 2. Student t: EM solution vs brute-force 3D grid search */
{
  for (const [df, n, seed] of [[3, 300, 7], [8, 250, 11], [40, 200, 13]]) {
    const x = tsample(rng(seed), n, df, 0.5, 1.2);
    const fit = S.fitStudentT(x);
    let best = -Infinity, at = null;
    for (let l = fit.location - 0.6; l <= fit.location + 0.6; l += 0.02)
      for (let s = Math.max(0.05, fit.scale - 0.5); s <= fit.scale + 0.5; s += 0.02)
        for (let d = 0.5; d <= 200; d *= 1.06) {
          const ll = S.studentLogLikelihood(x, l, s, d);
          if (ll > best) { best = ll; at = [l, s, d]; }
        }
    check(`student t (df=${df}) EM >= brute-force grid`, fit.logLikelihood >= best - 1e-3,
      `EM=${fit.logLikelihood.toFixed(4)} grid=${best.toFixed(4)} (df EM=${fit.df.toFixed(2)} grid=${at[2].toFixed(2)})`);
  }
}

/* 3. Student t logL agrees with summing its own pdf */
{
  const x = tsample(rng(21), 150, 5, 0, 1);
  const f = S.fitStudentT(x);
  const direct = x.reduce((t, v) => t + Math.log(S.studentPdf(v, f.location, f.scale, f.df)), 0);
  check("student logL == sum log studentPdf", Math.abs(f.logLikelihood - direct) < 1e-8,
    `${f.logLikelihood.toFixed(8)} vs ${direct.toFixed(8)}`);
}

/* 4. Mixture EM vs many random restarts */
{
  const r = rng(31);
  const x = [...gauss(r, 150, -1.5, 0.6), ...gauss(r, 150, 1.5, 0.6)];
  const fit = S.fitMixture(x);
  let best = -Infinity;
  for (let trial = 0; trial < 400; trial++) {
    const comps = [
      { weight: 0.5, mean: x[Math.floor(r.u() * x.length)], sd: 0.3 + r.u() * 1.5 },
      { weight: 0.5, mean: x[Math.floor(r.u() * x.length)], sd: 0.3 + r.u() * 1.5 },
    ];
    const ll = S.mixtureLogLikelihood(x, comps);
    if (ll > best) best = ll;
  }
  check("mixture EM beats 400 random inits", fit.logLikelihood > best,
    `EM=${fit.logLikelihood.toFixed(3)} best-random=${best.toFixed(3)}`);
  const w = fit.components.map(c => c.weight).reduce((a,b)=>a+b,0);
  check("mixture weights sum to 1", Math.abs(w - 1) < 1e-9);
  check("mixture recovers both centres",
    fit.components.map(c=>c.mean).sort((a,b)=>a-b).every((m,i)=>Math.abs(m - [-1.5,1.5][i]) < 0.25),
    fit.components.map(c=>c.mean.toFixed(2)).join(", "));
}

/* 5. Nested models: t and mixture must never fit worse than Gaussian.
      The t only reaches the Gaussian as df -> infinity, so at the finite df
      the search settles on it sits a floating-point hair below. */
{
  for (const seed of [41, 42, 43]) {
    const x = gauss(rng(seed), 200, 0, 1);
    const [g, t, m] = [S.fitGaussian(x), S.fitStudentT(x), S.fitMixture(x)];
    check(`seed ${seed}: t logL >= gaussian logL`, t.logLikelihood >= g.logLikelihood - 1e-4,
      `t=${t.logLikelihood.toFixed(4)} g=${g.logLikelihood.toFixed(4)}`);
    check(`seed ${seed}: mixture logL >= gaussian logL`, m.logLikelihood >= g.logLikelihood - 1e-9,
      `m=${m.logLikelihood.toFixed(4)} g=${g.logLikelihood.toFixed(4)}`);
  }
}

/* 6. AIC/BIC formulas */
{
  const x = gauss(rng(51), 100, 0, 1);
  const f = S.fitGaussian(x);
  check("AIC = 2k - 2logL", Math.abs(S.akaike(f) - (2*f.k - 2*f.logLikelihood)) < 1e-12);
  check("BIC = k ln n - 2logL", Math.abs(S.bayes(f, 100) - (f.k*Math.log(100) - 2*f.logLikelihood)) < 1e-12);
  const rows = S.compare(x);
  check("compare reports a zero delta for the best model",
    Math.min(...rows.map(r=>r.deltaAic)) === 0 && Math.min(...rows.map(r=>r.deltaBic)) === 0);
}

/* 7. Recovery: correct model should win AIC when the DGP matches */
{
  const heavy = tsample(rng(61), 400, 3, 0, 1);
  const rowsH = S.compare(heavy);
  const winnerH = rowsH.reduce((a,b)=>a.aic<b.aic?a:b).label;
  check("t(3) data -> Student t wins AIC", winnerH === "Student t", `won: ${winnerH}`);

  const normal = gauss(rng(62), 400, 0, 1);
  const rowsN = S.compare(normal);
  const winnerN = rowsN.reduce((a,b)=>a.bic<b.bic?a:b).label;
  check("gaussian data -> Gaussian wins BIC", winnerN === "Gaussian", `won: ${winnerN}`);
}

console.log(failures ? `\n${failures} FAILURE(S)` : "\nall checks passed");
process.exit(failures ? 1 : 0);
