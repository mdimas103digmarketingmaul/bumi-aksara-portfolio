/**
 * Site configuration — the only file you should need to touch for
 * links, contact channels and the future Cal.com integration.
 * See README.md → "Konfigurasi" for step-by-step instructions.
 */

export const site = {
  name: 'Thufeil M. Tyansah, CFP®',
  fullName: 'Thufeil Muhammad Tyansah',
  role: 'Gen-Z Financial Planner',
  title: 'Thufeil M. Tyansah, CFP® | Gen-Z Financial Planner',
  description:
    'Perencana keuangan syariah bersertifikat CFP®. Financial check-up, investasi dan asuransi syariah, pelunasan utang, hingga zakat dan waris. Konsultasi awal gratis 30 menit.',
  locale: 'id_ID',

  /**
   * Production URL, without trailing slash, e.g. 'https://thufeil.id'.
   * Leave empty until the domain is decided: canonical and og:url are
   * omitted while this is empty.
   */
  siteUrl: '',

  /** Social preview image, served from /public. */
  ogImage: '/og-image.jpg',
} as const;

export const links = {
  instagram: 'https://www.instagram.com/thufeil.cfp/',
  instagramHandle: '@thufeil.cfp',
  /** Opens a DM thread with the account in the Instagram app/web. */
  instagramDm: 'https://ig.me/m/thufeil.cfp',
  /** Official planner profile, includes a consultation request form. */
  ifacProfile: 'https://www.ifac.or.id/thufeil/',
  ifac: 'https://www.ifac.or.id/',
} as const;

/**
 * ─── Cal.com booking ─────────────────────────────────────────────
 * 1. Create the event "Free 30-Minute Financial Consultation" on Cal.com.
 * 2. Paste the public event URL below, e.g.
 *      'https://cal.com/thufeil/konsultasi-30-menit'
 * 3. Set `enabled` to true.
 * The consultation section then renders the Cal.com calendar inline and
 * every "Jadwalkan Konsultasi" button keeps pointing to it. No layout change
 * is needed.
 */
export const booking = {
  enabled: false,
  calUrl: '',
  durationMinutes: 30,
};

/**
 * ─── WhatsApp ────────────────────────────────────────────────────
 * Number in international format, digits only, e.g. '6281234567890'.
 * Set `enabled` to true once the number is filled in. Until then the
 * WhatsApp button renders as a non-interactive, disabled control.
 */
export const whatsapp = {
  enabled: false,
  number: '',
  /** Pre-filled message when the chat opens. */
  message: 'Halo Thufeil, saya ingin menjadwalkan konsultasi gratis 30 menit.',
};

// ─── Derived helpers (no need to edit) ───────────────────────────

export const isBookingLive = booking.enabled && /^https:\/\//.test(booking.calUrl);

export const isWhatsappLive = whatsapp.enabled && /^\d{8,15}$/.test(whatsapp.number);

export const whatsappHref = isWhatsappLive
  ? `https://wa.me/${whatsapp.number}?text=${encodeURIComponent(whatsapp.message)}`
  : null;

/** Where every "book a consultation" CTA on the page points. */
export const bookingAnchor = '#konsultasi';
