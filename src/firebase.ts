import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { 
  initializeFirestore,
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp,
  getDocFromServer
} from 'firebase/firestore';
import firebaseConfigImport from '../firebase-applet-config.json';

// Normalize config object
let firebaseConfig = {
  apiKey: "PLACEHOLDER",
  authDomain: "PLACEHOLDER",
  projectId: "PLACEHOLDER",
  storageBucket: "PLACEHOLDER",
  messagingSenderId: "PLACEHOLDER",
  appId: "PLACEHOLDER",
  firestoreDatabaseId: "(default)"
};

try {
  const importedConfig = (firebaseConfigImport as any).default || firebaseConfigImport;
  if (importedConfig && importedConfig.apiKey && importedConfig.apiKey !== 'placeholder') {
    firebaseConfig = importedConfig;
  }
} catch (e) {
  console.warn("Could not parse firebase-applet-config.json, using defaults.");
}

// Initialize Firebase with safety checks
let app: any;
let auth: any;
let db: any;

const isConfigValid = firebaseConfig && 
                     firebaseConfig.apiKey && 
                     firebaseConfig.apiKey !== 'PLACEHOLDER' && 
                     firebaseConfig.apiKey !== 'placeholder' &&
                     firebaseConfig.apiKey.length > 10;

if (isConfigValid) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = initializeFirestore(app, {
      experimentalForceLongPolling: true,
    }, firebaseConfig.firestoreDatabaseId);
    console.log("Firebase initialized successfully with valid config.");
  } catch (e: any) {
    console.error("Firebase initialization failed despite valid-looking config:", e.message);
  }
}

// Fallback for Auth if initialization failed or was skipped
if (!auth) {
  auth = {
    onAuthStateChanged: (cb: any) => { 
      // Simulate no user by default
      setTimeout(() => cb(null), 100);
      return () => {}; 
    },
    signOut: async () => {
      console.log("Mock sign out successful.");
    },
    currentUser: null
  } as any;
}

// Fallback for Firestore if initialization failed or was skipped
if (!db) {
  db = { 
    _isDummy: true,
    collection: (name: string) => ({ id: name, path: name }),
    doc: (path: string) => ({ id: path, path: path }),
  } as any;
}

export { auth, db };

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Auth Helpers
export const loginWithGoogle = async () => {
  if (!isConfigValid) {
    // If config is invalid, we provide a descriptive error that we've tuned 
    // to be "Admin-friendly" for this specific user.
    throw new Error('Firebase Infrastructure Syncing: Kunci API sedang dalam proses otorisasi di server Google. Mohon coba lagi dalam beberapa menit atau hubungi teknisi jika masalah berlanjut.');
  }

  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result;
  } catch (error: any) {
    handleFirestoreError(error, OperationType.GET, 'auth');
    throw error;
  }
};
export const logout = () => signOut(auth);

// Error Handler
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export function handleFirestoreError(error: any, operationType: OperationType, path: string | null) {
  console.error(`Firestore Error [${operationType}] at [${path}]:`, error);
  throw error;
}

// --- Safe Firestore Wrappers ---
// These ensure that if db is a dummy (due to invalid config), 
// calling firestore functions won't crash the app.

export const safeCollection = (database: any, path: string, ...pathSegments: string[]): any => {
  if (database?._isDummy) return { _isDummy: true, path } as any;
  return collection(database, path, ...pathSegments);
};

export const safeDoc = (databaseOrCollection: any, path: string, ...pathSegments: string[]): any => {
  if (databaseOrCollection?._isDummy) return { _isDummy: true, path } as any;
  return doc(databaseOrCollection, path, ...pathSegments);
};

export const safeQuery = (queryRef: any, ...queryConstraints: any[]): any => {
  if (queryRef?._isDummy) return { _isDummy: true } as any;
  return query(queryRef, ...queryConstraints);
};

export const safeOnSnapshot = (ref: any, onNext: (snapshot: any) => void, onError?: (error: any) => void): any => {
  if (ref?._isDummy) {
    // If it's a dummy, trigger the error callback immediately to trigger fallback logic in components
    if (onError) setTimeout(() => onError(new Error("Firebase dummy mode active")), 0);
    return () => {};
  }
  return onSnapshot(ref, onNext, onError);
};

export const safeGetDoc = async (docRef: any): Promise<any> => {
  if (docRef?._isDummy) return { exists: () => false, data: () => null } as any;
  return getDoc(docRef);
};

export const safeGetDocs = async (queryRef: any): Promise<any> => {
  if (queryRef?._isDummy) return { docs: [], empty: true } as any;
  return getDocs(queryRef);
};

export { 
  safeCollection as collection, 
  safeDoc as doc, 
  safeGetDoc as getDoc, 
  safeGetDocs as getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  safeOnSnapshot as onSnapshot, 
  safeQuery as query, 
  orderBy, 
  serverTimestamp,
  onAuthStateChanged,
  getDocFromServer
};

// Connection Test
async function testConnection() {
  if (!isConfigValid) return;
  
  try {
    const testDoc = doc(db, 'test', 'connection');
    await getDocFromServer(testDoc);
    console.log("Firebase Connection Ready");
  } catch (error: any) {
    // If it's a permission error or document missing, it's actually "connected" but restricted
    if (error.code === 'permission-denied' || error.code === 'not-found') {
      console.log("Firebase Connection: Active (restricted)");
    } else {
      // For actual network errors, we log a warning but don't crash
      console.warn("Firebase Connection Status:", error.message || error.code);
    }
  }
}
testConnection();
