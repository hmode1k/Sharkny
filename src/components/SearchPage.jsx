import NavBar from "./NavBar";
import GameCard from "./GameCard";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { supabase } from "../supabase-client";

function SearchPage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const query = searchParams.get("q");
  const [games, setGames] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleSearch = async () => {
      if (location.pathname === "/search/games") {
        const res = await supabase.functions.invoke("search-games", {
          body: JSON.stringify({
            search: query,
          }),
        });
        console.log(res.data);

        const ranked = res.data.sort((a, b) => {
          const aName = a.name.toLowerCase();
          const bName = b.name.toLowerCase();

          if (aName === query) return -1;
          if (bName === query) return 1;

          return 0;
        });

        setGames(ranked);
        setLoading(false);
      } else if (location.pathname === "/search/movies") {
        const res = await supabase.functions.invoke("search-media", {
          body: JSON.stringify({
            query: query,
          }),
        });
        console.log(res.data);

        setMovies(res.data);
        setLoading(false);
      }
    };

    handleSearch();
  }, [query, location.pathname]);

  if (loading) {
    return (
      <>
        <h1>loading</h1>
      </>
    );
  }

  if (location.pathname === "/search/games") {
    console.log(games);
    return (
      <div className="bg-main text-text-primary h-full ">
        <NavBar q={query}></NavBar>
        <div className="flex w-full items-center relative">
          <h1
            className="cursor-pointer max-sm:px-6 px-12 absolute text-[2rem] text-text-secondary hover:text-text-primary"
            onClick={() => {
              navigate(-1);
            }}
          >
            ←
          </h1>
          <div className="w-full flex gap-50  justify-center content-center h-full tab">
            <button
              onClick={() => {
                navigate(`/search/games?q=${query}`);
              }}
              className="active"
            >
              Games
            </button>
            <button
              onClick={() => {
                navigate(`/search/movies?q=${query}`);
              }}
            >
              Movies
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-5 p-4 bg-main h-full items-center max-sm:justify-center">
          {games.map((game) => {
            return (
              <GameCard
                key={game.id}
                name={game.name}
                img={
                  game.cover?.url
                    ? game.cover.url
                    : "https://images.igdb.com/igdb/image/upload/t_original/coaarl.jpg"
                }
                id={game.id}
                media_type={"games"}
              ></GameCard>
            );
          })}
          {games.length === 0 && (
            <>
              <h1>No Results</h1>
            </>
          )}
        </div>
      </div>
    );
  } else {
    return (
      <div className="bg-main text-text-primary h-full">
        <NavBar q={query}></NavBar>
        <div className="w-full flex gap-50  justify-center content-center bg-main h-full tab">
          <button
            onClick={() => {
              navigate(`/search/games?q=${query}`);
            }}
          >
            Games
          </button>
          <button
            onClick={() => {
              navigate(`/search/movies?q=${query}`);
            }}
            className="active"
          >
            Movies
          </button>
        </div>

        <div className="flex flex-wrap gap-5 p-4 h-full bg-main">
          {movies.map((movie) => {
            return (
              <GameCard
                key={movie.id}
                name={movie.title}
                img={movie.poster}
                id={movie.id}
                media_type={movie.media_type}
              ></GameCard>
            );
          })}
          {movies.length === 0 && (
            <>
              <h1>No Results</h1>
            </>
          )}
        </div>
      </div>
    );
  }
}

export default SearchPage;
