import { useState, useEffect } from "react";
import { supabase } from "../supabase-client";

import GameCard from "./GameCard";
import SearchComponent from "./SearchComponent";
import { useLocation } from "react-router";

function FullCardContainer({ header, userId }) {
  const [libItems, setLibItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState(userId);
  const location = useLocation();

  useEffect(() => {
    const fetchLibrary = async () => {
      if (id === undefined || id === null) {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setId(user.id);
      }
      if (location.pathname.startsWith("/games")) {
        const { data, error } = await supabase
          .from("users_games")
          .select(
            `
      *,
      games (*
      )
    `,
          )
          .eq("user_id", id)
          .eq("status", header);

        if (error) {
          console.error(error);
          return;
        }

        setLoading(false);
        setLibItems(data);
      } else if (location.pathname.startsWith("/movies")) {
        const { data, error } = await supabase
          .from("users_movies")
          .select(
            `
      *,
      movies (*
      )
    `,
          )
          .eq("user_id", id)
          .eq("status", header);

        if (error) {
          console.error(error);
          return;
        }

        setLoading(false);
        setLibItems(data);
      }
    };

    fetchLibrary();
  }, [header, id, location.pathname]);

  if (loading) {
    return (
      <div className="w-full p-2">
        <div className="flex items-center gap-10 p-2">
          <h2>{header}</h2>
          <SearchComponent width="50" />
        </div>
        <div
          className="grid
  grid-cols-[repeat(auto-fill,minmax(220px,1fr))]
  gap-6 gap-5 p-2 border-black border-3"
        >
          <GameCard></GameCard>
          <GameCard></GameCard>
          <GameCard></GameCard>
          <GameCard></GameCard>
          <GameCard></GameCard>
          <GameCard></GameCard>
          <GameCard></GameCard>
          <GameCard></GameCard>
          <GameCard></GameCard>
          <GameCard></GameCard>
          <GameCard></GameCard>
          <GameCard></GameCard>
        </div>
      </div>
    );
  }
  if (location.pathname.startsWith("/games")) {
    return (
      <div className="w-full ps-15 pe-15">
        <div className="flex items-center gap-10 p-2">
          <h2>{header}</h2>
          <SearchComponent width="50" />
        </div>
        <div
          className="grid
  grid-cols-[repeat(auto-fill,minmax(140px,1fr))]
  gap-6 gap-5 p-2 border-black border-3 p-2"
        >
          {libItems.map((game) => {
            return (
              <GameCard
                key={game.id}
                name={game.games.name}
                img={game.games.cover}
                id={game.games.id}
                platform={game.platform}
                status={game.status}
              ></GameCard>
            );
          })}
        </div>
      </div>
    );
  } else if (location.pathname.startsWith("/movies")) {
    return (
      <div className="w-full ps-15 pe-15">
        <div className="flex items-center gap-10 p-2">
          <h2>{header}</h2>
          <SearchComponent width="50" />
        </div>
        <div
          className="grid
  grid-cols-[repeat(auto-fill,minmax(140px,1fr))]
  gap-6 gap-5 p-2 border-black border-3 p-2"
        >
          {libItems.map((item) => {
            return (
              <GameCard
                key={item.id}
                name={item.movies.title}
                img={item.movies.poster}
                id={item.movies.id}
                status={item.status}
              ></GameCard>
            );
          })}
        </div>
      </div>
    );
  }
}

export default FullCardContainer;
