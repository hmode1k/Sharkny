import { useEffect, useState } from "react";
import GameCard from "./GameCard";
import { Link } from "react-router";
import { supabase } from "../supabase-client";

function CardContainer({ header }) {
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
        .eq("status", header)
        .limit(8);

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
    <>
      <h1>Loading</h1>
    </>
  ) : (
    <div className="p-4">
      <div className="flex gap-4 ps-4 mbe-2">
        <h2 className="text-2xl">{header}</h2>
        <Link to="/library">Expand</Link>
      </div>
      <div className="flex flex-row flex-nowrap *:shrink-0 p-4 gap-4 overflow-x-scroll overflow-y-hidden hover-scroll w-full relative">
        {libGames.map((game) => {
          return (
            <GameCard
              key={game.id}
              name={game.games.name}
              img={game.games.background_img}
            ></GameCard>
          );
        })}
      </div>
    </div>
  );
}

export default CardContainer;
