import { Link } from 'react-router-dom';
import { ArrowUpRight, Clock3, MapPin } from 'lucide-react';
import { discountPercent, formatKzt, pickupWindow } from '../utils/catalog.js';
import { imageSrc } from '../utils/imageSrc.js';

export function BagCard({ bag, priority = false }) {
  const soldOut = bag.quantity === 0;
  return <article className={`bag-card ${soldOut ? 'is-sold-out' : ''}`}>
    <Link className="bag-image-link" to={`/bags/${bag.id}`} aria-label={`View ${bag.title} from ${bag.businessName}`}>
      <img src={imageSrc(bag.image)} alt={`Food photograph illustrating ${bag.title}`} width="1000" height="750" loading={priority ? 'eager' : 'lazy'} />
      <span className="discount-tag">SAVE {discountPercent(bag)}%</span>
    </Link>
    <div className="bag-body">
      <div className="bag-topline"><span className="category-label">{bag.category}</span><span className={`availability ${soldOut ? 'sold-out' : ''}`}>{soldOut ? 'Sold out' : `${bag.quantity} left`}</span></div>
      <h3><Link to={`/bags/${bag.id}`}>{bag.title}</Link></h3>
      <p className="business-name">{bag.businessName}</p>
      <div className="bag-meta"><span><MapPin size={15} />{bag.district}, Almaty</span><span><Clock3 size={15} />{pickupWindow(bag)}</span></div>
      <div className="bag-bottom"><div className="prices"><del>{formatKzt(bag.originalPrice)}</del><strong>{formatKzt(bag.price)}</strong></div><Link to={`/bags/${bag.id}`} className="card-action">View bag <ArrowUpRight size={17} /></Link></div>
    </div>
  </article>;
}
