import { generateDemoEventHistory } from '../utils/agreementLifecycle';

// Firebase configuration (uses VITE_FIREBASE_* environment variables)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
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
 * Subscribes to ALL agreements in Firestore via a single global onSnapshot.
 * This is the most reliable approach — no wallet-specific queries needed.
 * The UI (AgreementContext) handles role-based filtering from the full list.
 * Returns an unsubscribe function.
 */
export const subscribeToSharedAgreements = (onUpdateCallback) => {
  let isUnsubscribed = false;
  let unsubscribeFirestore = () => {};

  getFirestoreDb().then(async (db) => {
    if (!db || isUnsubscribed) return;

    try {
      const { collection, onSnapshot } = await import('firebase/firestore');
      const agreementsCol = collection(db, 'agreements');

      unsubscribeFirestore = onSnapshot(
        agreementsCol,
        (snapshot) => {
          if (isUnsubscribed) return;

          const agreements = snapshot.docs
            .map((docSnap) => normalizeAgreementForStorage(docSnap.data(), docSnap.id))
            .filter(Boolean);

          console.log(`[Firestore] Global snapshot received: ${agreements.length} total agreements`);
          onUpdateCallback(agreements);
        },
        (err) => {
          console.error('[SharedStore] Firestore global snapshot error:', err.code, err.message);
        }
      );
    } catch (err) {
      console.error('[SharedStore] Failed to attach Firestore listener:', err);
    }
  });

  return () => {
    isUnsubscribed = true;
    unsubscribeFirestore();
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
