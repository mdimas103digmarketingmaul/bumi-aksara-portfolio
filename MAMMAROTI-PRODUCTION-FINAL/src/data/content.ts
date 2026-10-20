/**
 * Presentation copy, links and asset lists for the homepage.
 * Product, outlet and address content lives in src/data/products.ts, outlets.ts and site.ts.
 */

/** Official Instagram account. */
export const INSTAGRAM_URL = 'https://www.instagram.com/mammaroti.id/';
export const INSTAGRAM_HANDLE = '@mammaroti.id';

export const navLinks = [
  { href: '#menu', label: 'Menu', id: 'menu' },
  { href: '#kemitraan', label: 'Kemitraan', id: 'kemitraan' },
  { href: '#kontak', label: 'Kritik & Saran', id: 'kontak' },
] as const;

/** Fillings per dough. */
export const doughs = {
  original: {
    label: 'Original',
    fillings: ['Vanilla Custard', 'Cheese Custard', 'Chocolate Custard', 'Banana Custard'],
    alt: 'MammaRoti Original terbelah dua, memperlihatkan isian custard yang lumer',
  },
  taro: {
    label: 'Taro',
    fillings: ['Vanilla Custard', 'Taro Custard', 'Rasberry Custard'],
    alt: 'MammaRoti Taro terbelah dua, memperlihatkan isian custard yang lumer',
  },
} as const;

export type DoughKey = keyof typeof doughs;

/** Flavour colour used as the stage backdrop in the menu. Purely presentational. */
export const flavourColour: Record<string, string> = {
  'rich-chocolate': '#6B3A22',
  'vanilla-banana': '#F4CF4A',
  'vanilla-pandan': '#7DAE5B',
  'vanilla-strawberry': '#EE8193',
  'vanilla-butter': '#F3D58C',
  'choco-almond': '#A9693F',
  'chocolate-cheese': '#C8913A',
  cheese: '#FFCF3F',
  'kopi-gula-aren': '#8A5530',
  'kopi-susu-butterscotch': '#D99A45',
  'kopi-salted-caramel': '#C27A3A',
  'kopi-hazelnut': '#9A6A44',
  'mango-tropical': '#FFAE2A',
  'lemon-tea': '#EFD14B',
  chocolate: '#6B3A22',
  'matcha-latte': '#8DB25F',
};

/** Source product names keep the PDF's odd capitalisation ("Kopi SUsu BUtterscotch"); normalise for display. */
export function displayName(name: string) {
  return name
    .toLowerCase()
    .split(' ')
    .map((word) => (word === '&' ? word : word.charAt(0).toUpperCase() + word.slice(1)))
    .join(' ');
}

/** Certifications and awards. */
export const certificates = [
  { src: `/logos/cert-halal.webp`, w: 300, h: 537, alt: 'Logo Halal Indonesia', text: 'Sertifikasi halal Badan Penyelengara Jaminan Produk Halal' },
  { src: `/logos/cert-pengayoman.webp`, w: 360, h: 394, alt: 'Logo Pengayoman Kementerian Hukum dan HAM', text: 'Telah terdaftar dan berizin Kementrian\nHukum dan Hak Asasi Manusia' },
  { src: `/logos/cert-ifbc.webp`, w: 640, h: 289, alt: 'Logo IFBC Info Franchise & Business Concept Expo', text: 'Most Expansive Brand IFBC 2024' },
] as const;

export const instagramTiles = [
  { src: `/images/instagram/instagram-01.jpg`, alt: 'Outlet MammaRoti dengan dua coffee bun di atas meja' },
  { src: `/images/instagram/instagram-02.jpg`, alt: 'Roti taro ungu dengan isian matcha custard' },
  { src: `/images/instagram/instagram-03.jpg`, alt: 'Coffee bun dalam kantong kuning BAKER di samping mobil' },
  { src: `/images/instagram/instagram-04.jpg`, alt: 'Tiga coffee bun MammaRoti dengan aneka isian' },
  { src: `/images/instagram/instagram-05.jpg`, alt: 'Espresso dituang ke gelas kopi MammaRoti' },
  { src: `/images/instagram/instagram-06.jpg`, alt: 'Menikmati coffee bun MammaRoti di mobil kuning' },
  { src: `/images/instagram/instagram-07.jpg`, alt: 'Taro The Series: deretan coffee bun berwarna ungu' },
  { src: `/images/instagram/instagram-08.jpg`, alt: 'Mango Tropical segar dengan potongan mangga' },
  { src: `/images/instagram/instagram-09.jpg`, alt: 'Dua gelas minuman taro ungu dengan es' },
] as const;

export const WHATSAPP_NUMBER = '6282114409390';
export const WHATSAPP_DISPLAY = '+62 821-1440-9390';
export function whatsappUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
export const PARTNERSHIP_URL = whatsappUrl(
  'Halo tim MammaRoti, saya tertarik untuk bermitra dan membuka outlet MammaRoti. Boleh dibantu informasi mengenai paket kemitraan, biaya investasi, dan proses pendaftarannya? Terima kasih.',
);
export const CONTACT_URL = whatsappUrl(
  'Halo tim MammaRoti, saya ingin bertanya tentang MammaRoti. Mohon bantuannya. Terima kasih.',
);
