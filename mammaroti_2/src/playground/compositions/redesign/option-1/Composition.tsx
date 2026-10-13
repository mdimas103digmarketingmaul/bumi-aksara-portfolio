import { Nav } from './components/Nav';
import { HeroScene } from './components/HeroScene';
import { DoughSwitch } from './components/DoughSwitch';
import { Certifications } from './components/Certifications';
import { MenuStage } from './components/MenuStage';
import { OutletFinder } from './components/OutletFinder';
import { Partnership } from './components/Partnership';
import { InstagramStrip } from './components/InstagramStrip';
import { ContactBlock } from './components/ContactBlock';
import { Footer } from './components/Footer';
import root from './root.module.css';

/**
 * Alternative UI/UX Redesign — Option 1: "Pull-apart".
 * Full homepage, isolated from production. Content is read from src/data/*.
 * Berita & Acara is intentionally removed per brief.
 */
export function RedesignOption1() {
  return (
    <div className={root.root}>
      <a className={root.skip} href="#o1-main">Lewati ke konten</a>
      <Nav />
      <main id="o1-main">
        <HeroScene />
        <DoughSwitch />
        <Certifications />
        <MenuStage />
        <OutletFinder />
        <Partnership />
        <InstagramStrip />
        <ContactBlock />
      </main>
      <Footer />
    </div>
  );
}
