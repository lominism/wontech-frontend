"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  onAuthStateChanged,
  signOut,
  type User,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { syncUser, type BackendUser } from "@/lib/syncUser";

type AuthContextType = {
  user: User | null;
  profile: BackendUser | null;
  loading: boolean;
  logout: () => Promise<void>;
  applyProfile: (backendUser: BackendUser) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Merge a freshly-synced backend user into the current profile, never letting
// a response without names (e.g. the auth-state self-heal sync that may run
// before the register form values reach the backend) overwrite known names.
function mergeProfile(
  prev: BackendUser | null,
  next: BackendUser
): BackendUser {
  if (!prev || prev.id !== next.id) {
    return next;
  }
  return {
    ...next,
    firstName: next.firstName ?? prev.firstName,
    lastName: next.lastName ?? prev.lastName,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<BackendUser | null>(null);
  const [loading, setLoading] = useState(true);

  const applyProfile = useCallback((backendUser: BackendUser) => {
    setProfile((prev) => mergeProfile(prev, backendUser));
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      if (firebaseUser) {
        document.cookie = "fb-auth=1; path=/; SameSite=Lax";
        // Ensure a backend user row exists and load it as the source of truth
        // for profile data. This is idempotent (findOrCreate) and self-heals
        // cases where the initial login/register sync failed.
        syncUser(firebaseUser)
          .then((backendUser) => applyProfile(backendUser))
          .catch((error) => {
            console.error("Failed to sync user with backend:", error);
          });
      } else {
        setProfile(null);
        document.cookie =
          "fb-auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
    });

    return () => unsubscribe();
  }, [applyProfile]);

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, logout, applyProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
