/**
 * Configuration for the main page (/). The persona, contact details and
 * numbers here are placeholders for the design proposal, not a real client.
 *
 * src/config/site.ts is kept as-is because the /option-2/ route imports it.
 */

export const site = {
  name: 'Haikal R. Pradana, CFP®',
  fullName: 'Haikal Rasyid Pradana',
  firstName: 'Haikal',
  lockup: 'R. Pradana',
  role: 'Gen-Z Financial Planner',
  title: 'Haikal R. Pradana, CFP® | Gen-Z Financial Planner',
  description:
    'Perencana keuangan syariah bersertifikat CFP®. Financial check-up, investasi dan asuransi syariah, pelunasan utang, hingga zakat dan waris. Konsultasi awal gratis 30 menit.',
  locale: 'id_ID',
  location: 'Bandung, Indonesia',
  /** Social preview image, served from /public. */
  ogImage: '/og-image.jpg',
} as const;

/**
 * Placeholder contact details. They are rendered as text and disabled
 * buttons only, never as links, until real accounts are connected.
 */
export const contact = {
  instagramHandle: '@haikal.cfp',
  threadsHandle: '@haikal.cfp',
  whatsappDisplay: '+62 812-0000-0000',
} as const;

/**
 * ─── Cal.com booking ─────────────────────────────────────────────
 * Paste the public event URL and set `enabled` to true to embed the
 * calendar inline in the consultation section.
 */
export const booking = {
  enabled: false,
  calUrl: '',
  durationMinutes: 30,
};

export const isBookingLive = booking.enabled && /^https:\/\//.test(booking.calUrl);

/** Where every "book a consultation" CTA on the page points. */
export const bookingAnchor = '#konsultasi';
