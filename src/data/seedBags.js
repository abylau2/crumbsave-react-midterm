// Fictional businesses and demo listings. IDs, prices and display order stay stable across reloads.
export const CATEGORIES = ['Bakery', 'Meals', 'Produce', 'Desserts', 'Groceries', 'Drinks'];
export const DISTRICTS = ['Bostandyk', 'Medeu', 'Almaly', 'Auezov', 'Turksib', 'Zhetysu', 'Alatau', 'Nauryzbay'];
const assetBase = typeof import.meta.env === 'object' ? import.meta.env.BASE_URL : '/';

const collections = [
  {
    category: 'Bakery', base: 1290,
    titles: ['Evening Bakery Bag', 'The Last Loaves', 'Pastry Counter Pick', 'Bread & Something Sweet', 'Morning Bake Rescue'],
    businesses: ['Warm Corner', 'Flour & Fold', 'Little Oven', 'The Crust Room', 'June Bakery'],
    details: ['A changing selection of breads and pastries baked today.', 'A few good things from the bakery counter, chosen at closing.', 'Freshly baked favorites with a little mystery in every bag.', 'Expect a mix of savory and sweet bakery finds.', 'A generous end-of-day pick from the oven and pastry case.'],
    images: ['croissants', 'bakery-bread', 'bakery-counter']
  },
  {
    category: 'Meals', base: 2890,
    titles: ['Kitchen Closing Bag', 'Lunch Table Finds', 'Good Dinner Mix', 'A Little of Everything', 'The Savory Surprise'],
    businesses: ['Olive Table', 'Mellow Kitchen', 'Saffron Street', 'Local Plate', 'Basil House'],
    details: ['Prepared food from today’s kitchen, packed for an easy meal.', 'A satisfying mix of kitchen favorites available after service.', 'One lovely surprise from the hot and cold counter.', 'Today’s prepared dishes, selected by the kitchen team.', 'A ready-to-enjoy combination that changes with the menu.'],
    images: ['grain-bowl', 'fresh-meal', 'pizza', 'dinner']
  },
  {
    category: 'Produce', base: 1190,
    titles: ['Market Harvest Bag', 'Fresh Produce Pick', 'Fruit & Greens Mix', 'The Garden Selection', 'Colorful Market Bag'],
    businesses: ['Green Basket', 'Orchard Room', 'Fresh Lane', 'The Daily Market', 'Garden Shelf'],
    details: ['A practical mix of seasonal fruit and vegetables.', 'Good produce with small imperfections and plenty of flavor.', 'A colorful selection from today’s market shelves.', 'Fresh picks that deserve a place in tomorrow’s meal.', 'Fruit and greens selected from the day’s remaining stock.'],
    images: ['produce', 'fruit', 'greens']
  },
  {
    category: 'Desserts', base: 1390,
    titles: ['Sweet Closing Bag', 'Cake Counter Surprise', 'Afternoon Treat Mix', 'The Dessert Edit', 'A Little Sweetness'],
    businesses: ['Butter Note', 'Sugar & Stone', 'Mila Patisserie', 'Soft Crumb', 'Cocoa Corner'],
    details: ['A changing selection of cakes and small sweet treats.', 'Desserts made today, chosen from the remaining counter.', 'Something sweet for later, with the exact mix kept a surprise.', 'A thoughtful selection from today’s pastry display.', 'Small-batch sweets available at the end of the day.'],
    images: ['cake', 'dessert', 'brunch']
  },
  {
    category: 'Groceries', base: 3290,
    titles: ['Everyday Essentials Bag', 'Pantry & Fresh Mix', 'The Grocery Rescue', 'Good Things Bundle', 'Neighborhood Shop Bag'],
    businesses: ['Everyday Pantry', 'Corner Goods', 'Little Market', 'The Good Shelf', 'Market House'],
    details: ['A useful mix of fresh and pantry items from today’s stock.', 'Everyday groceries picked by the shop team.', 'A surprise bundle of food with plenty of good use left.', 'Fresh and shelf-stable finds selected at closing.', 'A small grocery haul with a different mix each day.'],
    images: ['produce', 'brunch', 'salad']
  },
  {
    category: 'Drinks', base: 990,
    titles: ['Coffee Break Bag', 'Cafe Closing Pick', 'Something to Sip', 'The Afternoon Pairing', 'Coffee & Treat Surprise'],
    businesses: ['Small Hours Cafe', 'North Cup', 'Calm Coffee', 'Paper Cup', 'Daylight Cafe'],
    details: ['A cafe surprise with drinks or a snack, depending on the day.', 'A small pick from the cafe counter at closing.', 'A good cup and a little extra, prepared by the cafe team.', 'Cafe favorites saved for one more happy break.', 'A changing coffee-shop selection for your afternoon.'],
    images: ['coffee-pour', 'coffee-cup', 'croissants']
  }
];

const pickupWindows = [['17:30', '19:00'], ['18:00', '19:30'], ['18:30', '20:00'], ['19:00', '20:30'], ['16:30', '18:00']];

export const seedBags = collections.flatMap((collection, categoryIndex) =>
  Array.from({ length: 20 }, (_, variantIndex) => {
    const serial = categoryIndex * 20 + variantIndex;
    const titleIndex = variantIndex % collection.titles.length;
    const price = collection.base + (variantIndex % 5) * 220 + Math.floor(variantIndex / 5) * 130;
    const originalPrice = Math.ceil((price / (0.39 + (variantIndex % 4) * 0.05)) / 100) * 100;
    const [pickupStart, pickupEnd] = pickupWindows[(variantIndex + categoryIndex) % pickupWindows.length];
    return {
      id: `seed-${String(serial + 1).padStart(3, '0')}`,
      title: collection.titles[titleIndex],
      businessName: collection.businesses[(variantIndex + Math.floor(variantIndex / 5)) % collection.businesses.length],
      category: collection.category,
      district: DISTRICTS[(variantIndex * 3 + categoryIndex) % DISTRICTS.length],
      description: collection.details[(variantIndex + categoryIndex) % collection.details.length],
      originalPrice,
      price,
      quantity: variantIndex % 11 === 10 ? 0 : 1 + ((variantIndex * 3 + categoryIndex) % 8),
      pickupStart,
      pickupEnd,
      image: `${assetBase}images/${collection.images[variantIndex % collection.images.length]}.jpg`,
      featuredRank: variantIndex * collections.length + categoryIndex,
      createdAt: `2026-10-${String(1 + (serial % 20)).padStart(2, '0')}T12:00:00.000Z`
    };
  })
);

export const categoryImage = (category) => {
  const collection = collections.find((item) => item.category === category);
  return `${assetBase}images/${collection?.images[0] ?? 'bakery-bread'}.jpg`;
};
