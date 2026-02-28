import styles from "./tiles-section.module.css";

export function TilesSection() {
  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        <div className={`${styles.tile} ${styles.tileIntro}`}>
          <h2 className={styles.title}>
            <strong>Foundational AI,</strong> built and battle-hardened for
            enterprise.
          </h2>
        </div>

        <div className={`${styles.tile} ${styles.tileMedia}`}>
          <div aria-hidden="true" className={styles.mediaFrame}>
            <video
              className={styles.video}
              preload="none"
              playsInline
              muted
              loop
              autoPlay
              width={1120}
              height={1120}
            >
              <source type="video/mp4" src="/agents.mp4" />
            </video>
          </div>
          <div className={styles.tileBody}>
            <div className={styles.tileHeading}>
              Agents and Multi-Agent Orchestration
            </div>
            <p>
              Single and multi-agent systems that can plan, use tools and
              execute in sandboxed environments. Governed by policies and
              end-to-end traces.
            </p>
          </div>
        </div>

        <div className={`${styles.tile} ${styles.tileMedia}`}>
          <div aria-hidden="true" className={styles.mediaFrame}>
            <video
              className={styles.video}
              preload="none"
              playsInline
              muted
              loop
              autoPlay
              width={1120}
              height={1120}
            >
              <source type="video/mp4" src="/web-experiences.mp4" />
            </video>
          </div>
          <div className={styles.tileBody}>
            <div className={styles.tileHeading}>Developer Surfaces</div>
            <p>
              IDE extensions, binaries and workflows that move with your
              engineers.
            </p>
          </div>
        </div>

        <div className={`${styles.tile} ${styles.tileMedia}`}>
          <div aria-hidden="true" className={styles.mediaFrame}>
            <video
              className={styles.video}
              preload="none"
              playsInline
              muted
              loop
              autoPlay
              width={1120}
              height={1120}
            >
              <source type="video/mp4" src="/api.mp4" />
            </video>
          </div>
          <div className={styles.tileBody}>
            <div className={styles.tileHeading}>Data and Knowledge</div>
            <p>
              Connectors to repositories, databases, data warehouses and private
              corpora within strict boundaries.
            </p>
          </div>
        </div>

        <div className={`${styles.tile} ${styles.tileMedia}`}>
          <div aria-hidden="true" className={styles.mediaFrame}>
            <video
              className={styles.video}
              preload="none"
              playsInline
              muted
              loop
              autoPlay
              width={1120}
              height={1120}
            >
              <source type="video/mp4" src="/ide.mp4" />
            </video>
          </div>
          <div className={styles.tileBody}>
            <div className={styles.tileHeading}>Foundation Models</div>
            <p>
              Poolside Foundation Models deployed in your environment. Measured
              against evaluations created together with you.
            </p>
          </div>
        </div>

        <a href="/platform" className={`${styles.tile} ${styles.tileCta}`}>
          <div className={styles.ctaContent}>
            <span className={styles.ctaTitle}>
              <strong>Delivering intelligence across your development</strong>
              ecosystem&mdash;from IDE to terminal, agents to custom
              applications.
            </span>
            <div className={styles.ctaFooter}>
              <span className={styles.ctaEmphasis}>
                <strong>Everywhere work gets done.</strong>
              </span>
              <span className={styles.ctaLink}>
                <span aria-hidden="true" className={styles.ctaArrow}>
                  &rarr;
                </span>
                The Poolside platform
              </span>
            </div>
          </div>
        </a>
      </div>
    </section>
  );
}
