import { Header } from "@/components/Header";
import { Divider } from "@/components/Divider";
import { HeroSection } from "@/sections/HeroSection";
import { CertificationStrip } from "@/sections/CertificationStrip";
import { ProductsSection } from "@/sections/ProductsSection";
import { OutletsSection } from "@/sections/OutletsSection";
import { PartnershipSection } from "@/sections/PartnershipSection";
import { NewsSection } from "@/sections/NewsSection";
import { ContactSection } from "@/sections/ContactSection";
import { Footer } from "@/sections/Footer";
import { CompositionFrame } from "../../components/CompositionFrame";
import { SensoryOption3Content } from "../../sections/02-sensory/option-3/Option";
import { DoughOption2Content } from "../../sections/03-dough/option-2/Option";

export default function Composition() {
  return (
    <CompositionFrame label="Composition A" strategy="Natural Flow">
      <a className="skip-link" href="#main">Lewati ke konten</a>
      <Header />
      <main id="main">
        <HeroSection />
        <SensoryOption3Content />
        <Divider />
        <DoughOption2Content />
        <CertificationStrip />
        <ProductsSection />
        <OutletsSection />
        <PartnershipSection />
        <NewsSection />
        <Divider />
        <ContactSection />
      </main>
      <Footer />
    </CompositionFrame>
  );
}
