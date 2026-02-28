import Image from "next/image";
import Link from "next/link";
import styles from "./outcomes-section.module.css";

const items = [
  {
    title: "Outcome ownership",
    body: "We don't hand off models. We take joint responsibility for outcomes, adoption and measurable, long-lasting business impact.",
  },
  {
    title: "Inside your security boundary",
    body: "Deploy on-prem, in your VPC or on workstations (defense only). Your data never leaves your control. Role-based access control for humans and agents by default.",
  },
  {
    title: "Built for complex environments",
    body: "We work across heterogeneous environments: multi-cloud, legacy systems and air-gapped networks. No rip-and-replace.",
  },
  {
    title: "Executive-grade governance",
    body: "Risk controls and auditability as a feature, co-designed in the toughest environments. All aligned to enterprise review boards and CISO requirements.",
  },
];

export function OutcomesSection() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <Image
          alt=""
          aria-hidden="true"
          className={styles.diagram}
          src="/outcomes-diagram.svg"
          width={1125}
          height={408}
        />

        <div className={styles.content}>
          <div className={styles.leftCol}>
            <h2 className={styles.headline}>
              Outcomes, not tokens. Inside your boundary.
            </h2>
            <p className={styles.subhead}>
              Forward Deployed Research Engineers embed with your teams to
              design, build, and operate intelligence where your software work
              actually happens.
            </p>
          </div>

          <div className={styles.rightCol}>
            {items.map((item) => (
              <article className={styles.item} key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}

            <Link className={styles.cta} href="/our-approach">
              <span aria-hidden="true">&rarr;</span> Our approach
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
