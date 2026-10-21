import { useMemo } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Hero } from '../components/Hero.jsx';
import { HowItWorks } from '../components/HowItWorks.jsx';
import { BagCard } from '../components/BagCard.jsx';
import { CatalogControls, defaultFilters } from '../components/CatalogControls.jsx';
import { Pagination } from '../components/Pagination.jsx';
import { EmptyState, ErrorState, LoadingSkeleton } from '../components/States.jsx';
import { useBags } from '../hooks/useBags.js';
import { filterAndSortBags, paginate } from '../utils/catalog.js';

export function HomePage({ filters, setFilters }) {
  const { bags, status, error, retry } = useBags();
  const results = useMemo(() => filterAndSortBags(bags, filters), [bags, filters]);
  const pageData = useMemo(() => paginate(results, filters.page), [results, filters.page]);
  const change = (field, value) => setFilters((current) => ({ ...current, [field]: value, page: 1 }));
  const clear = () => setFilters(defaultFilters);
  const changePage = (page) => setFilters((current) => ({ ...current, page }));
  return <>
    <Hero />
    <HowItWorks />
    <section className="catalog-section container" id="catalog" aria-labelledby="catalog-title">
      <div className="section-header"><div><p className="eyebrow">THE DAILY FIND</p><h2 id="catalog-title">Explore what's <em>on the menu.</em></h2><p>Good food from local spots, collected in one place.</p></div><span className="demo-note">Fictional demo offers · Almaty</span></div>
      {status === 'loading' && <LoadingSkeleton />}
      {status === 'error' && <ErrorState message={error} onRetry={retry} />}
      {status === 'success' && <>
        <CatalogControls filters={filters} onChange={change} onClear={clear} resultCount={results.length} />
        {results.length === 0 ? <EmptyState onClear={clear} /> : <><div className="bag-grid">{pageData.items.map((bag, index) => <BagCard key={bag.id} bag={bag} priority={index < 3} />)}</div><Pagination page={pageData.currentPage} pageCount={pageData.pageCount} onPage={changePage} /></>}
      </>}
    </section>
    <section className="closing-banner"><div className="container closing-inner"><div><p className="eyebrow">HAVE SOMETHING GOOD LEFT?</p><h2>Make room for <em>another chance.</em></h2><p>Add a fictional listing to try the seller flow in this student demo.</p></div><Link className="button button-light" to="/add">List a surprise bag <ArrowUpRight size={18} /></Link></div></section>
  </>;
}
