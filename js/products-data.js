const staticProductsData = [
  {
    name: 'Methi Laddu',
    price: '₹600',
    unit: '/kg',
    description: 'मेथीचे लाडू — Made with fenugreek, jaggery & pure ghee. Great for health and taste.',
    image: '/images/Methi_laddu.png',
    badge: 'Bestseller',
    badgeColor: 'bg-gradient-to-r from-saffron to-saffron-dark',
  },
  {
    name: 'Nachani Laddu',
    price: '₹600',
    unit: '/kg',
    description: 'नाचणीचे लाडू — Packed with iron and calcium. A nutritious traditional delight.',
    image: '/images/Nachani_laddu.png',
    badge: 'Healthy',
    badgeColor: 'bg-gradient-to-r from-soft-green to-soft-green-light',
  },
  {
    name: 'Dryfruit Laddu',
    price: '₹600',
    unit: '/kg',
    description: 'ड्रायफ्रूट लाडू — Loaded with almonds, cashews, dates & pistachios. Pure indulgence.',
    image: '/images/Dryfruit.png',
    badge: 'Premium',
    badgeColor: 'bg-gradient-to-r from-gold to-saffron',
  },
  {
    name: 'Khajur Laddu',
    price: '₹600',
    unit: '/kg',
    description: 'खजूराचे लाडू — Naturally sweetened with dates. Healthy, sugar-free & delicious.',
    image: '/images/Khajur.png',
    badge: 'No Sugar',
    badgeColor: 'bg-gradient-to-r from-soft-green to-soft-green-light',
  },
  {
    name: 'Besan Laddu',
    price: '₹600',
    unit: '/kg',
    description: 'बेसनाचे लाडू — The timeless classic made with roasted gram flour, ghee & cardamom.',
    image: '/images/Besan.png',
    badge: 'Classic',
    badgeColor: 'bg-gradient-to-r from-warm-brown to-warm-brown-light',
  },
  {
    name: 'Rava Laddu',
    price: '₹600',
    unit: '/kg',
    description: 'रव्याचे लाडू — Crispy, melt-in-mouth treats made with semolina and coconut.',
    image: '/images/Rava.png',
    badge: 'Popular',
    badgeColor: 'bg-gradient-to-r from-saffron to-saffron-dark',
  },
  {
    name: 'Udit Papad',
    price: '₹600',
    unit: '/pack',
    description: 'उडदाचे पापड — Crispy, authentic urad dal papads made with traditional spices.',
    image: '/images/Udit.png',
    badge: 'Special',
    badgeColor: 'bg-gradient-to-r from-gold to-saffron',
  },
  {
    name: 'Masala Papad',
    price: '₹200',
    unit: '/pack',
    description: 'मसाला पापड — Crunchy and spicy papads flavored with authentic homemade masala.',
    image: '/images/Masala.png',
    badge: 'New',
    badgeColor: 'bg-gradient-to-r from-red-500 to-red-600',
  },
  {
    name: 'Kothimbir Papad',
    price: '₹300',
    unit: '/pack',
    description: 'कोथिंबीर पापड — Unique, crispy papads with the fresh flavor of coriander.',
    image: '/images/Kothimbir.png',
    badge: 'Snack',
    badgeColor: 'bg-gradient-to-r from-soft-green to-soft-green-light',
  },
  {
    name: 'Palak Papad',
    price: '₹250',
    unit: '/pack',
    description: 'पालक पापड — Healthy and crispy spinach flavored papads.',
    image: '/images/Palak.png',
    badge: 'Fresh',
    badgeColor: 'bg-gradient-to-r from-soft-green to-soft-green-light',
  },
];

let addedProducts = [];
try {
  const stored = localStorage.getItem('addedProducts');
  if (stored) {
    addedProducts = JSON.parse(stored);
  }
} catch(e) {
  console.error("Could not load products from localStorage", e);
}

export const productsData = [...staticProductsData, ...addedProducts];
