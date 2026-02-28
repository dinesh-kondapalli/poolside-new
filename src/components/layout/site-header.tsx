import Link from "next/link";
import styles from "./site-header.module.css";

const navItems = [
  { href: "/enterprise", label: "Enterprise" },
  { href: "/news", label: "News" },
  { href: "/careers", label: "Careers" },
];

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <Link className={styles.brand} href="/">
        <span aria-hidden className={styles.logoMark} />
        <span className={styles.logoText}>poolside</span>
      </Link>

      <nav aria-label="Primary" className={styles.navigation}>
        {navItems.map((item) => (
          <Link className={styles.link} href={item.href} key={item.href}>
            {item.label}
          </Link>
        ))}
        <button className={styles.cta} type="button">
          Talk to us
        </button>
      </nav>
    </header>
  );
}
