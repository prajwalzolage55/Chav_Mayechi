import { db } from './firebase-config.js';
import { 
  collection, addDoc, getDocs, query, where, orderBy, doc, updateDoc, deleteDoc, serverTimestamp 
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

// Save order to Firestore
export async function saveOrder(orderData, userId = null) {
  try {
    const docRef = await addDoc(collection(db, 'orders'), {
      ...orderData,
      userId: userId,
      timestamp: serverTimestamp(),
      status: 'pending',
      source: 'website'
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('❌ Order error:', error);
    return { success: false, error: error.message };
  }
}

// Fetch user's orders
export async function getUserOrders(userId) {
  if (!userId) return [];
  try {
    const q = query(
      collection(db, 'orders'), 
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return [];
  }
}

// ADMIN: Fetch ALL orders
export async function getAllOrders() {
  try {
    const q = query(collection(db, 'orders'), orderBy('timestamp', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching all orders:', error);
    return [];
  }
}

// ADMIN: Update order status
export async function updateOrderStatus(orderId, status) {
  try {
    await updateDoc(doc(db, 'orders', orderId), { status });
    return true;
  } catch (error) {
    console.error('Error updating order:', error);
    return false;
  }
}

// ADMIN: Delete order
export async function deleteOrder(orderId) {
  try {
    await deleteDoc(doc(db, 'orders', orderId));
    return true;
  } catch (error) {
    console.error('Error deleting order:', error);
    return false;
  }
}

// Save inquiry
export async function saveInquiry(formData) {
  try {
    const docRef = await addDoc(collection(db, 'inquiries'), {
      ...formData,
      timestamp: serverTimestamp(),
      status: 'new',
      source: 'website'
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('❌ Inquiry error:', error);
    return { success: false, error: error.message };
  }
}
