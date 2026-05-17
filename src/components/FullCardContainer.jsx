import { useState, useEffect } from "react";
import { supabase } from "../supabase-client";

import GameCard from "./GameCard";
import { useLocation, useSearchParams } from "react-router";

function FullCardContainer({ header, userId, media_type }) {
  const [libItems, setLibItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState(userId);
  const [localSearch, setLocalSearch] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  useEffect(() => {
    const fetchLibrary = async () => {
      if (header) {
        if (id === undefined || id === null) {
          const {
            data: { user },
          } = await supabase.auth.getUser();
          setId(user.id);
        }
        if (location.pathname.includes("games")) {
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

          setLibItems(data);
          setLoading(false);
        } else if (location.pathname.includes("movies")) {
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

          setLibItems(data);
          setLoading(false);
        }
      } else {
        if (id === undefined || id === null) {
          const {
            data: { user },
          } = await supabase.auth.getUser();
          setId(user.id);
        }
        if (location.pathname.includes("games")) {
          const { data, error } = await supabase
            .from("users_games")
            .select(
              `
      *,
      games (*
      )
    `,
            )
            .eq("user_id", id);

          if (error) {
            console.error(error);
            return;
          }

          setLibItems(data);
          setLoading(false);
        } else if (location.pathname.includes("movies")) {
          const { data, error } = await supabase
            .from("users_movies")
            .select(
              `
      *,
      movies (*
      )
    `,
            )
            .eq("user_id", id);

          if (error) {
            console.error(error);
            return;
          }

          setLibItems(data);
          setLoading(false);
        }
      }
    };

    fetchLibrary();
  }, [header, id, location.pathname]);

  const filteredItems = libItems.filter((item) => {
    const itemName = item?.games?.name || item?.movies?.title || "";

    return itemName.toLowerCase().includes(localSearch.toLowerCase());
  });

  const currentPage = Number(searchParams.get("p")) || 1;

  const CARDS_PER_PAGE = 10;

  const startIndex = (currentPage - 1) * CARDS_PER_PAGE;

  const endIndex = startIndex + CARDS_PER_PAGE;

  const visibleGames = filteredItems.slice(startIndex, endIndex);

  const totalPages = Math.ceil(filteredItems.length / CARDS_PER_PAGE);

  if (loading) {
    return (
      <div className="w-full p-2">
        <div className="flex items-center gap-10 p-2">
          <h2>{header?.charAt(0).toUpperCase() + header?.slice(1)}</h2>
        </div>
        <div
          className="grid
  grid-cols-[repeat(auto-fill,minmax(220px,1fr))]
  gap-6 gap-5 p-2"
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
  if (location.pathname.includes("games") && !loading) {
    return (
      <div className="w-full ps-15 pe-15 text-text-primary">
        <div className="flex items-center justify-between p-2 items-center">
          <div className="flex items-center gap-10 p-2 ">
            <h2 className="text-3xl">
              {header?.charAt(0).toUpperCase() + header?.slice(1) ||
                location.pathname.split("/")[1]?.charAt(0).toUpperCase() +
                  location.pathname.split("/")[1]?.slice(1)}
            </h2>
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="search..."
              className="bg-search border-1 border-white/10 rounded-2xl px-2 focus:border-white/20 focus:outline-none mbe-[-6px]"
            />
          </div>
          <div>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setSearchParams({ p: i + 1 })}
                className="p-1 text-text-secondary hover:text-text-primary"
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
        <div
          className="grid
  grid-cols-[repeat(auto-fill,minmax(140px,1fr))]
  gap-3  p-4"
        >
          {visibleGames.map((game) => {
            return (
              <GameCard
                key={game.id}
                name={game.games.name}
                img={game.games.cover}
                id={game.games.id}
                platform={game.platform}
                status={game.status}
                media_type={media_type}
              ></GameCard>
            );
          })}
        </div>
      </div>
    );
  } else if (location.pathname.includes("movies") && !loading) {
    return (
      <div className="w-full ps-15 pe-15 text-text-primary">
        <div className="flex items-center justify-between p-2 items-center">
          <div className="flex items-center gap-10 p-2 ">
            <h2 className="text-3xl">
              {header?.charAt(0).toUpperCase() + header?.slice(1) ||
                location.pathname.split("/")[1]?.charAt(0).toUpperCase() +
                  location.pathname.split("/")[1]?.slice(1)}
            </h2>
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="search..."
              className="bg-search border-1 border-white/10 rounded-2xl px-2 focus:border-white/20 focus:outline-none mbe-[-6px]"
            />
          </div>
          <div>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setSearchParams({ p: i + 1 })}
                className="p-1 text-text-secondary hover:text-text-primary"
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
        <div
          className="grid
  grid-cols-[repeat(auto-fill,minmax(140px,1fr))]
  gap-2 p-4"
        >
          {visibleGames.map((item) => {
            return (
              <GameCard
                key={item.id}
                name={item.movies.title}
                img={item.movies.poster}
                id={item.movies.id}
                status={item.status}
                media_type={item.movies.media_type}
              ></GameCard>
            );
          })}
        </div>
      </div>
    );
  }
}

export default FullCardContainer;
