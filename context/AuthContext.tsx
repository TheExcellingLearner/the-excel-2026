"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  auth,
  db,
  googleProvider,
  createUserDoc,
  fetchUserDoc,
  createUserWithEmailAndPassword,
  firebaseSignInWithEmail,
  firebaseSignOut,
  signInWithGoogle,
  updateProfile,
  onAuthStateChanged,
  type LMSUser,
  type UserRole,
} from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

interface AuthContextValue {
  user: LMSUser | null;
  loading: boolean;
  role: UserRole | null;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogleFun: (role: UserRole) => Promise<void>;
  signUp: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LMSUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Listen to Firebase Auth state changes
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const lmsUser = await fetchUserDoc(firebaseUser);
        setUser(lmsUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  /* ── Sign up with Email/Password ─── */
  const signUp = async (
    email: string,
    password: string,
    name: string,
    role: UserRole
  ) => {
    setLoading(true);
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    const lmsUser = await createUserDoc(cred.user, role, name);
    setUser(lmsUser);
    setLoading(false);
    router.push(role === "teacher" ? "/teacher/dashboard" : "/student/dashboard");
  };

  /* ── Sign in with Email/Password ─── */
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const cred = await firebaseSignInWithEmail(auth, email, password);
    const lmsUser = await fetchUserDoc(cred.user);
    setUser(lmsUser);
    setLoading(false);
    if (lmsUser) {
      router.push(lmsUser.role === "teacher" ? "/teacher/dashboard" : "/student/dashboard");
    }
  };

  /* ── Google Sign-in ─── */
  const signInWithGoogleFun = async (role: UserRole) => {
    setLoading(true);
    const cred = await signInWithGoogle();
    const lmsUser = await createUserDoc(cred.user, role);
    setUser(lmsUser);
    setLoading(false);
    router.push(role === "teacher" ? "/teacher/dashboard" : "/student/dashboard");
  };

  /* ── Sign out ─── */
  const signOut = async () => {
    await firebaseSignOut(auth);
    setUser(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        role: user?.role ?? null,
        signIn,
        signInWithGoogleFun,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
