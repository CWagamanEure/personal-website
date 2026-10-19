/*
 * Distribution fitting shared by the demos.
 *
 * Every fit returns { label, k, logLikelihood, ... } where k counts the free
 * parameters, so the information criteria below can be applied uniformly.
 */
(() => {
  const TAU = 2 * Math.PI;

  // Lanczos approximation, g = 7.
  const LANCZOS = [
    676.5203681218851, -1259.1392167224028, 771.32342877765313,
    -176.61502916214059, 12.507343278686905, -0.13857109526572012,
    9.9843695780195716e-6, 1.5056327351493116e-7,
  ];

  function logGamma(value) {
    if (value < 0.5) {
      return Math.log(Math.PI / Math.sin(Math.PI * value)) - logGamma(1 - value);
    }
    let z = value - 1;
    let series = 0.99999999999980993;
    LANCZOS.forEach((coefficient, index) => {
      series += coefficient / (z + index + 1);
    });
    const t = z + LANCZOS.length - 0.5;
    return 0.5 * Math.log(TAU) + (z + 0.5) * Math.log(t) - t + Math.log(series);
  }

  const normalPdf = (x, mean, sd) =>
    Math.exp(-((x - mean) ** 2) / (2 * sd * sd)) / (sd * Math.sqrt(TAU));

  const studentPdf = (x, location, scale, df) => {
    const u = (x - location) / scale;
    const logDensity =
      logGamma((df + 1) / 2) -
      logGamma(df / 2) -
      0.5 * Math.log(df * Math.PI) -
      Math.log(scale) -
      ((df + 1) / 2) * Math.log(1 + (u * u) / df);
    return Math.exp(logDensity);
  };

  const mixturePdf = (x, components) =>
    components.reduce(
      (total, part) => total + part.weight * normalPdf(x, part.mean, part.sd),
      0
    );

  const mean = (values) => values.reduce((total, v) => total + v, 0) / values.length;

  function median(values) {
    const sorted = [...values].sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
  }

  /* ---------- fits ---------- */

  function fitGaussian(sample) {
    const n = sample.length;
    const mu = mean(sample);
    const variance = mean(sample.map((x) => (x - mu) ** 2));
    // At the MLE the exponent term sums to -n/2, which collapses the whole
    // log-likelihood to this closed form.
    const logLikelihood = -0.5 * n * (Math.log(TAU * variance) + 1);
    return { label: "Gaussian", k: 2, logLikelihood, mu, sigma: Math.sqrt(variance) };
  }

  function studentLogLikelihood(sample, location, scale, df) {
    const n = sample.length;
    const constant =
      logGamma((df + 1) / 2) -
      logGamma(df / 2) -
      0.5 * Math.log(df * Math.PI) -
      Math.log(scale);
    let total = 0;
    for (const x of sample) {
      total += Math.log(1 + ((x - location) / scale) ** 2 / df);
    }
    return n * constant - ((df + 1) / 2) * total;
  }

  /*
   * Location and scale for a fixed df, by EM. The latent scale mixture that
   * makes a t out of a Gaussian gives each point weight (df+1)/(df+d^2),
   * which is what downweights the tails.
   */
  function fitStudentAtDf(sample, df, start, maxIterations = 150) {
    const n = sample.length;
    let location = start.location;
    let scale = start.scale;
    // Reused across iterations; reallocating this each pass dominated the cost.
    const weights = new Float64Array(n);

    for (let iteration = 0; iteration < maxIterations; iteration += 1) {
      let weightTotal = 0;
      let weightedSum = 0;
      for (let i = 0; i < n; i += 1) {
        const d = ((sample[i] - location) / scale) ** 2;
        const w = (df + 1) / (df + d);
        weights[i] = w;
        weightTotal += w;
        weightedSum += w * sample[i];
      }
      const nextLocation = weightedSum / weightTotal;

      let spread = 0;
      for (let i = 0; i < n; i += 1) {
        spread += weights[i] * (sample[i] - nextLocation) ** 2;
      }
      const nextScale = Math.sqrt(Math.max(spread / n, 1e-12));

      const moved =
        Math.abs(nextLocation - location) + Math.abs(nextScale - scale);
      location = nextLocation;
      scale = nextScale;
      if (moved < 1e-9) break;
    }

    return { location, scale, logLikelihood: studentLogLikelihood(sample, location, scale, df) };
  }

  function fitStudentT(sample) {
    const centre = median(sample);
    const spread = median(sample.map((x) => Math.abs(x - centre)));
    const start = { location: centre, scale: Math.max(1.4826 * spread, 1e-6) };

    // Neighbouring df values have near-identical fits, so each sweep step
    // starts from the previous solution rather than from scratch.
    const search = (candidates, maxIterations) => {
      let best = null;
      let warm = start;
      for (const df of candidates) {
        const fit = fitStudentAtDf(sample, df, warm, maxIterations);
        warm = { location: fit.location, scale: fit.scale };
        if (!best || fit.logLikelihood > best.logLikelihood) best = { ...fit, df };
      }
      return best;
    };

    // df is a scale parameter, so sweep it geometrically. The upper end runs
    // far past anything interpretable because the t only reaches the Gaussian
    // in the limit -- stopping early would let the wider family score worse
    // than the family it contains.
    const geometric = (low, high, count) =>
      Array.from({ length: count }, (_, i) =>
        Math.exp(Math.log(low) + (i * (Math.log(high) - Math.log(low))) / (count - 1))
      );

    // Locate the region cheaply, then spend the iterations only where it
    // matters. A loose EM is plenty for ranking candidate df values.
    let best = search(geometric(0.4, 1e6, 26), 25);
    for (const width of [6, 2, 1.25]) {
      best = search(geometric(Math.max(0.3, best.df / width), best.df * width, 13), 60);
    }
    const settled = fitStudentAtDf(sample, best.df, best, 400);
    best = { ...settled, df: best.df };

    return {
      label: "Student t",
      k: 3,
      logLikelihood: best.logLikelihood,
      location: best.location,
      scale: best.scale,
      df: best.df,
    };
  }

  function mixtureLogLikelihood(sample, components) {
    let total = 0;
    for (const x of sample) {
      total += Math.log(Math.max(mixturePdf(x, components), Number.MIN_VALUE));
    }
    return total;
  }

  function fitMixtureFrom(sample, components) {
    const n = sample.length;
    const centre = mean(sample);
    const floor = Math.max(mean(sample.map((x) => (x - centre) ** 2)) * 1e-4, 1e-9);
    let current = components;
    // Reused across iterations; reallocating this each pass dominated the cost.
    const responsibility = new Float64Array(n);

    for (let iteration = 0; iteration < 250; iteration += 1) {
      const [first, second] = current;
      let total0 = 0;
      let sum0 = 0;
      let sum1 = 0;
      for (let i = 0; i < n; i += 1) {
        const x = sample[i];
        const a = first.weight * normalPdf(x, first.mean, first.sd);
        const b = second.weight * normalPdf(x, second.mean, second.sd);
        const denominator = a + b;
        // A point far from both components underflows; hand it to the nearer one.
        const r =
          denominator > 0
            ? a / denominator
            : Math.abs(x - first.mean) < Math.abs(x - second.mean)
              ? 1
              : 0;
        responsibility[i] = r;
        total0 += r;
        sum0 += r * x;
        sum1 += (1 - r) * x;
      }

      const total1 = n - total0;
      const mean0 = total0 > 1e-9 ? sum0 / total0 : first.mean;
      const mean1 = total1 > 1e-9 ? sum1 / total1 : second.mean;

      // Second pass for the variances, around the means just computed.
      let spread0 = 0;
      let spread1 = 0;
      for (let i = 0; i < n; i += 1) {
        const r = responsibility[i];
        spread0 += r * (sample[i] - mean0) ** 2;
        spread1 += (1 - r) * (sample[i] - mean1) ** 2;
      }

      const next = [
        {
          weight: total0 / n,
          mean: mean0,
          sd: Math.sqrt(Math.max(total0 > 1e-9 ? spread0 / total0 : first.sd ** 2, floor)),
        },
        {
          weight: total1 / n,
          mean: mean1,
          sd: Math.sqrt(Math.max(total1 > 1e-9 ? spread1 / total1 : second.sd ** 2, floor)),
        },
      ];

      const shift = next.reduce(
        (sum, part, index) =>
          sum + Math.abs(part.mean - current[index].mean) + Math.abs(part.sd - current[index].sd),
        0
      );
      current = next;
      if (shift < 1e-10) break;
    }

    return { components: current, logLikelihood: mixtureLogLikelihood(sample, current) };
  }

  function fitMixture(sample) {
    const average = mean(sample);
    const sd = Math.sqrt(mean(sample.map((x) => (x - average) ** 2))) || 1e-6;
    const sorted = [...sample].sort((a, b) => a - b);
    const quantile = (p) => sorted[Math.min(sorted.length - 1, Math.floor(p * sorted.length))];

    // EM only finds a local optimum, so start it from two different splits.
    const starts = [
      [
        { weight: 0.5, mean: average - sd, sd },
        { weight: 0.5, mean: average + sd, sd },
      ],
      [
        { weight: 0.5, mean: quantile(0.25), sd: sd / 2 },
        { weight: 0.5, mean: quantile(0.75), sd: sd / 2 },
      ],
    ];

    let best = null;
    for (const start of starts) {
      const fit = fitMixtureFrom(sample, start);
      if (!best || fit.logLikelihood > best.logLikelihood) best = fit;
    }

    return { label: "Gaussian mixture", k: 5, logLikelihood: best.logLikelihood, components: best.components };
  }

  /* ---------- information criteria ---------- */

  const akaike = (fit) => 2 * fit.k - 2 * fit.logLikelihood;
  const bayes = (fit, n) => fit.k * Math.log(n) - 2 * fit.logLikelihood;

  /*
   * Fits every candidate and scores it. Both criteria are reported as
   * differences from the best model, because only differences are meaningful.
   */
  function compare(sample) {
    const n = sample.length;
    const fits = [fitGaussian(sample), fitStudentT(sample), fitMixture(sample)].map((fit) => ({
      ...fit,
      aic: akaike(fit),
      bic: bayes(fit, n),
    }));

    const bestAic = Math.min(...fits.map((fit) => fit.aic));
    const bestBic = Math.min(...fits.map((fit) => fit.bic));
    return fits.map((fit) => ({
      ...fit,
      deltaAic: fit.aic - bestAic,
      deltaBic: fit.bic - bestBic,
    }));
  }

  const api = {
    logGamma,
    normalPdf,
    studentPdf,
    mixturePdf,
    fitGaussian,
    fitStudentT,
    fitMixture,
    studentLogLikelihood,
    mixtureLogLikelihood,
    akaike,
    bayes,
    compare,
  };

  if (typeof window !== "undefined") window.DemoStats = api;
  if (typeof module !== "undefined") module.exports = api;
})();
