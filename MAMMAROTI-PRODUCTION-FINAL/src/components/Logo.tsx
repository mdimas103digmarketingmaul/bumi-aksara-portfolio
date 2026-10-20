import type { CSSProperties } from 'react';
import root from '@/styles/root.module.css';

type Props = {
  variant?: 'wordmark' | 'lockup' | 'wheat';
  className?: string;
  /** Accessible name. Pass null when the logo is decorative / labelled by a parent link. */
  label?: string | null;
};

const ratio = { wordmark: 1200 / 403, lockup: 1400 / 538, wheat: 360 / 553 } as const;
const file = { wordmark: 'logo-wordmark.webp', lockup: 'logo-lockup.webp', wheat: 'wheat-mark.webp' } as const;

/** Supplied MammaRoti artwork used as a CSS mask, so its colour follows `color`. */
export function Logo({ variant = 'wordmark', className, label = 'MammaRoti' }: Props) {
  const style = { '--logo-src': `url(/logos/${file[variant]})`, aspectRatio: String(ratio[variant]) } as CSSProperties;
  return (
    <span
      className={`${root.logo} ${className ?? ''}`}
      style={style}
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
    />
  );
}
