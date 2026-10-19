/*
 * Shared harness for in-article demos.
 *
 * A demo declares its parameters, how to build state from them, and how to
 * draw that state. The harness owns everything else: slider construction,
 * seeded randomness, canvas sizing, and the animation loop.
 *
 *   Demos.register("my-demo", {
 *     params: {
 *       n: { min: 5, max: 500, value: 50, step: 1, label: "sample size" },
 *       shape: { choices: [{ value: "a", label: "A" }], value: "a", label: "shape" },
 *       df: { min: 3, max: 30, value: 6, label: "df", showWhen: (p) => p.shape === "a" },
 *     },
 *     init: (p, rng) => ({ sample: rng.normalSample(p.n) }),
 *     step: (state, p, rng) => {},        // optional; presence starts a RAF loop
 *     draw: (ctx, state, p, size) => {},
 *     stats: (state, p) => ({ strip: [...], table: {...} }),   // optional
 *   });
 */
(() => {
  const demos = new Map();

  function register(name, spec) {
    demos.set(name, spec);
  }

  /* ---------- seeded randomness ---------- */

  function createRandom(seed) {
    let state = seed >>> 0;
    let spare = null;

    const uniform = () => {
      state = (state + 0x6d2b79f5) >>> 0;
      let t = state;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };

    // Box-Muller, caching the second variate so pairs are not wasted.
    const normal = (mean = 0, deviation = 1) => {
      if (spare !== null) {
        const value = spare;
        spare = null;
        return mean + deviation * value;
      }
      const radius = Math.sqrt(-2 * Math.log(1 - uniform()));
      const angle = 2 * Math.PI * uniform();
      spare = radius * Math.sin(angle);
      return mean + deviation * radius * Math.cos(angle);
    };

    return {
      uniform,
      normal,
      normalSample: (count, mean, deviation) =>
        Array.from({ length: count }, () => normal(mean, deviation)),
    };
  }

  /* ---------- drawing ---------- */

  function readTheme() {
    const styles = getComputedStyle(document.body);
    const value = (name, fallback) =>
      styles.getPropertyValue(name).trim() || fallback;

    return {
      text: value("--color-text", "#ccd6f6"),
      muted: value("--color-text-muted", "#b8c7e0"),
      accent: value("--color-accent", "#64ffda"),
      warning: value("--color-warning", "#f9a826"),
      border: value("--color-border", "#3a5a78"),
      surface: value("--color-surface", "#0a192f"),
      font: styles.fontFamily || "monospace",
    };
  }

  const format = (value) =>
    Math.abs(value) >= 100 || Number.isInteger(value)
      ? String(Math.round(value))
      : value.toFixed(Math.abs(value) < 1 ? 2 : 1);

  /*
   * Draws a framed plotting area and returns scale functions plus a few
   * primitives that work in data coordinates.
   */
  function panel(ctx, theme, rect, options) {
    const pad = { top: 26, right: 12, bottom: 30, left: 40 };
    const plot = {
      left: rect.x + pad.left,
      right: rect.x + rect.width - pad.right,
      top: rect.y + pad.top,
      bottom: rect.y + rect.height - pad.bottom,
    };
    const [x0, x1] = options.xDomain;
    const [y0, y1] = options.yDomain;

    const x = (value) =>
      plot.left + ((value - x0) / (x1 - x0)) * (plot.right - plot.left);
    const y = (value) =>
      plot.bottom - ((value - y0) / (y1 - y0)) * (plot.bottom - plot.top);

    ctx.save();
    ctx.fillStyle = theme.surface;
    ctx.fillRect(plot.left, plot.top, plot.right - plot.left, plot.bottom - plot.top);
    ctx.strokeStyle = theme.border;
    ctx.lineWidth = 1;
    ctx.strokeRect(plot.left, plot.top, plot.right - plot.left, plot.bottom - plot.top);

    ctx.fillStyle = theme.muted;
    ctx.font = `11px ${theme.font}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    for (const tick of options.xTicks || []) {
      ctx.fillText(format(tick), x(tick), plot.bottom + 6);
    }
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    for (const tick of options.yTicks || []) {
      ctx.fillText(format(tick), plot.left - 6, y(tick));
    }

    if (options.title) {
      ctx.fillStyle = theme.text;
      ctx.font = `12px ${theme.font}`;
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
      ctx.fillText(options.title, plot.left, rect.y + 14);
    }
    ctx.restore();

    const clip = (draw) => {
      ctx.save();
      ctx.beginPath();
      ctx.rect(plot.left, plot.top, plot.right - plot.left, plot.bottom - plot.top);
      ctx.clip();
      draw();
      ctx.restore();
    };

    return {
      x,
      y,
      plot,
      clip,
      curve(points, color, width = 2, dashed = false) {
        clip(() => {
          ctx.beginPath();
          ctx.setLineDash(dashed ? [4, 4] : []);
          ctx.strokeStyle = color;
          ctx.lineWidth = width;
          points.forEach(([px, py], index) => {
            const method = index === 0 ? "moveTo" : "lineTo";
            ctx[method](x(px), y(py));
          });
          ctx.stroke();
          ctx.setLineDash([]);
        });
      },
      bar(from, to, height, color) {
        clip(() => {
          ctx.fillStyle = color;
          ctx.fillRect(x(from), y(height), x(to) - x(from), y(0) - y(height));
        });
      },
      marker(value, color, label, dashed = false, row = 0) {
        clip(() => {
          ctx.beginPath();
          ctx.setLineDash(dashed ? [4, 4] : []);
          ctx.strokeStyle = color;
          ctx.lineWidth = 1.5;
          ctx.moveTo(x(value), plot.top);
          ctx.lineTo(x(value), plot.bottom);
          ctx.stroke();
          ctx.setLineDash([]);
          if (label) {
            ctx.fillStyle = color;
            ctx.font = `11px ${theme.font}`;
            ctx.textAlign = x(value) > (plot.left + plot.right) / 2 ? "right" : "left";
            ctx.textBaseline = "top";
            const offset = ctx.textAlign === "right" ? -5 : 5;
            ctx.fillText(label, x(value) + offset, plot.top + 4 + row * 14);
          }
        });
      },
      legend(entries) {
        ctx.save();
        ctx.font = `11px ${theme.font}`;
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        let y = plot.top + 10;
        for (const entry of entries) {
          const width = ctx.measureText(entry.label).width;
          const right = plot.right - 8;
          ctx.beginPath();
          ctx.setLineDash(entry.dashed ? [4, 3] : []);
          ctx.strokeStyle = entry.color;
          ctx.lineWidth = 2;
          ctx.moveTo(right - width - 22, y);
          ctx.lineTo(right - width - 6, y);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.fillStyle = theme.muted;
          ctx.fillText(entry.label, right - width, y);
          y += 15;
        }
        ctx.restore();
      },
      shade(from, to, color) {
        clip(() => {
          ctx.fillStyle = color;
          ctx.fillRect(x(from), plot.top, x(to) - x(from), plot.bottom - plot.top);
        });
      },
    };
  }

  /* ---------- mounting ---------- */

  function mount(container, spec) {
    const params = {};
    for (const [key, config] of Object.entries(spec.params || {})) {
      params[key] = config.value;
    }

    const figure = document.createElement("figure");
    figure.className = "demo-figure";

    const canvas = document.createElement("canvas");
    canvas.className = "demo-canvas";
    figure.append(canvas);

    const controls = document.createElement("div");
    controls.className = "demo-controls";
    figure.append(controls);

    const fields = [];
    for (const [key, config] of Object.entries(spec.params || {})) {
      const field = document.createElement("label");
      field.className = config.choices ? "demo-field demo-field-choice" : "demo-field";

      const name = document.createElement("span");
      name.className = "demo-field-name";
      name.textContent = config.label || key;
      field.append(name);

      if (config.choices) {
        const select = document.createElement("select");
        select.className = "demo-select";
        for (const choice of config.choices) {
          const option = document.createElement("option");
          option.value = choice.value;
          option.textContent = choice.label;
          select.append(option);
        }
        select.value = config.value;
        select.addEventListener("change", () => {
          params[key] = select.value;
          refreshVisibility();
          reset();
        });
        field.append(select);
      } else {
        const readout = document.createElement("span");
        readout.className = "demo-field-value";
        readout.textContent = String(config.value);

        const slider = document.createElement("input");
        slider.type = "range";
        slider.min = config.min;
        slider.max = config.max;
        slider.step = config.step ?? 0.01;
        slider.value = config.value;
        // A wheel over a range input changes its value, so a reader scrolling
        // past the demo would scramble it. Scroll the page by hand instead.
        slider.addEventListener(
          "wheel",
          (event) => {
            event.preventDefault();
            window.scrollBy(0, event.deltaMode === 1 ? event.deltaY * 16 : event.deltaY);
          },
          { passive: false }
        );
        slider.addEventListener("input", () => {
          params[key] = Number(slider.value);
          readout.textContent = slider.value;
          reset();
        });

        field.append(readout, slider);
      }

      fields.push({ key, config, field });
      controls.append(field);
    }

    // Parameters that only apply to one branch of a choice stay hidden
    // elsewhere, so the control row never offers a knob that does nothing.
    const refreshVisibility = () => {
      for (const { config, field } of fields) {
        const visible = !config.showWhen || config.showWhen(params);
        field.hidden = !visible;
      }
    };
    refreshVisibility();

    const actions = document.createElement("div");
    actions.className = "demo-actions";

    const reseed = document.createElement("button");
    reseed.type = "button";
    reseed.className = "demo-button";
    reseed.textContent = "new sample";
    actions.append(reseed);
    controls.append(actions);

    const statsHost = document.createElement("div");
    statsHost.className = "demo-stats";
    if (spec.stats) figure.append(statsHost);

    if (spec.notice) {
      const caption = document.createElement("figcaption");
      caption.className = "demo-notice";
      caption.textContent = spec.notice;
      figure.append(caption);
    }

    container.append(figure);

    const context = canvas.getContext("2d");
    const theme = readTheme();
    let seed = 1;
    let state = null;
    let size = { width: 0, height: 0 };

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      const width = canvas.clientWidth;
      const aspect =
        typeof spec.aspect === "function" ? spec.aspect(width) : spec.aspect || 0.5;
      const height = Math.round(width * aspect);
      canvas.style.height = `${height}px`;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      size = { width, height };
    };

    const renderStats = () => {
      if (!spec.stats) return;
      const { strip = [], table } = spec.stats(state, params) || {};
      statsHost.replaceChildren();

      if (strip.length) {
        const row = document.createElement("dl");
        row.className = "demo-strip";
        for (const item of strip) {
          const term = document.createElement("dt");
          term.textContent = item.label;
          const value = document.createElement("dd");
          value.textContent = item.value;
          row.append(term, value);
        }
        statsHost.append(row);
      }

      if (table) {
        const element = document.createElement("table");
        element.className = "demo-table";
        const head = element.insertRow();
        for (const column of table.columns) {
          const cell = document.createElement("th");
          cell.textContent = column;
          head.append(cell);
        }
        table.rows.forEach((cells, index) => {
          const row = element.insertRow();
          if (index === table.best) row.className = "is-best";
          cells.forEach((value) => {
            row.insertCell().textContent = value;
          });
        });
        statsHost.append(element);
        if (table.caption) {
          const caption = document.createElement("p");
          caption.className = "demo-table-caption";
          caption.textContent = table.caption;
          statsHost.append(caption);
        }
      }
    };

    const render = () => {
      if (!size.width) return;
      context.clearRect(0, 0, size.width, size.height);
      spec.draw(context, state, params, size, theme, (rect, options) =>
        panel(context, theme, rect, options)
      );
      renderStats();
    };

    // A drag can fire input events faster than frames; collapsing them keeps
    // one rebuild per frame however expensive the demo's init is.
    let pending = false;
    const reset = () => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => {
        pending = false;
        state = spec.init ? spec.init(params, createRandom(seed)) : {};
        render();
      });
    };

    reseed.addEventListener("click", () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      reset();
    });

    new ResizeObserver(() => {
      resize();
      render();
    }).observe(canvas);

    resize();
    state = spec.init ? spec.init(params, createRandom(seed)) : {};
    render();

    if (spec.step) {
      const rng = createRandom(seed);
      const tick = () => {
        spec.step(state, params, rng);
        render();
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }

    // Re-read colours only after fonts settle, so labels are not measured
    // against a fallback family.
    if (document.fonts) document.fonts.ready.then(render);
  }

  window.Demos = { register, createRandom };

  window.addEventListener("DOMContentLoaded", () => {
    for (const container of document.querySelectorAll("[data-demo]")) {
      const spec = demos.get(container.dataset.demo);
      if (!spec) {
        container.textContent = `Demo "${container.dataset.demo}" failed to load.`;
        container.classList.add("demo-missing");
        continue;
      }
      mount(container, spec);
    }
  });
})();
