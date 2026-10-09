import type { CSSProperties } from 'react';
import { productGroups } from '@/data/products';

export function ProductsSection() {
  return <section className="products" id="menu" aria-labelledby="products-title">
    <h2 id="products-title">Produk Lainnya</h2>
    {productGroups.map(group => <div className="product-group" key={group.name}>
      <h3>{group.name}</h3>
      <div className="product-grid">{group.items.map((product, index) => <article key={product.id} className={`product-card ${group.kind} ${((index + (group.name === 'Non-Coffee' ? 1 : 0)) % 2) ? 'cool' : 'warm'}`}>
        <h4 className="sr-only">{product.name}</h4>
        <img className="product-photo" src={group.kind === 'bun' ? '/images/bun.webp' : '/images/iced-drink.webp'} alt="" width={group.kind === 'bun' ? 922 : 277} height={group.kind === 'bun' ? 689 : 423} loading="lazy" />
        <img className="product-label" src={`/images/label-${product.id}.svg`} alt="" width={product.labelWidth} height={product.labelHeight} style={{ '--label-width': `${product.labelWidth / 422.33 * 100}%`, '--label-top': `${product.labelTop / 414.75 * 100}%` } as CSSProperties} loading="lazy" />
      </article>)}</div>
    </div>)}
  </section>;
}
