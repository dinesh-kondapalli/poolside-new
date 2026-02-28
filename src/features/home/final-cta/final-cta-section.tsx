import Link from "next/link";
import styles from "./final-cta-section.module.css";

const rows = [
  {
    href: "/contact",
    title: "Is Poolside right for your business?",
    action: "Talk to us today",
  },
  {
    href: "/careers",
    title: "Join the forefront of applied research and engineering.",
    action: "View roles",
  },
];

export function FinalCtaSection() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        {rows.map((row) => (
          <Link className={styles.row} href={row.href} key={row.href}>
            <h3>{row.title}</h3>
            <span className={styles.action}>
              <span aria-hidden="true">&rarr;</span>
              {row.action}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
