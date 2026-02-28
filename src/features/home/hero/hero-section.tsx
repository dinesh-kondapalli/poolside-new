"use client";

import { useEffect, useRef } from "react";
import styles from "./hero-section.module.css";

// ─── constants ───────────────────────────────────────────────────────────────

// Visible tail segments per trail (tail follows the moving head)
const TRAIL_SEGMENTS = 62;
const SEGMENT_SPACING = 0.028;
const TRAIL_COUNT = 12;
const BATCH_COUNT = 3;
const LOOP_PERIOD = 2.24;
const TAIL_LENGTH = (TRAIL_SEGMENTS - 1) * SEGMENT_SPACING;
const BATCH_LAUNCH_GAP = 0.18;
const REENTRY_DELAY = 0.42;
const ACTIVE_PERIOD = LOOP_PERIOD + TAIL_LENGTH;
const CYCLE_PERIOD =
  ACTIVE_PERIOD + (BATCH_COUNT - 1) * BATCH_LAUNCH_GAP + REENTRY_DELAY;

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

function smoothstep(edge0: number, edge1: number, value: number) {
  const t = Math.min(1, Math.max(0, (value - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

// ─── types ───────────────────────────────────────────────────────────────────

type Trail = {
  ox: number; // spawn x  (world coords)
  oy: number; // spawn y  (world coords) – always SPAWN_Y
  laneT: number;
  batchIndex: number;
  baseDx: number;
  baseAmp: number;
  baseFreq: number;
  basePhase: number;
  rightBend: number;
  bendInStart: number;
  bendInEnd: number;
  bendOutStart: number;
  bendOutEnd: number;
  cycle: number;
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
    const applyReentryPattern = (t: Trail, cycle: number) => {
      const pattern = cycle % 3;

      if (pattern === 0) {
        // Type A: mostly straight with a clean mid bend.
        t.dx = t.baseDx;
        t.waveAmp = t.baseAmp;
        t.waveFreq = t.baseFreq;
        t.wavePhase = t.basePhase;
        t.rightBend = 0;
        t.bendInStart = 0.14;
        t.bendInEnd = 0.34;
        t.bendOutStart = 0.6;
        t.bendOutEnd = 0.88;
        return;
      }

      if (pattern === 1) {
        // Type B: more curvy before flattening out near the top.
        t.dx = t.baseDx * 0.95;
        t.waveAmp = t.baseAmp * 1.35;
        t.waveFreq = t.baseFreq * 1.24;
        t.wavePhase = t.basePhase + 0.42;
        t.rightBend = 0.015;
        t.bendInStart = 0.1;
        t.bendInEnd = 0.29;
        t.bendOutStart = 0.66;
        t.bendOutEnd = 0.95;
        return;
      }

      // Type C: stronger right bend profile.
      t.dx = t.baseDx * 1.12;
      t.waveAmp = t.baseAmp * 0.92;
      t.waveFreq = t.baseFreq * 0.9;
      t.wavePhase = t.basePhase - 0.24;
      t.rightBend = 0.12 + t.laneT * 0.05;
      t.bendInStart = 0.16;
      t.bendInEnd = 0.36;
      t.bendOutStart = 0.58;
      t.bendOutEnd = 0.84;
    };

    const spawnTrail = (t: Trail, index: number, stagger = false) => {
      const half = Math.floor(TRAIL_COUNT / 2);
      const isLeftGroup = index < half;
      const laneIndex = isLeftGroup ? index : index - half;
      const laneCount = isLeftGroup ? half : TRAIL_COUNT - half;
      const laneT = laneCount > 1 ? laneIndex / (laneCount - 1) : 0.5;

      const batchIndex = index % BATCH_COUNT;
      const laneStart = isLeftGroup ? -xLimit * 1.0 : xLimit * 0.22;
      const laneEnd = isLeftGroup ? -xLimit * 0.22 : xLimit * 1.0;
      const laneWidth = laneEnd - laneStart;

      t.ox =
        laneStart + laneWidth * laneT + rng(-xLimit * 0.012, xLimit * 0.012);
      t.oy = SPAWN_Y;
      t.laneT = laneT;
      t.batchIndex = batchIndex;

      t.baseDx = 0.23 + laneT * 0.11 + rng(-0.01, 0.01);
      t.baseAmp = rng(0.11, 0.165);
      t.baseFreq = rng(0.72, 1.08);
      t.basePhase =
        laneT * Math.PI * 0.9 + batchIndex * 0.55 + (isLeftGroup ? 0.2 : 0.8);

      t.speed = 0.52;

      // Spawn in repeating grouped waves: every trail in a batch starts together.
      const baseOffset = batchIndex * BATCH_LAUNCH_GAP + 0.08;
      t.s = stagger ? baseOffset : 0.08;

      t.cycle = Math.floor(t.s / CYCLE_PERIOD);
      applyReentryPattern(t, t.cycle);
    };

    // ── create trails ────────────────────────────────────────────────────────
    const trails: Trail[] = Array.from({ length: TRAIL_COUNT }, (_, i) => {
      const t: Trail = {
        ox: 0,
        oy: SPAWN_Y,
        laneT: 0,
        batchIndex: 0,
        baseDx: 0,
        baseAmp: 0,
        baseFreq: 0,
        basePhase: 0,
        rightBend: 0,
        bendInStart: 0.14,
        bendInEnd: 0.34,
        bendOutStart: 0.6,
        bendOutEnd: 0.88,
        cycle: 0,
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

        const cycle = Math.floor(t.s / CYCLE_PERIOD);
        if (cycle !== t.cycle) {
          t.cycle = cycle;
          applyReentryPattern(t, cycle);
        }

        // ── build tail polyline from tail → moving head ────────────────────
        // Head repeats with modular travel; tail is only drawn behind the
        // current head within this cycle, so the line travels with the cube.

        const headTravel = positiveMod(t.s, CYCLE_PERIOD);
        if (headTravel > ACTIVE_PERIOD) {
          continue;
        }

        const points: Array<{ x: number; y: number }> = [];
        let tailPoint: { x: number; y: number } | null = null;

        for (let k = TRAIL_SEGMENTS - 1; k >= 0; k -= 1) {
          const segDistance = k * SEGMENT_SPACING;
          const segmentTravel = headTravel - segDistance;
          if (segmentTravel < 0 || segmentTravel > LOOP_PERIOD) continue;

          const progress = Math.min(segmentTravel / LOOP_PERIOD, 1);
          const bendWindow =
            smoothstep(t.bendInStart, t.bendInEnd, progress) *
            (1 - smoothstep(t.bendOutStart, t.bendOutEnd, progress));
          const curveRamp = 0.06 + 0.94 * bendWindow;
          const wx =
            t.ox +
            t.dx * segmentTravel +
            t.rightBend * bendWindow +
            t.waveAmp *
              curveRamp *
              Math.sin(segmentTravel * t.waveFreq + t.wavePhase);
          const wy = t.oy + segmentTravel;

          const point = { x: wx2cx(wx), y: wy2cy(wy) };

          if (!tailPoint) {
            tailPoint = point;
          }

          points.push(point);
        }

        if (points.length > 1) {
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
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length; i += 1) {
              ctx.lineTo(points[i].x, points[i].y);
            }
            ctx.stroke();
          };

          // Soft glow pass (wide, translucent)
          drawTrail(4, "#9de0f8", 0.14);

          // Main line pass (crisp, opaque)
          drawTrail(1.6, "#b8ecff", 0.92);

          ctx.globalAlpha = 1;
        }

        // ── diamond head ───────────────────────────────────────────────────
        const showHead = headTravel <= LOOP_PERIOD;

        // Only draw the head when it's in (or just entering) the canvas
        const d = Math.max(10, H * 0.024);

        if (showHead) {
          const headProgress = Math.min(headTravel / LOOP_PERIOD, 1);
          const headBendWindow =
            smoothstep(t.bendInStart, t.bendInEnd, headProgress) *
            (1 - smoothstep(t.bendOutStart, t.bendOutEnd, headProgress));
          const headCurveRamp = 0.06 + 0.94 * headBendWindow;
          const headWx =
            t.ox +
            t.dx * headTravel +
            t.rightBend * headBendWindow +
            t.waveAmp *
              headCurveRamp *
              Math.sin(headTravel * t.waveFreq + t.wavePhase);
          const headWy = t.oy + headTravel;

          if (headWy > -1.05 && headWy < 1.15) {
            drawDiamond(wx2cx(headWx), wy2cy(headWy), d, 1);
          }
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
