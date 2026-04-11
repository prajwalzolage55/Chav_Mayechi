import { auth, db } from './firebase-config.js';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { doc, setDoc, getDoc, collection, getDocs } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

// Register User
export async function registerUser(email, password, name) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    await updateProfile(user, { displayName: name });
    
    await setDoc(doc(db, 'users', user.uid), {
      name,
      email,
      role: 'user',
      createdAt: new Date().toISOString()
    });
    
    return { success: true, user };
  } catch (error) {
    console.error('Registration Error:', error);
    return { success: false, error: error.message };
  }
}

// Login User
export async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error('Login Error:', error);
    return { success: false, error: error.message };
  }
}

// Logout
export async function logoutUser() {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Logout Error:', error);
    return { success: false, error: error.message };
  }
}

// Get User Data
export async function getUserData(uid) {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}

// Check Auth State
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

// Get All Users (Admin)
export async function getAllUsers() {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching all users:', error);
    return [];
  }
}
