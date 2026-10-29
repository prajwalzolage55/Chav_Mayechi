import { db } from './firebase-config.js';
import { 
  collection, addDoc, getDocs, query, where, orderBy, doc, deleteDoc, updateDoc, serverTimestamp, getDoc 
} from 'firebase/firestore';

// Canonical product name to image mapping
export const PRODUCT_IMAGES = {
  'methi laddu': '/images/Methi_laddu.webp',
  'nachani laddu': '/images/Nachani_laddu.webp',
  'dryfruit laddu': '/images/Dryfruit.webp',
  'khajur laddu': '/images/Khajur.webp',
  'besan laddu': '/images/Besan.webp',
  'rava laddu': '/images/Rava.webp',
  'kothimbir papad': '/images/Kothimbir.webp',
  'palak papad': '/images/Palak.webp',
  'masala papad': '/images/Masala.webp',
  'udit papad': '/images/Udit.webp',
  'nachani pith': '/images/Nachani_pith.webp',
  'modak pith': '/images/Modak_pith.webp',
  'jowar kurmura': '/images/Jowar_kurmura.webp',
  'nachani kurmura': '/images/Nachani_kurmura.webp',
  'roasted bajra': '/images/Roasted_bajra.webp',
  'roasted jowar': '/images/Roasted_jowar.webp',
  'bhajka poha': '/images/Bhajka_poha.webp',
  'white poha': '/images/Poha.webp',
  'red poha': '/images/red_poha.webp',
  'kadve vaal': '/images/Vaal.webp',
  'gavran mataki': '/images/Mataki.webp',
  'kombadi vade': '/images/Kombadi_vade.webp',
  'umed laddu': '/images/umed.webp',
  'last laddu': '/images/last.webp'
};

// Robust product image lookup with fuzzy matching and catalog fallback
export function findProductImage(name, catalogProducts = []) {
  if (!name) return '/images/placeholder.svg';
  const lower = name.toLowerCase().trim();
  const clean = lower.replace(/\(.*?\)/g, '').trim();

  // 1. Exact match in canonical map
  if (PRODUCT_IMAGES[clean]) return PRODUCT_IMAGES[clean];
  if (PRODUCT_IMAGES[lower]) return PRODUCT_IMAGES[lower];

  // 2. Partial match in canonical map
  for (const [key, img] of Object.entries(PRODUCT_IMAGES)) {
    if (clean.includes(key) || key.includes(clean) || lower.includes(key) || key.includes(lower)) {
      return img;
    }
  }

  // 3. Match from live catalog products
  if (catalogProducts && catalogProducts.length > 0) {
    const exact = catalogProducts.find(p => p.name && (p.name.toLowerCase().trim() === clean || p.name.toLowerCase().trim() === lower));
    if (exact?.image) return exact.image;

    const partial = catalogProducts.find(p =>
      p.name && (p.name.toLowerCase().includes(clean) || clean.includes(p.name.toLowerCase()))
    );
    if (partial?.image) return partial.image;
  }

  // 4. Default fallback
  return '/images/placeholder.svg';
}

// Fetch all active products
export async function getAllProducts() {
  try {
    const q = query(
      collection(db, 'products'),
      orderBy('timestamp', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map(doc => {
      const data = doc.data();
      if (data.image && typeof data.image === 'string') {
        data.image = data.image.replace(/\.png$/i, '.webp').replace(/\.jpg$/i, '.webp');
      }
      if (data.name && (data.name.toLowerCase().includes('kombadi') || data.name.toLowerCase().includes('komari')) && (!data.image || data.image.includes('placeholder'))) {
        data.image = '/images/Kombadi_vade.webp';
      }
      return { id: doc.id, ...data };
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

// Add a new product
export async function addProduct(productData) {
  try {
    const docRef = await addDoc(collection(db, 'products'), {
      ...productData,
      timestamp: serverTimestamp(),
      active: true
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error adding product:', error);
    return { success: false, error: error.message };
  }
}

// Delete a product
export async function deleteProduct(productId) {
  try {
    await deleteDoc(doc(db, 'products', productId));
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
}

// Update a product
export async function updateProduct(productId, productData) {
  try {
    const docRef = doc(db, 'products', productId);
    await updateDoc(docRef, productData);
    return true;
  } catch (error) {
    console.error('Error updating product:', error);
    return false;
  }
}

// Get a product by ID
export async function getProductById(productId) {
  try {
    const docRef = doc(db, 'products', productId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.image && typeof data.image === 'string') {
        data.image = data.image.replace(/\.png$/i, '.webp').replace(/\.jpg$/i, '.webp');
      }
      if (data.name && (data.name.toLowerCase().includes('kombadi') || data.name.toLowerCase().includes('komari')) && (!data.image || data.image.includes('placeholder'))) {
        data.image = '/images/Kombadi_vade.webp';
      }
      return { id: docSnap.id, ...data };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting product by id:', error);
    return null;
  }
}
