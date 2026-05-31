import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabase-client";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Get initial session immediately
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // 2. Listen for changes (keep callback synchronous)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);

      setUser(session?.user);
      setLoading(false);
      // Do NOT await async calls here (e.g., fetch user profile)
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchId = async () => {
      const { error, data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        console.error(error);
      }
      setUserId(data[0].id);
      console.log("fetching ", data);
    };

    fetchId();
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, userId }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
