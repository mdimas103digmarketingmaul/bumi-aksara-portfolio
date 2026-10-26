// Share contact and booking settings with the main site; keep Option 2 metadata separate.
import { site as sharedSite, links as sharedLinks } from '../../config/site';
export { booking, whatsapp, isBookingLive, isWhatsappLive, whatsappHref, bookingAnchor } from '../../config/site';

export const site = {
  ...sharedSite,
  location: 'Jakarta, Indonesia',
  ogImage: '/option-2/og-image.jpg',
} as const;

export const links = {
  ...sharedLinks,
  threads: 'https://www.threads.com/@thufeil.cfp',
} as const;
