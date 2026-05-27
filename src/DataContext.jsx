import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabase-client";
import { useAuth } from "./AuthContext";

const DataContext = createContext();

export function DataProvider({ children }) {
  const { user } = useAuth();

  const [games, setGames] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH ONCE
  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      const { data: games, error: gamesError } = await supabase
        .from("users_games")
        .select(` *, games(*)`)
        .eq("user_id", user.id);

      const { data: movies, error: moviesError } = await supabase
        .from("users_movies")
        .select(` *, movies(*)`)
        .eq("user_id", user.id);

      if (gamesError || moviesError) {
        console.error(gamesError || moviesError);
      }

      setGames(games);
      setMovies(movies);
    }

    fetchData();
  }, [user]);

  return (
    <DataContext.Provider
      value={{
        games,
        movies,
        loading,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
