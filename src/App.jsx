import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Header } from './components/Header.jsx';
import { Footer } from './components/Footer.jsx';
import { defaultFilters } from './components/CatalogControls.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { BagDetailsPage } from './pages/BagDetailsPage.jsx';
import { AddBagPage } from './pages/AddBagPage.jsx';
import { ReservationsPage } from './pages/ReservationsPage.jsx';
import { NotFoundPage } from './pages/NotFoundPage.jsx';

export default function App() {
  // Kept above Routes so browsing preferences survive a trip to a detail page.
  const [catalogFilters, setCatalogFilters] = useState(defaultFilters);
  const location = useLocation();
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (location.hash) {
        document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView();
      } else {
        window.scrollTo(0, 0);
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [location.pathname, location.hash]);
  return <><Header /><main id="main-content"><Routes>
    <Route path="/" element={<HomePage filters={catalogFilters} setFilters={setCatalogFilters} />} />
    <Route path="/bags/:id" element={<BagDetailsPage />} />
    <Route path="/add" element={<AddBagPage />} />
    <Route path="/reservations" element={<ReservationsPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes></main><Footer /></>;
}
