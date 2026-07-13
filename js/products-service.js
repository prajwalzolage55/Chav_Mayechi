import { db } from './firebase-config.js';
import { 
  collection, addDoc, getDocs, query, where, orderBy, doc, deleteDoc, updateDoc, serverTimestamp, getDoc 
} from 'firebase/firestore';

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
      return { id: docSnap.id, ...data };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting product by id:', error);
    return null;
  }
}
