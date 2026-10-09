import { Header } from '@/components/Header';
import { HeroSection } from '@/sections/HeroSection';
import { SensorySection } from '@/sections/SensorySection';
import { DoughSection } from '@/sections/DoughSection';
import { CertificationStrip } from '@/sections/CertificationStrip';
import { ProductsSection } from '@/sections/ProductsSection';
import { OutletsSection } from '@/sections/OutletsSection';
import { PartnershipSection } from '@/sections/PartnershipSection';
import { NewsSection } from '@/sections/NewsSection';
import { ContactSection } from '@/sections/ContactSection';
import { Footer } from '@/sections/Footer';
import { Divider } from '@/components/Divider';

export default function Home() {
  return <>
    <a className="skip-link" href="#main">Lewati ke konten</a>
    <Header />
    <main id="main">
      <HeroSection />
      <SensorySection />
      <Divider />
      <DoughSection variant="original" />
      <DoughSection variant="taro" />
      <CertificationStrip />
      <ProductsSection />
      <OutletsSection />
      <PartnershipSection />
      <NewsSection />
      <Divider />
      <ContactSection />
    </main>
    <Footer />
  </>;
}
