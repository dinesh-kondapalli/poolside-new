import Image from "next/image";
import Link from "next/link";
import styles from "./vision-section.module.css";

export function VisionSection() {
  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        <div className={styles.mediaFrame}>
          <Image
            alt="Poolside vision illustration"
            className={styles.media}
            src="/download.png"
            fill
            sizes="(max-width: 767px) 100vw, 28vw"
          />
        </div>

        <h2 className={styles.heading}>
          Our vision&mdash;
          <strong>the fastest path to AGI runs through software.</strong>
        </h2>

        <div className={styles.bodyWrap}>
          <div className={styles.copy}>
            <p>
              <strong>Our mission is</strong>: for artificial general
              intelligence to drive abundance for humanity.
            </p>
            <p>
              We&apos;ve chosen software engineering as our strategic beachhead
              because we believe it&apos;s the fastest route to human-level
              intelligence.
            </p>
            <p>
              Software development requires understanding the world, the ability
              to do multistep complex reasoning, and the ability to plan across
              long-horizon objectives. In other words, software development
              mirrors human reasoning. Humans learn by grokking the why as well
              as the what, and reinforcement learning allows foundation models
              to do the same.
            </p>
            <p>
              By building models with these capabilities, we&apos;re building
              toward a future where AI drives down costs of goods and services
              while accelerating scientific progress.
            </p>
            <p>
              So we&apos;re starting with the hardest problems first:
              high-consequence software for high-consequence applications,
              charting the path to human-level AI.
            </p>
          </div>

          <Link className={styles.cta} href="/vision/research">
            <span aria-hidden="true">&rarr;</span> Our path to AGI
          </Link>
        </div>
      </div>
    </section>
  );
}
