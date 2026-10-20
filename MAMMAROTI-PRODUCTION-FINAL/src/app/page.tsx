import { Nav } from '@/components/Nav';
import { HeroScene } from '@/components/HeroScene';
import { DoughSwitch } from '@/components/DoughSwitch';
import { Certifications } from '@/components/Certifications';
import { MenuStage } from '@/components/MenuStage';
import { OutletFinder } from '@/components/OutletFinder';
import { Partnership } from '@/components/Partnership';
import { InstagramStrip } from '@/components/InstagramStrip';
import { ContactBlock } from '@/components/ContactBlock';
import { Footer } from '@/components/Footer';
import root from '@/styles/root.module.css';

export default function Home() {
  return (
    <div className={root.root}>
      <a className={root.skip} href="#mr-main">Lewati ke konten</a>
      <Nav />
      <main id="mr-main">
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
