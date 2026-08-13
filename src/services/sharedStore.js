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
 * Normalizes an agreement object from Firestore data + document ID.
 * The docId must be passed explicitly since Firestore data() does not include it.
 */
export const normalizeAgreementForStorage = (data, docId) => {
  // Use the Firestore document ID first, fall back to data.id
  const id = docId || data?.id;
  if (!id || !data) return null;

  const landlordWallet = normalizeWallet(data.landlordWallet);
  const tenantWallet = normalizeWallet(data.tenantWallet);

  return {
    ...data,
    id,
    landlordWallet,
    tenantWallet,
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
 * Subscribes to real-time Firestore agreements for the connected wallet.
 * Runs TWO queries (landlord + tenant) and merges results.
 * Returns an unsubscribe function.
 */
export const subscribeToSharedAgreements = (walletAddress, onUpdateCallback) => {
  let isUnsubscribed = false;
  let unsubscribeLandlord = () => {};
  let unsubscribeTenant = () => {};

  const normalizedWallet = normalizeWallet(walletAddress);

  if (!normalizedWallet) {
    console.warn('[SharedStore] No wallet address provided — skipping subscription.');
    onUpdateCallback([]);
    return () => {};
  }

  // Shared result buckets for merge
  let landlordResults = [];
  let tenantResults = [];

  const mergeAndNotify = () => {
    if (isUnsubscribed) return;

    // Merge both lists, deduplicate by Firestore document ID
    const seen = new Map();
    [...landlordResults, ...tenantResults].forEach((ag) => {
      if (!seen.has(ag.id)) seen.set(ag.id, ag);
    });

    // Sort by createdAt descending (newest first)
    const merged = [...seen.values()].sort((a, b) => {
      const aTime = new Date(a.createdAt).getTime() || 0;
      const bTime = new Date(b.createdAt).getTime() || 0;
      return bTime - aTime;
    });

    console.log(`[Firestore] Merged agreements for ${normalizedWallet}: ${merged.length}`);
    onUpdateCallback(merged);
  };

  // Attach listeners once DB is ready
  getFirestoreDb().then(async (db) => {
    if (!db || isUnsubscribed) return;

    try {
      const { collection, onSnapshot, query, where } = await import('firebase/firestore');
      const agreementsCol = collection(db, 'agreements');

      const landlordQuery = query(
        agreementsCol,
        where('landlordWallet', '==', normalizedWallet)
      );
      const tenantQuery = query(
        agreementsCol,
        where('tenantWallet', '==', normalizedWallet)
      );

      // Landlord listener
      unsubscribeLandlord = onSnapshot(
        landlordQuery,
        (snapshot) => {
          if (isUnsubscribed) return;
          landlordResults = snapshot.docs
            .map((docSnap) => normalizeAgreementForStorage(docSnap.data(), docSnap.id))
            .filter(Boolean);
          console.log(`[Firestore] Landlord snapshot — ${landlordResults.length} docs for ${normalizedWallet}`);
          mergeAndNotify();
        },
        (err) => console.error('[SharedStore] Landlord listener error:', err.code, err.message)
      );

      // Tenant listener
      unsubscribeTenant = onSnapshot(
        tenantQuery,
        (snapshot) => {
          if (isUnsubscribed) return;
          console.log(`TENANT LISTENER WALLET: ${normalizedWallet}`);
          console.log(`TENANT SNAPSHOT SIZE: ${snapshot.size}`);
          snapshot.docs.forEach((d) => console.log('[Tenant doc]', d.id, d.data()));

          tenantResults = snapshot.docs
            .map((docSnap) => normalizeAgreementForStorage(docSnap.data(), docSnap.id))
            .filter(Boolean);
          mergeAndNotify();
        },
        (err) => console.error('[SharedStore] Tenant listener error:', err.code, err.message)
      );
    } catch (err) {
      console.error('[SharedStore] Failed to attach Firestore listeners:', err);
    }
  });

  return () => {
    isUnsubscribed = true;
    unsubscribeLandlord();
    unsubscribeTenant();
  };
};

/**
 * Saves or updates a single agreement atomically in Firestore.
 * Uses the agreement's id as the Firestore document ID so reads always match.
 */
export const saveAgreementToSharedStore = async (agreement) => {
  if (!agreement || !agreement.id) {
    console.error('[SharedStore] Cannot save agreement without an id');
    return null;
  }

  const normalized = normalizeAgreementForStorage(agreement, agreement.id);
  if (!normalized) return null;

  console.log('CREATING AGREEMENT', {
    landlordWallet: normalized.landlordWallet,
    tenantWallet: normalized.tenantWallet,
    id: normalized.id,
    status: normalized.status,
  });

  const db = await getFirestoreDb();
  if (!db) {
    console.error('[SharedStore] Firestore DB not available');
    return normalized;
  }

  try {
    const { doc, setDoc } = await import('firebase/firestore');
    const docRef = doc(db, 'agreements', normalized.id);
    await setDoc(docRef, normalized, { merge: true });
    console.log(`[Firestore] ✅ Saved agreement ${normalized.id} to Firestore`);
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
