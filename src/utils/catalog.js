export const PAGE_SIZE = 12;

export function discountPercent(bag) {
  return Math.round((1 - bag.price / bag.originalPrice) * 100);
}

export function formatKzt(amount) {
  return `₸${new Intl.NumberFormat('en-US').format(amount)}`;
}

export function pickupWindow(bag) {
  return `${bag.pickupStart}–${bag.pickupEnd}`;
}

export function filterAndSortBags(bags, filters) {
  const query = filters.search.trim().toLocaleLowerCase();
  const filtered = bags.filter((bag) => {
    const searchable = [bag.title, bag.businessName, bag.description, bag.district, bag.reference].join(' ').toLocaleLowerCase();
    if (query && !searchable.includes(query)) return false;
    if (filters.category !== 'All' && bag.category !== filters.category) return false;
    if (filters.district !== 'All districts' && bag.district !== filters.district) return false;
    if (filters.availableOnly && bag.quantity === 0) return false;
    if (filters.price === 'under' && bag.price >= 2000) return false;
    if (filters.price === 'middle' && (bag.price < 2000 || bag.price > 4000)) return false;
    if (filters.price === 'above' && bag.price <= 4000) return false;
    return true;
  });
  return filtered.sort((a, b) => {
    if (filters.sort === 'price-asc') return a.price - b.price || a.id.localeCompare(b.id);
    if (filters.sort === 'price-desc') return b.price - a.price || a.id.localeCompare(b.id);
    if (filters.sort === 'discount') return discountPercent(b) - discountPercent(a) || a.id.localeCompare(b.id);
    if (filters.sort === 'pickup') return a.pickupStart.localeCompare(b.pickupStart) || a.id.localeCompare(b.id);
    return a.featuredRank - b.featuredRank || a.id.localeCompare(b.id);
  });
}

export function paginate(items, page, pageSize = PAGE_SIZE) {
  const pageCount = Math.ceil(items.length / pageSize);
  const currentPage = Math.min(Math.max(1, page), Math.max(1, pageCount));
  return { items: items.slice((currentPage - 1) * pageSize, currentPage * pageSize), pageCount, currentPage };
}
