import { useState } from "react";

import GameCard from "./GameCard";
import { useLocation, useSearchParams } from "react-router";
import { useData } from "../DataContext";

function FullCardContainer({ header, media_type }) {
  const { games, movies, loading } = useData();

  console.log(header);

  let libItems = [];

  if (media_type === "movies") {
    libItems = movies.filter(
      (item) => header === undefined || item.status === header,
    );
  } else if (media_type === "games") {
    libItems = games.filter(
      (item) => header === undefined || item.status === header,
    );
  }

  const [localSearch, setLocalSearch] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const filteredItems = libItems.filter((item) => {
    const itemName = item?.games?.name || item?.movies?.title || "";

    return itemName.toLowerCase().includes(localSearch.toLowerCase());
  });

  const currentPage = Number(searchParams.get("p")) || 1;

  const CARDS_PER_PAGE = 12;

  const startIndex = (currentPage - 1) * CARDS_PER_PAGE;

  const endIndex = startIndex + CARDS_PER_PAGE;

  const visibleItems = filteredItems.slice(startIndex, endIndex);

  const totalPages = Math.ceil(filteredItems.length / CARDS_PER_PAGE);

  if (loading) {
    return (
      <>
        <div>
          <div className="w-full ps-5 pe-5 text-text-primary">
            <div className="flex items-center justify-between p-2 items-center">
              <div className="flex items-center gap-10 p-2 ">
                <h2 className="text-3xl max-sm:text-2xl">
                  {header?.charAt(0).toUpperCase() + header?.slice(1) ||
                    location.pathname.split("/")[1]?.charAt(0).toUpperCase() +
                      location.pathname.split("/")[1]?.slice(1)}
                </h2>
                <input
                  type="text"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  placeholder="search..."
                  className="bg-search border-1 border-white/10 rounded-2xl px-2 focus:border-white/20 focus:outline-none mbe-[-6px] w-full"
                />
              </div>
            </div>
            <div
              className="grid
  grid-cols-[repeat(auto-fill,minmax(140px,1fr))]
  gap-3  p-4 max-sm:flex max-sm:flex-wrap max-sm:px-0"
            >
              <GameCard loading={loading}></GameCard>
              <GameCard loading={loading}></GameCard>
              <GameCard loading={loading}></GameCard>
              <GameCard loading={loading}></GameCard>
              <GameCard loading={loading}></GameCard>
              <GameCard loading={loading}></GameCard>
              <GameCard loading={loading}></GameCard>
              <GameCard loading={loading}></GameCard>
              <GameCard loading={loading}></GameCard>
              <GameCard loading={loading}></GameCard>
              <GameCard loading={loading}></GameCard>
              <GameCard loading={loading}></GameCard>
              <GameCard loading={loading}></GameCard>
              <GameCard loading={loading}></GameCard>
              <GameCard loading={loading}></GameCard>
              <GameCard loading={loading}></GameCard>
              <GameCard loading={loading}></GameCard>
              <GameCard loading={loading}></GameCard>
              <GameCard loading={loading}></GameCard>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (location.pathname.includes("games")) {
    return (
      <div className="w-full ps-5 pe-5 text-text-primary">
        <div className="flex items-center justify-between p-2 items-center">
          <div className="flex items-center gap-10 p-2 ">
            <h2 className="text-3xl max-sm:text-2xl">
              {header?.charAt(0).toUpperCase() + header?.slice(1) ||
                location.pathname.split("/")[1]?.charAt(0).toUpperCase() +
                  location.pathname.split("/")[1]?.slice(1)}
            </h2>
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="search..."
              className="bg-search border-1 border-white/10 rounded-2xl px-2 focus:border-white/20 focus:outline-none mbe-[-6px] w-full"
            />
          </div>
        </div>
        <div
          className="grid
  grid-cols-[repeat(auto-fill,minmax(140px,1fr))]
  gap-3  p-4 max-sm:flex max-sm:flex-wrap max-sm:px-0"
        >
          {visibleItems.map((game) => {
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
        <div className="pbs-5">
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
    );
  } else if (location.pathname.includes("movies")) {
    return (
      <div className="w-full ps-5 pe-5 text-text-primary">
        <div className="flex items-center justify-between p-2 items-center">
          <div className="flex items-center gap-10 p-2 ">
            <h2 className="text-3xl max-sm:text-2xl">
              {header?.charAt(0).toUpperCase() + header?.slice(1) ||
                location.pathname.split("/")[1]?.charAt(0).toUpperCase() +
                  location.pathname.split("/")[1]?.slice(1)}
            </h2>
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="search..."
              className="bg-search border-1 border-white/10 rounded-2xl px-2 focus:border-white/20 focus:outline-none mbe-[-6px] w-full"
            />
          </div>
        </div>
        <div
          className="grid
  grid-cols-[repeat(auto-fill,minmax(140px,1fr))]
  gap-3 p-4 max-sm:flex max-sm:flex-wrap max-sm:p-0"
        >
          {visibleItems.map((item) => {
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
        <div className="pbs-5">
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
    );
  }
}

export default FullCardContainer;
