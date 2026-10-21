import { Link } from 'react-router-dom';
import { Clock3, MapPin, ArrowUpRight } from 'lucide-react';
import { formatKzt, pickupWindow } from '../utils/catalog.js';

export function ReservationCard({ reservation }) {
  return <article className="reservation-card"><img src={reservation.image} alt={`${reservation.title} surprise bag`} width="160" height="130" loading="lazy" /><div><span className="category-label">DEMO RESERVATION</span><h2>{reservation.title}</h2><p>{reservation.businessName}</p><div className="reservation-meta"><span><MapPin size={15} />{reservation.district}, Almaty</span><span><Clock3 size={15} />{pickupWindow(reservation)}</span></div></div><div className="reservation-end"><span className="status-label">{reservation.status}</span><strong>{formatKzt(reservation.price)}</strong><Link to={`/bags/${reservation.bagId}`}>View bag <ArrowUpRight size={15} /></Link></div></article>;
}
