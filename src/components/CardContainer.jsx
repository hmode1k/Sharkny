import { useEffect, useState } from "react";
import GameCard from "./GameCard";
import { supabase } from "../supabase-client";
import { useLocation, useNavigate } from "react-router";

function CardContainer({ header, userId, id }) {
  const [libGames, setLibGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  function handleNavigate() {
    if (location.pathname.startsWith("/profile")) {
      navigate(`/profile/${id}/${header}`);
    } else {
      navigate(`/${header}`);
    }
  }

  useEffect(() => {
    const fetchLibrary = async () => {
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
        .eq("user_id", userId)
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
  }, [header, userId]);

  return loading ? (
    <>
      <h1>Loading</h1>
    </>
  ) : (
    <div className="p-4">
      <div className="flex gap-4 ps-4 mbe-2">
        <h2 className="text-2xl">{header}</h2>
        <h2 onClick={handleNavigate}>Expand</h2>
      </div>
      <div className="flex flex-row flex-nowrap *:shrink-0 p-4 gap-4 overflow-x-scroll overflow-y-hidden hover-scroll w-full relative">
        {libGames.map((game) => {
          return (
            <GameCard
              key={game.id}
              id={game.games.id}
              name={game.games.name}
              img={game.games.background_img}
              platform={game.platform}
              status={game.status}
            ></GameCard>
          );
        })}
      </div>
    </div>
  );
}

export default CardContainer;
