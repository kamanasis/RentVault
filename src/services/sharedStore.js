import { generateDemoEventHistory } from '../utils/agreementLifecycle';

// Firebase configuration (uses VITE_FIREBASE_* environment variables)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_FIREBASE_API_KEY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "YOUR_FIREBASE_AUTH_DOMAIN",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "YOUR_FIREBASE_PROJECT_ID",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "YOUR_FIREBASE_STORAGE_BUCKET",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "YOUR_FIREBASE_MESSAGING_SENDER_ID",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "YOUR_FIREBASE_APP_ID"
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
    console.warn('[SharedStore] Firebase dynamic import warning:', err);
    return null;
  }
};

// Initial demo seed agreements
const INITIAL_DEMO_AGREEMENTS = [
  {
    id: 'RV-2026-001',
    propertyName: 'Sunset Bay Apartments #402',
    propertyAddress: '742 Evergreen Terrace, Sector 4',
    landlordWallet: 'GB7X42F098A190B38812TESTNETRENTVAULTKEY99',
    tenantWallet: 'GDKX89A190B38812TESTNETTENANTKEY99881',
    depositAmount: 2300,
    utilityReserve: 200,
    fundedAmount: 0,
    leaseStart: '2026-09-01',
    leaseEnd: '2027-08-31',
    notes: 'Includes reserved utility escrow for electricity and water settlement.',
    status: 'Awaiting Deposit',
    createdAt: '2026-08-01T10:00:00.000Z',
    autoRelease: {
      preset: '7_days',
      duration: 7,
      unit: 'days',
      milliseconds: 7 * 24 * 60 * 60 * 1000,
    },
  },
  {
    id: 'RV-2026-002',
    propertyName: 'Metro Loft Suites #12',
    propertyAddress: '101 Innovation Boulevard, Tech District',
    landlordWallet: 'GB7X42F098A190B38812TESTNETRENTVAULTKEY99',
    tenantWallet: 'GC2Y19D488A1009182TESTNETTENANTKEY77',
    depositAmount: 1800,
    utilityReserve: 200,
    fundedAmount: 2000,
    leaseStart: '2026-06-01',
    leaseEnd: '2027-05-31',
    notes: 'Escrow deposit locked on Stellar Testnet.',
    status: 'Deposit Locked',
    createdAt: '2026-05-20T14:30:00.000Z',
    txHash: '8f92a10e2b4c129d39f4011029419082001',
    depositConfirmedAt: '2026-05-20T14:35:00.000Z',
    autoRelease: {
      preset: '1_min',
      duration: 1,
      unit: 'minutes',
      milliseconds: 60 * 1000,
    },
  },
];

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

/**
 * Normalizes agreement object for cross-browser storage & uppercase wallet matching
 */
