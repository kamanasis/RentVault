import { generateDemoEventHistory } from '../utils/agreementLifecycle';

// Firebase configuration (using public demo/project keys with fallback)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyRentVaultTestnetKey2026Demonstration",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "rentvault-stellar.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "rentvault-stellar",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "rentvault-stellar.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "9812039182",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:9812039182:web:8a9120c9182019"
};

let firebaseApp = null;
let firestoreDb = null;

const getFirestoreDb = async () => {
  if (firestoreDb) return firestoreDb;
  try {
    const { initializeApp, getApps } = await import('firebase/app');
    const { getFirestore } = await import('firebase/firestore');
    if (!getApps().length) {
      firebaseApp = initializeApp(firebaseConfig);
    } else {
      firebaseApp = getApps()[0];
    }
    firestoreDb = getFirestore(firebaseApp);
    return firestoreDb;
  } catch (err) {
    console.warn('[SharedStore] Firebase dynamic import warning (using BroadcastChannel sync):', err);
    return null;
  }
};

// BroadcastChannel for instant local cross-browser/cross-tab synchronization
const SYNC_CHANNEL_NAME = 'rentvault_cross_browser_sync';
let broadcastChannel = null;

if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    broadcastChannel = new BroadcastChannel(SYNC_CHANNEL_NAME);
  } catch (e) {
    console.warn('[SharedStore] BroadcastChannel warning:', e);
  }
}

const STORAGE_KEY = 'rentvault_agreements';

/**
 * Normalizes agreement object for cross-browser storage
 */
export const normalizeAgreementForStorage = (a) => {
  if (!a || !a.id) return null;
  return {
    ...a,
    id: a.id,
    propertyName: a.propertyName || 'Rental Property',
    propertyAddress: a.propertyAddress || '',
    landlordWallet: (a.landlordWallet || '').trim(),
    tenantWallet: (a.tenantWallet || '').trim(),
    depositAmount: parseFloat(a.depositAmount) || 0,
    utilityReserve: parseFloat(a.utilityReserve) || 0,
    fundedAmount: a.fundedAmount !== undefined ? parseFloat(a.fundedAmount) : 0,
    status: a.status || 'Awaiting Deposit',
    createdAt: a.createdAt || new Date().toISOString(),
    eventHistory: Array.isArray(a.eventHistory) && a.eventHistory.length > 0
      ? a.eventHistory
      : generateDemoEventHistory(a),
  };
};

/**
 * Subscribes to real-time agreement changes across distinct browsers & tabs
 */
export const subscribeToSharedAgreements = (onUpdateCallback) => {
  let isUnsubscribed = false;
  let unsubscribeFirestore = () => {};

  // 1. Firebase Firestore Real-Time Listener (Dynamic Async Initialization)
  getFirestoreDb().then(async (db) => {
    if (!db || isUnsubscribed) return;
    try {
      const { collection, onSnapshot } = await import('firebase/firestore');
      const agreementsCol = collection(db, 'agreements');
      unsubscribeFirestore = onSnapshot(
        agreementsCol,
        (snapshot) => {
          if (isUnsubscribed) return;
          const cloudAgreements = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const normalized = normalizeAgreementForStorage(data);
            if (normalized) cloudAgreements.push(normalized);
          });

          if (cloudAgreements.length > 0) {
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudAgreements));
            } catch (e) {}

            onUpdateCallback(cloudAgreements);
          }
        },
        (error) => {
          console.warn('[SharedStore] Firestore snapshot warning:', error.message);
        }
      );
    } catch (err) {
      console.warn('[SharedStore] Firestore subscription error:', err);
    }
  });

  // 2. Native BroadcastChannel Listener (Cross-tab / Cross-window instant sync)
  const handleBroadcastMessage = (event) => {
    if (isUnsubscribed) return;
    if (event.data && event.data.type === 'AGREEMENTS_UPDATED' && Array.isArray(event.data.agreements)) {
      const list = event.data.agreements.map(normalizeAgreementForStorage).filter(Boolean);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      } catch (e) {}
      onUpdateCallback(list);
    }
  };

  if (broadcastChannel) {
    broadcastChannel.addEventListener('message', handleBroadcastMessage);
  }

  // 3. Storage Event Listener (Cross-window localStorage change listener)
  const handleStorageEvent = (e) => {
    if (isUnsubscribed) return;
    if (e.key === STORAGE_KEY && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue);
        if (Array.isArray(parsed)) {
          const list = parsed.map(normalizeAgreementForStorage).filter(Boolean);
          onUpdateCallback(list);
        }
      } catch (err) {}
    }
  };

  window.addEventListener('storage', handleStorageEvent);

  // Return unsubscribe cleanup function
  return () => {
    isUnsubscribed = true;
    unsubscribeFirestore();
    if (broadcastChannel) {
      broadcastChannel.removeEventListener('message', handleBroadcastMessage);
    }
    window.removeEventListener('storage', handleStorageEvent);
  };
};

