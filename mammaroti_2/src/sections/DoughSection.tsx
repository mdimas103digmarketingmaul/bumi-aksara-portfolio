import { BrandPattern } from '@/components/BrandPattern';

export function DoughSection({ variant }: { variant: 'original' | 'taro' }) {
  const isOriginal = variant === 'original';
  const fillings = isOriginal ? ['Vanilla Custard', 'Cheese Custard', 'Chocolate Custard', 'Banana Custard'] : ['Vanilla Custard', 'Taro Custard', 'Rasberry Custard'];
  return <section id={variant} className={`dough ${variant}`} aria-labelledby={`${variant}-heading`}>
    <BrandPattern />
    <h2 id={`${variant}-heading`}>Our Dough</h2>
    <div className="dough-names"><a href="#original" className={isOriginal ? 'selected' : ''}>Original</a><a href="#taro" className={!isOriginal ? 'selected' : ''}>Taro</a></div>
    <img className="dough-photo" src={`/images/${variant}-dough.webp`} width="927" height="764" alt={`MammaRoti ${isOriginal ? 'Original' : 'Taro'} dengan isian custard`} loading="lazy" />
    <ul className="fillings">{fillings.map(name => <li key={name}>{name}</li>)}</ul>
    <a href={isOriginal ? '#taro' : '#menu'} className="keep-scrolling">Keep Scrolling...</a>
  </section>;
}
