"use client";

import { useEffect, useRef } from "react";
import styles from "./hero-section.module.css";

// ─── constants ───────────────────────────────────────────────────────────────

// Visible tail segments per trail (tail follows the moving head)
const TRAIL_SEGMENTS = 62;
const SEGMENT_SPACING = 0.028;
const TRAIL_COUNT = 12;
const LOOP_PERIOD = 2.24;

const SPAWN_Y = -1.12; // just below camera bottom  (world y = -1)

const menuItems = [
  "Platform",
  "Approach",
  "Vision",
  "Careers",
  "Blog",
  "Newsroom",
  "Events",
];

// ─── helpers ─────────────────────────────────────────────────────────────────

function rng(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function positiveMod(value: number, modulus: number) {
  return ((value % modulus) + modulus) % modulus;
}

// ─── types ───────────────────────────────────────────────────────────────────

type Trail = {
  ox: number; // spawn x  (world coords)
  oy: number; // spawn y  (world coords) – always SPAWN_Y
  dx: number; // horizontal drift per unit of vertical travel  ← diagonal lean
  waveAmp: number; // lateral sine amplitude                        ← S-curve depth
  waveFreq: number; // lateral sine frequency
  wavePhase: number; // lateral sine phase offset
  speed: number; // world-units / second
  s: number; // total distance travelled upward
};

// ─── component ───────────────────────────────────────────────────────────────

export function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvasWrapRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Mutable state updated by the resize handler
    let W = 0; // CSS pixel width  of the canvas
    let H = 0; // CSS pixel height of the canvas
    let xLimit = 1; // world x half-extent = W / H
    let dpr = 1;

    // ── coordinate converters (close over W / H / xLimit) ──────────────────
    // World x ∈ [-xLimit, +xLimit] → CSS px [0, W]
    // World y ∈ [-1, +1]           → CSS px [H, 0]  (y-flip)
    const wx2cx = (wx: number) => ((wx + xLimit) / (2 * xLimit)) * W;
    const wy2cy = (wy: number) => ((1 - wy) / 2) * H;

    // ── resize ──────────────────────────────────────────────────────────────
    const resize = () => {
      const r = container.getBoundingClientRect();
      if (!r.width || !r.height) return;
      W = r.width;
      H = r.height;
      xLimit = W / H;
      dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      // Let CSS keep the display size at W×H (width/height: 100%)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // ── trail spawner ────────────────────────────────────────────────────────
    const spawnTrail = (t: Trail, index: number, stagger = false) => {
      const half = Math.floor(TRAIL_COUNT / 2);
      const isLeftGroup = index < half;
      const laneIndex = isLeftGroup ? index : index - half;
      const laneCount = isLeftGroup ? half : TRAIL_COUNT - half;
      const laneT = laneCount > 1 ? laneIndex / (laneCount - 1) : 0.5;

      const laneStart = isLeftGroup ? -xLimit * 1.0 : xLimit * 0.22;
      const laneEnd = isLeftGroup ? -xLimit * 0.22 : xLimit * 1.0;
      const laneWidth = laneEnd - laneStart;

      t.ox =
        laneStart + laneWidth * laneT + rng(-xLimit * 0.012, xLimit * 0.012);
      t.oy = SPAWN_Y;
      // Keep all trails moving in the same global direction (upward-right)
      t.dx = 0.23 + laneT * 0.11 + rng(-0.01, 0.01);
      // Smooth S-curves with consistent upward flow
      t.waveAmp = rng(0.12, 0.19);
      t.waveFreq = rng(1.0, 1.6);
      t.wavePhase =
        laneT * Math.PI * 1.15 + (isLeftGroup ? 0.2 : 0.9) + rng(-0.17, 0.17);
      t.speed = rng(0.42, 0.62);
      // Stagger positions so heads are distributed through the loop
      const baseOffset = (index / TRAIL_COUNT) * LOOP_PERIOD;
      t.s = stagger
        ? baseOffset + rng(0.12, 0.12 + LOOP_PERIOD / TRAIL_COUNT)
        : baseOffset + 0.12;
    };

    // ── create trails ────────────────────────────────────────────────────────
    const trails: Trail[] = Array.from({ length: TRAIL_COUNT }, (_, i) => {
      const t: Trail = {
        ox: 0,
        oy: SPAWN_Y,
        dx: 0,
        waveAmp: 0,
        waveFreq: 0,
        wavePhase: 0,
        speed: 0,
        s: 0,
      };
      spawnTrail(t, i, true);
      return t;
    });

    // ── resize observer ──────────────────────────────────────────────────────
    const observer = new ResizeObserver(() => {
      resize();
      trails.forEach((t, i) => {
        spawnTrail(t, i, true);
      });
    });
    observer.observe(container);
    resize();

    // ── animation loop ───────────────────────────────────────────────────────
    let raf = 0;
    let prev = performance.now();
    let speedBoost = 1;

    const handleTap = () => {
      speedBoost = Math.min(speedBoost + 0.28, 2.8);
    };

    const resetSpeed = () => {
      speedBoost = 1;
    };

    container.addEventListener("pointerdown", handleTap);
    container.addEventListener("pointerleave", resetSpeed);
    container.addEventListener("pointercancel", resetSpeed);

    const draw = (now: number) => {
      const dt = Math.min((now - prev) / 1000, 0.05);
      prev = now;

      // Clear to background colour
      ctx.fillStyle = "#1a1a1a";
      ctx.fillRect(0, 0, W, H);

      const drawDiamond = (cx: number, cy: number, size: number, alpha = 1) => {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(cx, cy);
        ctx.rotate(Math.PI / 4);
        ctx.fillStyle = "#e8faff";
        ctx.fillRect(-size / 2, -size / 2, size, size);
        ctx.restore();
        ctx.globalAlpha = 1;
      };

      // Ease back toward normal speed if user stops interacting.
      speedBoost = Math.max(1, speedBoost - dt * 0.52);

      for (const t of trails) {
        t.s += dt * t.speed * speedBoost;

        // ── build tail polyline from tail → moving head ────────────────────
        // Head repeats with modular travel; tail is only drawn behind the
        // current head within this cycle, so the line travels with the cube.

        const headSkMod = positiveMod(t.s, LOOP_PERIOD);
        const subpaths: Array<Array<{ x: number; y: number }>> = [];
        let currentPath: Array<{ x: number; y: number }> = [];
        let prevSkWrapped = -1;
        let tailPoint: { x: number; y: number } | null = null;

        for (let k = TRAIL_SEGMENTS - 1; k >= 0; k -= 1) {
          const segDistance = k * SEGMENT_SPACING;
          const skRaw = headSkMod - segDistance;
          const skWrapped = skRaw >= 0 ? skRaw : skRaw + LOOP_PERIOD;

          const progress = Math.min(skWrapped / LOOP_PERIOD, 1);
          const curveRamp = 0.35 + 0.65 * Math.sin(progress * Math.PI) ** 0.72;
          const wx =
            t.ox +
            t.dx * skWrapped +
            t.waveAmp *
              curveRamp *
              Math.sin(skWrapped * t.waveFreq + t.wavePhase);
          const wy = t.oy + skWrapped;

          const point = { x: wx2cx(wx), y: wy2cy(wy) };

          if (!tailPoint) {
            tailPoint = point;
          }

          if (currentPath.length === 0) {
            currentPath.push(point);
          } else if (skWrapped < prevSkWrapped - 1.0) {
            subpaths.push(currentPath);
            currentPath = [point];
          } else {
            currentPath.push(point);
          }

          prevSkWrapped = skWrapped;
        }

        if (currentPath.length > 0) {
          subpaths.push(currentPath);
        }

        if (subpaths.length > 0) {
          const drawTrail = (
            lineWidth: number,
            strokeStyle: string,
            alpha: number,
          ) => {
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.globalAlpha = alpha;
            ctx.strokeStyle = strokeStyle;
            ctx.lineWidth = lineWidth;
            for (const path of subpaths) {
              if (path.length < 2) continue;
              ctx.beginPath();
              ctx.moveTo(path[0].x, path[0].y);
              for (let i = 1; i < path.length; i += 1) {
                ctx.lineTo(path[i].x, path[i].y);
              }
              ctx.stroke();
            }
          };

          // Soft glow pass (wide, translucent)
          drawTrail(4, "#9de0f8", 0.14);

          // Main line pass (crisp, opaque)
          drawTrail(1.6, "#b8ecff", 0.92);

          ctx.globalAlpha = 1;
        }

        // ── diamond head ───────────────────────────────────────────────────
        const headProgress = Math.min(headSkMod / LOOP_PERIOD, 1);
        const headCurveRamp =
          0.35 + 0.65 * Math.sin(headProgress * Math.PI) ** 0.72;
        const headWx =
          t.ox +
          t.dx * headSkMod +
          t.waveAmp *
            headCurveRamp *
            Math.sin(headSkMod * t.waveFreq + t.wavePhase);
        const headWy = t.oy + headSkMod;

        // Only draw the head when it's in (or just entering) the canvas
        const d = Math.max(10, H * 0.024);

        if (headWy > -1.05 && headWy < 1.15) {
          drawDiamond(wx2cx(headWx), wy2cy(headWy), d, 1);
        }

        if (tailPoint) {
          const tail = tailPoint;
          if (tail.y >= -20 && tail.y <= H + 20) {
            drawDiamond(tail.x, tail.y, d * 0.72, 0.84);
          }
        }
      }

      raf = window.requestAnimationFrame(draw);
    };

    raf = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(raf);
      observer.disconnect();
      container.removeEventListener("pointerdown", handleTap);
      container.removeEventListener("pointerleave", resetSpeed);
      container.removeEventListener("pointercancel", resetSpeed);
    };
  }, []);

  return (
    <section className={styles.hero}>
      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <p className={styles.brand}>poolside</p>
          <nav aria-label="Hero links" className={styles.menu}>
            {menuItems.map((item) => (
              <button className={styles.menuItem} key={item} type="button">
                {item}
              </button>
            ))}
          </nav>
        </aside>

        <div className={styles.canvasFrame} ref={canvasWrapRef}>
          <canvas className={styles.canvas} ref={canvasRef} />

          <div className={styles.overlay}>
            <h1 className={styles.headline}>
              <span className={styles.headlineLine}>We build the models.</span>
              <span className={styles.headlineLine}>You build the future.</span>
            </h1>
            <p className={styles.subline}>
              AGI for the enterprise — starting with software agents.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
