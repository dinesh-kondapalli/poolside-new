import styles from "./foundation-section.module.css";

export function FoundationSection() {
  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        <h2 className={styles.heading}>
          <strong>We build foundation models</strong> to transform how work gets
          done in the enterprise.
        </h2>
        <div aria-hidden="true" className={styles.videoFrame}>
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
            <source type="video/mp4" src="/cube.mp4" />
          </video>
        </div>
        <div className={styles.story}>
          <div>
            <p>
              We are a frontier lab focused on building the most capable
              Foundation Models, agents and enterprise systems to deploy them.
            </p>
            <p>
              Our mission is for artificial general intelligence to drive
              abundance for humanity.
            </p>
          </div>
          <div>
            <p>
              This work begins in the highest-consequence
              environments&mdash;enterprises&mdash;where Poolside is being
              battle-tested daily.
            </p>
            <p>
              Helping enterprises become agentic organizations by mobilizing the
              most important technological development of our lifetimes.
              Starting with software.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
