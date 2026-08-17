import { generateDemoEventHistory } from '../utils/agreementLifecycle';

// Firebase configuration — env vars preferred, hardcoded fallback for Vercel deployment
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDrkDsJxN3LhJuMMlJVk-ggIlHPxnXeez8',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'rentvault-e2f94.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'rentvault-e2f94',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'rentvault-e2f94.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '1097102419135',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:1097102419135:web:a4ed3e31d8601750cc920a',
};

let firebaseApp = null;
let firestoreDb = null;

const getFirestoreDb = async () => {
  if (firestoreDb) return firestoreDb;
  try {
    const { initializeApp, getApps, getApp } = await import('firebase/app');
    const { getFirestore } = await import('firebase/firestore');
    if (!getApps().length) {
      firebaseApp = initializeApp(firebaseConfig);
    } else {
      firebaseApp = getApp();
    }
    firestoreDb = getFirestore(firebaseApp);
    return firestoreDb;
  } catch (err) {
    console.error('[SharedStore] Firebase initialization error:', err);
    return null;
  }
};

/**
 * Normalizes a wallet address: trim whitespace and uppercase.
 */
export const normalizeWallet = (address) =>
  (address || '').trim().toUpperCase();

/**
 * Normalizes an agreement object from Firestore.
 * docId must be passed explicitly — Firestore data() does not include it.
 */
export const normalizeAgreementForStorage = (data, docId) => {
  const id = docId || data?.id;
  if (!id || !data) return null;

  return {
    ...data,
    id,
    landlordWallet: normalizeWallet(data.landlordWallet),
    tenantWallet: normalizeWallet(data.tenantWallet),
    propertyName: data.propertyName || 'Rental Property',
    propertyAddress: data.propertyAddress || '',
    depositAmount: parseFloat(data.depositAmount) || 0,
    utilityReserve: parseFloat(data.utilityReserve) || 0,
    fundedAmount: data.fundedAmount !== undefined ? parseFloat(data.fundedAmount) : 0,
    status: data.status || 'Awaiting Deposit',
    createdAt: data.createdAt || new Date().toISOString(),
    eventHistory:
      Array.isArray(data.eventHistory) && data.eventHistory.length > 0
        ? data.eventHistory
        : generateDemoEventHistory({ ...data, id }),
  };
};

/**
 * Subscribes to targeted agreements in Firestore using dual queries.
 * Only fetches agreements where the connected wallet is the landlord OR the tenant.
 * Fixes the privacy leak associated with global 'collection' listeners.
 */
export const subscribeToSharedAgreements = (walletAddress, onUpdateCallback) => {
  let isUnsubscribed = false;
  let unsubLandlord = () => {};
  let unsubTenant = () => {};

  const normalizedWallet = normalizeWallet(walletAddress);
  if (!normalizedWallet) return () => {};

  getFirestoreDb().then(async (db) => {
    if (!db || isUnsubscribed) return;

    try {
      const { collection, query, where, onSnapshot } = await import('firebase/firestore');
      const agreementsCol = collection(db, 'agreements');

      const qLandlord = query(agreementsCol, where('landlordWallet', '==', normalizedWallet));
      const qTenant = query(agreementsCol, where('tenantWallet', '==', normalizedWallet));

      // In-memory cache to merge results from both queries and deduplicate by ID
      const resultsMap = new Map();

      const processSnapshot = (snapshot, role) => {
        if (isUnsubscribed) return;
        
        snapshot.docs.forEach(docSnap => {
          const agreement = normalizeAgreementForStorage(docSnap.data(), docSnap.id);
          if (agreement) {
            resultsMap.set(agreement.id, agreement);
          }
        });

        // Convert map to array and trigger update
        const mergedAgreements = Array.from(resultsMap.values());
        console.log(`[Firestore] Targeted snapshot update (${role}): ${mergedAgreements.length} agreements`);
        onUpdateCallback(mergedAgreements);
      };

      unsubLandlord = onSnapshot(qLandlord, 
        (snapshot) => processSnapshot(snapshot, 'landlord_query'),
        (err) => console.error('[SharedStore] Firestore landlord snapshot error:', err)
      );

      unsubTenant = onSnapshot(qTenant, 
        (snapshot) => processSnapshot(snapshot, 'tenant_query'),
        (err) => console.error('[SharedStore] Firestore tenant snapshot error:', err)
      );

    } catch (err) {
      console.error('[SharedStore] Failed to attach Firestore listener:', err);
    }
  });

  return () => {
    isUnsubscribed = true;
    unsubLandlord();
    unsubTenant();
  };
};

/**
 * Saves or updates a single agreement atomically in Firestore.
 */
export const saveAgreementToSharedStore = async (agreement) => {
  if (!agreement || !agreement.id) {
    console.error('[SharedStore] Cannot save agreement without an id');
    return null;
  }

  const normalized = normalizeAgreementForStorage(agreement, agreement.id);
  if (!normalized) return null;

  console.log('SAVING AGREEMENT TO FIRESTORE', {
    id: normalized.id,
    landlordWallet: normalized.landlordWallet,
    tenantWallet: normalized.tenantWallet,
    status: normalized.status,
  });

  const db = await getFirestoreDb();
  if (!db) {
    console.error('[SharedStore] Firestore DB not available');
    return normalized;
  }

  try {
    const { doc, setDoc } = await import('firebase/firestore');
    await setDoc(doc(db, 'agreements', normalized.id), normalized, { merge: true });
    console.log(`[Firestore] ✅ Saved agreement ${normalized.id}`);
  } catch (err) {
    console.error(`[Firestore] ❌ Save failed for ${normalized.id}:`, err.code, err.message);
  }

  return normalized;
};

/**
 * Deletes an agreement document from Firestore by ID.
 */
export const deleteAgreementFromSharedStore = async (id) => {
  if (!id) return;
  const db = await getFirestoreDb();
  if (!db) return;
  try {
    const { doc, deleteDoc } = await import('firebase/firestore');
    await deleteDoc(doc(db, 'agreements', id));
    console.log(`[Firestore] ✅ Deleted agreement ${id}`);
  } catch (err) {
    console.error(`[Firestore] ❌ Delete failed for ${id}:`, err.code, err.message);
  }
};
