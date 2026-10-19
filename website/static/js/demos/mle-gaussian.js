/*
 * Maximum likelihood under a choice of data generating process.
 *
 * The sample comes from whichever distribution is selected; three models are
 * then fitted to it by maximum likelihood and scored. Every generator is
 * standardised to the same mean and variance, so switching between them
 * changes the *shape* of the data and nothing else -- which is precisely what
 * the information criteria are being asked to detect.
 */
(() => {
  const TAU = 2 * Math.PI;
  const GRID = 240;

  const gaussianPdf = (x, mean, sd) => DemoStats.normalPdf(x, mean, sd);

  /* ---------- data generating processes ---------- */

  // A standard t has variance df/(df-2); dividing by that keeps the spread
  // comparable with the Gaussian, so only tail weight differs.
  const tScale = (df) => Math.sqrt(df / (df - 2));

  // An equal mixture split by `gap` carries variance sd^2 + (gap/2)^2, so the
  // components are narrowed to hold the total variance fixed.
  const componentSd = (sigma, gap) =>
    Math.sqrt(Math.max(sigma * sigma - (gap / 2) ** 2, 1e-6));

  function generate(params, rng) {
    const { n, mu, sigma } = params;
    if (params.dgp === "student") {
      const df = Math.round(params.df);
      const scale = sigma / tScale(df);
      return Array.from({ length: n }, () => {
        let chiSquare = 0;
        for (let i = 0; i < df; i += 1) chiSquare += rng.normal() ** 2;
        return mu + (scale * rng.normal()) / Math.sqrt(chiSquare / df);
      });
    }
    if (params.dgp === "mixture") {
      const gap = params.gap * sigma;
      const sd = componentSd(sigma, gap);
      return Array.from({ length: n }, () =>
        rng.normal(mu + (rng.uniform() < 0.5 ? -gap / 2 : gap / 2), sd)
      );
    }
    return rng.normalSample(n, mu, sigma);
  }

  function trueDensity(params) {
    const { mu, sigma } = params;
    if (params.dgp === "student") {
      const df = Math.round(params.df);
      const scale = sigma / tScale(df);
      return (x) => DemoStats.studentPdf(x, mu, scale, df);
    }
    if (params.dgp === "mixture") {
      const gap = params.gap * sigma;
      const sd = componentSd(sigma, gap);
      return (x) =>
        0.5 * gaussianPdf(x, mu - gap / 2, sd) + 0.5 * gaussianPdf(x, mu + gap / 2, sd);
    }
    return (x) => gaussianPdf(x, mu, sigma);
  }

  const fittedDensity = (fit) => {
    if (fit.label === "Student t") return (x) => DemoStats.studentPdf(x, fit.location, fit.scale, fit.df);
    if (fit.label === "Gaussian mixture") return (x) => DemoStats.mixturePdf(x, fit.components);
    return (x) => gaussianPdf(x, fit.mu, fit.sigma);
  };

  const format = (value, places = 2) =>
    Number.isFinite(value) ? value.toFixed(places) : "—";

  Demos.register("mle-gaussian", {
    aspect: (width) => (width > 640 ? 0.42 : 0.95),
    notice:
      "Switch the data generating process and watch the table, not the curve. The Gaussian " +
      "fit barely moves — it only ever reports a mean and a variance — while the criteria " +
      "register that the shape it is reporting them for has changed.",

    params: {
      dgp: {
        label: "data generating process",
        value: "gaussian",
        choices: [
          { value: "gaussian", label: "Gaussian" },
          { value: "student", label: "Student t (heavy tails)" },
          { value: "mixture", label: "Two-component mixture" },
        ],
      },
      n: { min: 20, max: 500, value: 120, step: 1, label: "sample size n" },
      mu: { min: -3, max: 3, value: 1, step: 0.1, label: "true mu" },
      sigma: { min: 0.2, max: 3, value: 1, step: 0.1, label: "true sigma" },
      df: {
        min: 3,
        max: 30,
        value: 4,
        step: 1,
        label: "t degrees of freedom",
        showWhen: (params) => params.dgp === "student",
      },
      gap: {
        min: 0,
        max: 1.9,
        value: 1.6,
        step: 0.1,
        label: "component separation (sigmas)",
        showWhen: (params) => params.dgp === "mixture",
      },
    },

    init(params, rng) {
      const sample = generate(params, rng);
      const fits = DemoStats.compare(sample);
      const gaussian = fits.find((fit) => fit.label === "Gaussian");
      const best = fits.reduce((a, b) => (a.aic <= b.aic ? a : b));
      return { sample, fits, gaussian, best };
    },

    draw(ctx, state, params, size, theme, panel) {
      const { sample, gaussian, best } = state;
      const wide = size.width > 640;
      const gutter = 10;
      const width = wide ? (size.width - gutter) / 2 : size.width;
      const height = wide ? size.height : (size.height - gutter) / 2;
      const rects = [
        { x: 0, y: 0, width, height },
        wide
          ? { x: width + gutter, y: 0, width, height }
          : { x: 0, y: height + gutter, width, height },
      ];

      // Both panels share an x axis, so the estimate lines up under the data.
      const span = 4 * params.sigma;
      const xDomain = [params.mu - span, params.mu + span];
      const xTicks = [
        params.mu - 2 * params.sigma,
        params.mu,
        params.mu + 2 * params.sigma,
      ];
      const grid = Array.from(
        { length: GRID },
        (_, index) => xDomain[0] + ((xDomain[1] - xDomain[0]) * index) / (GRID - 1)
      );

      /* ---- sample, true density, fitted densities ---- */

      const truth = trueDensity(params);
      const headroom = Math.max(
        ...grid.map(truth),
        1 / (gaussian.sigma * Math.sqrt(TAU))
      );
      const left = panel(rects[0], {
        title: `sample: mu-hat = ${format(gaussian.mu)}, sigma-hat = ${format(gaussian.sigma)}`,
        xDomain,
        yDomain: [0, headroom * 1.55],
        xTicks,
        yTicks: [0, Number(headroom.toFixed(2))],
      });

      const bins = Math.min(32, Math.max(8, Math.round(Math.sqrt(sample.length) * 1.6)));
      const binWidth = (xDomain[1] - xDomain[0]) / bins;
      const counts = new Array(bins).fill(0);
      for (const value of sample) {
        const index = Math.floor((value - xDomain[0]) / binWidth);
        if (index >= 0 && index < bins) counts[index] += 1;
      }
      counts.forEach((count, index) => {
        const from = xDomain[0] + index * binWidth;
        left.bar(from, from + binWidth, count / (sample.length * binWidth), "rgb(100 255 218 / 14%)");
      });

      for (const value of sample) {
        left.curve([[value, 0], [value, headroom * 0.09]], "rgb(184 199 224 / 40%)", 1);
      }

      left.curve(grid.map((x) => [x, truth(x)]), theme.warning, 1.5, true);
      left.curve(grid.map((x) => [x, gaussianPdf(x, gaussian.mu, gaussian.sigma)]), theme.accent, 2);

      const legend = [
        { label: "truth", color: theme.warning, dashed: true },
        { label: "Gaussian fit", color: theme.accent, dashed: false },
      ];
      if (best.label !== "Gaussian") {
        const alternative = fittedDensity(best);
        left.curve(grid.map((x) => [x, alternative(x)]), "#c792ea", 2);
        legend.push({ label: `${best.label} fit`, color: "#c792ea", dashed: false });
      }
      left.legend(legend);

      /* ---- log-likelihood in mu, under the Gaussian model ---- */

      const standardError = gaussian.sigma / Math.sqrt(sample.length);
      const atPeak = DemoStats.fitGaussian(sample).logLikelihood;
      const profile = grid.map((value) => {
        let total = 0;
        for (const x of sample) total += Math.log(gaussianPdf(x, value, gaussian.sigma));
        return [value, total - atPeak];
      });

      const right = panel(rects[1], {
        title: "log-likelihood in mu, peak at 0",
        xDomain,
        yDomain: [-16, 1],
        xTicks,
        yTicks: [0, -4, -8, -12, -16],
      });

      right.shade(
        gaussian.mu - 1.96 * standardError,
        gaussian.mu + 1.96 * standardError,
        "rgb(100 255 218 / 12%)"
      );
      right.curve(profile, theme.accent, 2);
      right.marker(params.mu, theme.warning, "true mu", true, 1);
      right.marker(gaussian.mu, theme.accent, "mu-hat", false, 0);
    },

    stats(state) {
      const { sample, fits, gaussian, best } = state;
      const n = sample.length;
      // Fisher information for the mean of a Gaussian, evaluated at the fit.
      const information = n / (gaussian.sigma * gaussian.sigma);

      const describe = (fit) => {
        if (fit.label === "Student t") {
          return fit.df >= 200 ? "df > 200 (Gaussian limit)" : `df = ${format(fit.df, 1)}`;
        }
        if (fit.label === "Gaussian mixture") {
          const centres = fit.components.map((part) => format(part.mean)).join(" and ");
          return `centres ${centres}`;
        }
        return `mu-hat = ${format(fit.mu)}, sigma-hat = ${format(fit.sigma)}`;
      };

      return {
        strip: [
          { label: "Fisher information I(mu-hat) = n / sigma-hat²", value: format(information, 1) },
          { label: "standard error 1 / sqrt(I)", value: format(1 / Math.sqrt(information), 3) },
        ],
        table: {
          columns: ["model", "fitted", "k", "log L", "ΔAIC", "ΔBIC"],
          rows: fits.map((fit) => [
            fit.label,
            describe(fit),
            String(fit.k),
            format(fit.logLikelihood, 1),
            format(fit.deltaAic, 1),
            format(fit.deltaBic, 1),
          ]),
          best: fits.indexOf(best),
          caption:
            "Both criteria are shown as gaps from the best model, because only differences " +
            "between models carry meaning. Lower is better; the highlighted row wins on AIC.",
        },
      };
    },
  });
})();
