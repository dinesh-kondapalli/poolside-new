"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import styles from "./scroll-message-section.module.css";

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function segmentProgress(progress: number, start: number, end: number) {
  return clamp((progress - start) / (end - start), 0, 1);
}

function smoothstep(value: number) {
  return value * value * (3 - 2 * value);
}

function getMorphState(progress: number) {
  if (progress < 0.22) {
    return { from: "data", to: "data", mix: 0 };
  }

  if (progress < 0.46) {
    return {
      from: "data",
      to: "models",
      mix: segmentProgress(progress, 0.22, 0.46),
    };
  }

  if (progress < 0.72) {
    return { from: "models", to: "models", mix: 0 };
  }

  if (progress < 0.94) {
    return {
      from: "models",
      to: "future",
      mix: segmentProgress(progress, 0.72, 0.94),
    };
  }

  return { from: "future", to: "future", mix: 0 };
}

export function ScrollMessageSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const section = sectionRef.current;

      if (!section) {
        return;
      }

      const rect = section.getBoundingClientRect();
      const total = Math.max(section.offsetHeight - window.innerHeight, 1);
      const traveled = clamp(-rect.top, 0, total);
      setProgress(traveled / total);
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  const morph = getMorphState(progress);
  const wordWidths: Record<string, number> = {
    data: 2.45,
    models: 3.6,
    future: 3.05,
  };
  const activeWidth = Math.max(
    wordWidths[morph.from] ?? 3.2,
    wordWidths[morph.to] ?? 3.2,
  );
  const easedMix = smoothstep(morph.mix);
  const isMorphing = morph.from !== morph.to;
  const inReveal = isMorphing ? clamp((easedMix - 0.1) / 0.9, 0, 1) : 1;
  const outReveal = isMorphing ? 1 - clamp(easedMix / 0.82, 0, 1) : 1;
  const jitter = isMorphing
    ? (Math.sin(progress * 240) + Math.sin(progress * 110)) * 0.5
    : 0;

  return (
    <section className={styles.section} ref={sectionRef}>
      <span className={styles.srOnly}>
        Your data. Your models. Your future.
      </span>
      <div aria-hidden="true" className={styles.stickyFrame}>
        <div className={styles.inner}>
          <div className={styles.line}>
            <span className={styles.staticWord}>Your</span>
            <span
              className={styles.morphWord}
              style={
                {
                  "--in-reveal": inReveal,
                  "--out-reveal": outReveal,
                  "--jitter": jitter,
                  "--word-width": `${activeWidth}em`,
                } as CSSProperties
              }
            >
              <span className={styles.layerOut} data-text={morph.from}>
                {morph.from}
              </span>
              <span className={styles.layerIn} data-text={morph.to}>
                {morph.to}
              </span>
            </span>
            <span className={styles.staticWord}>.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
