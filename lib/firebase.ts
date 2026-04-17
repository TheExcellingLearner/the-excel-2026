import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword as firebaseSignInWithEmail,
  signOut as firebaseSignOut,
  updateProfile,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

export type UserRole = "teacher" | "student";

export interface LMSUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Avoid re-initialising on hot reload
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

/* ── Helpers ──────────────────────────────────────────────────────── */

/** Persist role in Firestore and return the full LMSUser */
export async function createUserDoc(
  user: User,
  role: UserRole,
  displayName?: string
): Promise<LMSUser> {
  const ref = doc(db, "users", user.uid);
  const roleRef = doc(db, "userRole", user.uid);

  const [snap, roleSnap] = await Promise.all([getDoc(ref), getDoc(roleRef)]);

  if (!snap.exists()) {
    await setDoc(ref, {
      uid: user.uid,
      email: user.email,
      displayName: displayName ?? user.displayName,
      photoURL: user.photoURL,
      createdAt: new Date().toISOString(),
    });
  }

  if (!roleSnap.exists()) {
    await setDoc(roleRef, {
      role
    });
  }

  const roleData = roleSnap.exists() ? roleSnap.data() : { role };
  return {
    uid: user.uid,
    email: user.email,
    displayName: displayName ?? user.displayName,
    photoURL: user.photoURL,
    role: (roleData.role as UserRole) ?? role,
  };
}

/** Fetch user + role from Firestore */
export async function fetchUserDoc(user: User): Promise<LMSUser | null> {
  const userRef = doc(db, "userRole", user.uid);
  const roleRef = doc(db, "userRole", user.uid);

  const [userSnap, roleSnap] = await Promise.all([getDoc(userRef), getDoc(roleRef)]);

  const roleData = roleSnap.exists() ? roleSnap.data() : null;
  const userData = userSnap.exists() ? userSnap.data() : null;

  const resolvedRole = (roleData?.role ?? userData?.role) as UserRole;

  if (!resolvedRole) {
    return null;
  }

  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    role: resolvedRole,
  };
}
const signInWithGoogle = async () => await signInWithPopup(auth, googleProvider);
export {
  createUserWithEmailAndPassword,
  firebaseSignInWithEmail,
  firebaseSignOut,
  signInWithGoogle,
  updateProfile,
  onAuthStateChanged,
};
