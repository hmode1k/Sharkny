import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabase-client";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Clean OAuth hash once on app load
  useEffect(() => {
    if (window.location.hash.includes("access_token")) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  // 2. Auth initialization + listener
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (!mounted) return;

      if (error) {
        console.error("Auth init error:", error);
      }

      setUser(data.session?.user ?? null);
      setLoading(false);
    };

    initAuth();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("AUTH EVENT:", event);

        if (!mounted) return;

        setUser(session?.user ?? null);
        setLoading(false);
      },
    );

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
