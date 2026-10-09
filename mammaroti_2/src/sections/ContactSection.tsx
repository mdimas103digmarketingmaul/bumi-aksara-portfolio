import { BrandPattern } from '@/components/BrandPattern';
import { ContactForm } from '@/components/ContactForm';

export function ContactSection() {
  return <section id="kontak" className="contact" aria-labelledby="contact-title">
    <BrandPattern />
    <div className="contact-copy">
      <h2 id="contact-title">Kamu punya saran, kritik, atau pertanyaan?</h2>
      <p>kamu bisa bantu Mammaroti berkembang lebih baik, sampaikan kritik, saran, dan pertanyaan kamu.</p>
    </div>
    <ContactForm />
  </section>;
}
