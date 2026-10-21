import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { imageSrc } from '../utils/imageSrc.js';

export function Hero() {
  return <section className="hero container" aria-labelledby="hero-title">
    <div className="hero-copy">
      <p className="eyebrow">ALMATY · SURPLUS FOOD MARKETPLACE</p>
      <h1 id="hero-title">Good food,<br /><em>another chance.</em></h1>
      <p className="hero-lead">Discover surprise bags from local cafes, bakeries, and food spots. Save on something delicious while giving good food a second chance.</p>
      <div className="hero-actions"><Link className="button button-primary button-large" to="/#catalog">Explore surprise bags <ArrowUpRight size={18} /></Link><Link className="text-link" to="/#how-it-works">How it works <ArrowDownRight size={18} /></Link></div>
    </div>
    <div className="hero-visual">
      <img src={imageSrc(`${import.meta.env.BASE_URL}images/croissants.jpg`)} width="1000" height="750" alt="Fresh pastries photographed in a cafe" fetchPriority="high" />
      <div className="hero-photo-caption"><span>GOOD THINGS, SAVED DAILY</span><span>01 / ALMATY</span></div>
      <div className="hero-offer"><span className="eyebrow">SURPRISE BAG</span><strong>Evening Bakery Bag</strong><span>From ₸1,290 <ArrowUpRight size={15} /></span></div>
    </div>
  </section>;
}
