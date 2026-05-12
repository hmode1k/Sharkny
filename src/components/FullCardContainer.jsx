import { useState, useEffect } from "react";
import { supabase } from "../supabase-client";

import GameCard from "./GameCard";
import SearchComponent from "./SearchComponent";

function FullCardContainer({ header, userId }) {
  const [libGames, setLibGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState(userId);
  console.log(id);

  useEffect(() => {
    const fetchLibrary = async () => {
      if (id === undefined || id === null) {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setId(user.id);
      }
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
        .eq("user_id", id)
        .eq("status", header);

      if (error) {
        console.error(error);
        return;
      }

      setLoading(false);
      setLibGames(data);
    };

    fetchLibrary();
  }, [header, id]);

  return loading ? (
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
  ) : (
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
        {libGames.map((game) => {
          return (
            <GameCard
              key={game.id}
              name={game.games.name}
              img={game.games.background_img}
              id={game.games.id}
              platform={game.platform}
              status={game.status}
            ></GameCard>
          );
        })}
      </div>
    </div>
  );
}

export default FullCardContainer;
