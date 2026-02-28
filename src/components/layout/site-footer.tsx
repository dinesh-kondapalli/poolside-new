import Link from "next/link";
import styles from "./site-footer.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer} id="footer">
      <div className={styles.navCol}>
        <nav aria-label="Footer">
          <ul>
            <li>
              <Link href="/privacy">Privacy</Link>
            </li>
            <li>
              <a href="/brand/poolside-press-kit.zip">Press kit</a>
            </li>
            <li>
              <a href="/trust" target="_blank" rel="noreferrer">
                Trust
              </a>
            </li>
            <li>
              <a href="https://docs.poolside.ai/">Docs</a>
            </li>
          </ul>
        </nav>

        <div className={styles.themeMock}>
          <span>◧</span>
          <span>☀</span>
          <span>◐</span>
        </div>
      </div>

      <div aria-hidden="true" className={styles.wordmark}>
        poolside
      </div>
    </footer>
  );
}
