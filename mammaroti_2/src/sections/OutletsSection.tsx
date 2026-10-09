import { outletColumns, exclusiveOutlets, type OutletRegion } from '@/data/outlets';

function OutletCard({ region }: { region: OutletRegion }) {
  return <article className={`outlet-card ${region.className ?? ''}`}>
    <h4>{region.name}</h4>
    <ul>{region.places.map(place => <li key={place}>{place}</li>)}</ul>
  </article>;
}

export function OutletsSection() {
  return <section id="outlet" className="outlets" aria-labelledby="outlets-title">
    <h2 id="outlets-title">Outlet Kami</h2>
    <h3>130+ Store</h3>
    <div className="outlet-grid">{outletColumns.map((column, index) => <div className="outlet-column" key={index}>{column.map(region => <OutletCard key={region.name} region={region} />)}</div>)}</div>
    <h3 className="exclusive-title">Exclusive Store</h3>
    <div className="exclusive-grid">{exclusiveOutlets.map(region => <OutletCard key={region.name} region={region} />)}</div>
  </section>;
}
