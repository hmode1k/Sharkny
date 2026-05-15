import { useState, useEffect } from "react";
import { supabase } from "../supabase-client";

import GameCard from "./GameCard";
import SearchComponent from "./SearchComponent";
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

          setLoading(false);
          setLibItems(data);
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

          setLoading(false);
          setLibItems(data);
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

          setLoading(false);
          setLibItems(data);
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

          setLoading(false);
          setLibItems(data);
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

  const CARDS_PER_PAGE = 18;

  const startIndex = (currentPage - 1) * CARDS_PER_PAGE;

  const endIndex = startIndex + CARDS_PER_PAGE;

  const visibleGames = filteredItems.slice(startIndex, endIndex);

  const totalPages = Math.ceil(filteredItems.length / CARDS_PER_PAGE);

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
  if (location.pathname.includes("games")) {
    return (
      <div className="w-full ps-15 pe-15">
        <div className="flex items-center gap-10 p-2">
          <h2>{header || location.pathname.split("/")[1]}</h2>
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="search..."
            className="bg-green-500"
          />
        </div>
        <div
          className="grid
  grid-cols-[repeat(auto-fill,minmax(140px,1fr))]
  gap-3 border-black border-3 p-4"
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
        {Array.from({ length: totalPages }, (_, i) => (
          <button key={i} onClick={() => setSearchParams({ p: i + 1 })}>
            {i + 1}
          </button>
        ))}
      </div>
    );
  } else if (location.pathname.includes("movies")) {
    return (
      <div className="w-full ps-15 pe-15">
        <div className="flex items-center gap-10 p-2">
          <h2>{header || location.pathname.split("/")[1]}</h2>
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="search..."
          />
        </div>
        <div
          className="grid
  grid-cols-[repeat(auto-fill,minmax(140px,1fr))]
  gap-2 border-black border-3 p-4"
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
        {Array.from({ length: totalPages }, (_, i) => (
          <button key={i} onClick={() => setSearchParams({ p: i + 1 })}>
            {i + 1}
          </button>
        ))}
      </div>
    );
  }
}

export default FullCardContainer;