export const normalizeAgreementForStorage = (a) => {
  if (!a || !a.id) return null;
  const landlordWallet = (a.landlordWallet || '').trim().toUpperCase();
  const tenantWallet = (a.tenantWallet || '').trim().toUpperCase();

  return {
    ...a,
    id: a.id,
    propertyName: a.propertyName || 'Rental Property',
    propertyAddress: a.propertyAddress || '',
    landlordWallet,
    tenantWallet,
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
 * Subscribes to real-time agreement changes across distinct browsers via Firestore onSnapshot
 */
export const subscribeToSharedAgreements = (onUpdateCallback) => {
  let isUnsubscribed = false;
  let unsubscribeFirestore = () => {};

  // 1. Firebase Firestore Real-Time Listener (Primary Source of Truth)
  getFirestoreDb().then(async (db) => {
    if (!db || isUnsubscribed) return;
    try {
      const { collection, onSnapshot, doc, setDoc } = await import('firebase/firestore');
      const agreementsCol = collection(db, 'agreements');

      unsubscribeFirestore = onSnapshot(
        agreementsCol,
        async (snapshot) => {
          if (isUnsubscribed) return;
          const cloudAgreements = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const normalized = normalizeAgreementForStorage(data);
            if (normalized) cloudAgreements.push(normalized);
          });

          console.log(`[Firestore] Received ${cloudAgreements.length} agreements from cloud snapshot`);

          // Initial Seed if Firestore is empty on fresh setup
          if (cloudAgreements.length === 0) {
            console.log('[Firestore] Collection empty. Seeding initial demo agreements...');
            for (const demo of INITIAL_DEMO_AGREEMENTS) {
              const normDemo = normalizeAgreementForStorage(demo);
              await setDoc(doc(db, 'agreements', normDemo.id), normDemo, { merge: true });
            }
            return; // Next onSnapshot trigger will process seeded documents
          }

          onUpdateCallback(cloudAgreements);
        },
        (error) => {
          console.warn('[SharedStore] Firestore snapshot warning (using broadcast listener fallback):', error.message);
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
      console.log(`[BroadcastChannel] Received ${list.length} agreements across local windows`);
      onUpdateCallback(list);
    }
  };

  if (broadcastChannel) {
    broadcastChannel.addEventListener('message', handleBroadcastMessage);
  }

  // Return unsubscribe cleanup function
  return () => {
    isUnsubscribed = true;
    unsubscribeFirestore();
    if (broadcastChannel) {
      broadcastChannel.removeEventListener('message', handleBroadcastMessage);
    }
  };
};

/**
 * Broadcasts agreement list update over local BroadcastChannel
 */
const notifyLocalBroadcast = (agreementsList) => {
  const normalizedList = agreementsList.map(normalizeAgreementForStorage).filter(Boolean);
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
 * Saves or updates a single agreement atomically in Firestore
 */
export const saveAgreementToSharedStore = async (agreement) => {
  const normalized = normalizeAgreementForStorage(agreement);
  if (!normalized) return;

  console.log(`[Firestore] Writing atomic update for agreement ${normalized.id} (Status: ${normalized.status})...`);

  // 1. Firestore Atomic Write (setDoc with merge)
  const db = await getFirestoreDb();
  if (db) {
    try {
      const { doc, setDoc } = await import('firebase/firestore');
      const docRef = doc(db, 'agreements', normalized.id);
      await setDoc(docRef, normalized, { merge: true });
      console.log(`[Firestore] Successfully saved document ${normalized.id} to Firestore cloud!`);
    } catch (err) {
      console.warn(`[Firestore] Save failed for ${normalized.id}:`, err);
    }
  }

  // 2. Local Broadcast Channel sync
  notifyLocalBroadcast([normalized]);
};

/**
 * Saves entire agreements array to shared store atomically
 */
export const saveAllAgreementsToSharedStore = async (agreementsList) => {
  const normalizedList = agreementsList.map(normalizeAgreementForStorage).filter(Boolean);

  const db = await getFirestoreDb();
  if (db) {
    try {
      const { doc, setDoc } = await import('firebase/firestore');
      for (const ag of normalizedList) {
        const docRef = doc(db, 'agreements', ag.id);
        await setDoc(docRef, ag, { merge: true });
      }
      console.log(`[Firestore] Saved ${normalizedList.length} agreements to cloud`);
    } catch (err) {
      console.warn('[Firestore] Batch save warning:', err);
    }
  }

  notifyLocalBroadcast(normalizedList);
};

/**
 * Deletes an agreement from Firestore
 */
export const deleteAgreementFromSharedStore = async (id) => {
  if (!id) return;

  console.log(`[Firestore] Deleting agreement document ${id}...`);
  const db = await getFirestoreDb();
  if (db) {
    try {
      const { doc, deleteDoc } = await import('firebase/firestore');
      const docRef = doc(db, 'agreements', id);
      await deleteDoc(docRef);
      console.log(`[Firestore] Successfully deleted ${id} from Firestore`);
    } catch (err) {
      console.warn('[Firestore] Delete warning:', err);
    }
  }
};
