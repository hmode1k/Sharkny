import { useState, useEffect } from "react";
import { supabase } from "../supabase-client";

import GameCard from "./GameCard";
import SearchComponent from "./SearchComponent";

function FullCardContainer({ header }) {
  const [libGames, setLibGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLibrary = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from("users_games")
        .select(
          `
      *,
      games (
        id,
        name,
        background_img
      )
    `,
        )
        .eq("user_id", user.id)
        .eq("status", header);

      if (error) {
        console.error(error);
        return;
      }

      setLoading(false);
      setLibGames(data);
    };

    fetchLibrary();
  }, [header]);

  return loading ? (
    <div className="w-full p-2">
      <div className="flex items-center gap-10 p-2">
        <h2>{header}</h2>
        <SearchComponent width="50" />
        <h2 className="text-black">Filter</h2>
      </div>
      <div className="flex flex-wrap flex-shrink gap-5 p-2">
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
  ) : (
    <div className="w-full p-2">
      <div className="flex items-center gap-10 p-2">
        <h2>{header}</h2>
        <SearchComponent width="50" />
        <h2 className="text-black">Filter</h2>
      </div>
      <div className="flex flex-wrap flex-shrink gap-5 p-2">
        {libGames.map((game) => {
          return (
            <GameCard
              key={game.id}
              name={game.games.name}
              img={game.games.background_img}
              id={game.games.id}
            ></GameCard>
          );
        })}
      </div>
    </div>
  );
}

export default FullCardContainer;
