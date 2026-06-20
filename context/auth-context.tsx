"use client";

import { createContext, useContext } from "react";
import type { User } from "@supabase/supabase-js";
import type { UserProfile } from "@/types";

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
}

const AuthContext = createContext<AuthContextValue>({ user: null, profile: null });

export function AuthProvider({
  user,
  profile,
  children,
}: AuthContextValue & { children: React.ReactNode }) {
  return (
    <AuthContext.Provider value={{ user, profile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