/**
 * Broadcasts agreement list update to all connected listeners
 */
const notifyListeners = (agreementsList) => {
  const normalizedList = agreementsList.map(normalizeAgreementForStorage).filter(Boolean);

  // Save to localStorage
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedList));
  } catch (e) {}

  // Broadcast over BroadcastChannel
  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage({
        type: 'AGREEMENTS_UPDATED',
        agreements: normalizedList,
        timestamp: Date.now(),
      });
    } catch (e) {}
  }
};

/**
 * Saves or updates a single agreement in the shared persistence store
 */
export const saveAgreementToSharedStore = async (agreement) => {
  const normalized = normalizeAgreementForStorage(agreement);
  if (!normalized) return;

  // 1. Firebase Firestore Write
  getFirestoreDb().then(async (db) => {
    if (!db) return;
    try {
      const { doc, setDoc } = await import('firebase/firestore');
      const docRef = doc(db, 'agreements', normalized.id);
      await setDoc(docRef, normalized, { merge: true });
    } catch (err) {
      console.warn('[SharedStore] Firestore write warning:', err);
    }
  });

  // 2. Local & Broadcast Sync
  try {
    const existingStr = localStorage.getItem(STORAGE_KEY);
    let existingList = [];
    if (existingStr) {
      existingList = JSON.parse(existingStr);
    }

    const idx = existingList.findIndex((a) => a.id.toLowerCase() === normalized.id.toLowerCase());
    if (idx >= 0) {
      existingList[idx] = normalized;
    } else {
      existingList = [normalized, ...existingList];
    }

    notifyListeners(existingList);
  } catch (err) {
    console.error('[SharedStore] Local save warning:', err);
  }
};

/**
 * Saves entire agreements array to shared store
 */
export const saveAllAgreementsToSharedStore = async (agreementsList) => {
  const normalizedList = agreementsList.map(normalizeAgreementForStorage).filter(Boolean);

  // Firestore Writes
  getFirestoreDb().then(async (db) => {
    if (!db) return;
    try {
      const { doc, setDoc } = await import('firebase/firestore');
      for (const ag of normalizedList) {
        const docRef = doc(db, 'agreements', ag.id);
        await setDoc(docRef, ag, { merge: true });
      }
    } catch (err) {
      console.warn('[SharedStore] Firestore batch write warning:', err);
    }
  });

  notifyListeners(normalizedList);
};

/**
 * Deletes an agreement from the shared persistence store
 */
export const deleteAgreementFromSharedStore = async (id) => {
  if (!id) return;

  getFirestoreDb().then(async (db) => {
    if (!db) return;
    try {
      const { doc, deleteDoc } = await import('firebase/firestore');
      const docRef = doc(db, 'agreements', id);
      await deleteDoc(docRef);
    } catch (err) {
      console.warn('[SharedStore] Firestore delete warning:', err);
    }
  });

  try {
    const existingStr = localStorage.getItem(STORAGE_KEY);
    if (existingStr) {
      const existingList = JSON.parse(existingStr);
      const filtered = existingList.filter((a) => a.id.toLowerCase() !== id.toLowerCase());
      notifyListeners(filtered);
    }
  } catch (err) {
    console.error('[SharedStore] Local delete warning:', err);
  }
};
