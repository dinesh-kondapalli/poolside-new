import { SiteFooter } from "@/components/layout/site-footer";
import { FinalCtaSection } from "@/features/home/final-cta/final-cta-section";
import { FoundationSection } from "@/features/home/foundation/foundation-section";
import { HeroSection } from "@/features/home/hero/hero-section";
import { OutcomesSection } from "@/features/home/outcomes/outcomes-section";
import { ScrollMessageSection } from "@/features/home/scroll-message/scroll-message-section";
import { TilesSection } from "@/features/home/tiles/tiles-section";
import { VisionSection } from "@/features/home/vision/vision-section";
import styles from "./home-page.module.css";

export function HomePage() {
  return (
    <main className={styles.page}>
      <HeroSection />
      <FoundationSection />
      <TilesSection />
      <ScrollMessageSection />
      <OutcomesSection />
      <VisionSection />
      <FinalCtaSection />
      <SiteFooter />
    </main>
  );
}
