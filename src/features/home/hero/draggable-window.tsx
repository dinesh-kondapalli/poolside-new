import type { PointerEvent as ReactPointerEvent } from "react";
import styles from "./draggable-window.module.css";
import type { HeroWindowPreset } from "./window-presets";

type DraggableWindowProps = {
  preset: HeroWindowPreset;
  position: {
    x: number;
    y: number;
  };
  zIndex: number;
  isDragging: boolean;
  onPointerDown: (event: ReactPointerEvent<HTMLDivElement>, id: string) => void;
};

export function DraggableWindow({
  preset,
  position,
  zIndex,
  isDragging,
  onPointerDown,
}: DraggableWindowProps) {
  const textStyleClass = preset.textStyle
    ? styles[preset.textStyle]
    : styles.headline;

  return (
    <div
      className={`${styles.window} ${styles[preset.variant]} ${isDragging ? styles.dragging : ""}`}
      data-window-id={preset.id}
      onPointerDown={(event) => onPointerDown(event, preset.id)}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        width: `${preset.width}px`,
        height: `${preset.height}px`,
        zIndex,
      }}
    >
      <div className={styles.chrome}>
        <div className={styles.controls}>
          <span
            aria-hidden
            className={`${styles.control} ${styles.minimize}`}
          />
          <span
            aria-hidden
            className={`${styles.control} ${styles.maximize}`}
          />
          <span aria-hidden className={`${styles.control} ${styles.close}`} />
        </div>
      </div>

      <div className={styles.content}>
        {preset.text ? (
          <p className={`${styles.text} ${textStyleClass}`}>{preset.text}</p>
        ) : null}
      </div>
    </div>
  );
}
