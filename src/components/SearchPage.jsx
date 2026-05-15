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
      } else if (location.pathname === "/search/movies") {
        const res = await supabase.functions.invoke("search-media", {
          body: JSON.stringify({
            query: query,
          }),
        });
        console.log(res.data);

        setMovies(res.data);
      }
    };

    handleSearch();
  }, [query, location.pathname]);

  if (location.pathname === "/search/games") {
    return (
      <>
        <NavBar q={query}></NavBar>
        <div className="w-full flex gap-50  justify-center content-center">
          <button
            onClick={() => {
              navigate(`/search/games?q=${query}`);
            }}
          >
            game
          </button>
          <button
            onClick={() => {
              navigate(`/search/movies?q=${query}`);
            }}
          >
            movies
          </button>
        </div>

        <div className="flex flex-wrap gap-5 p-4">
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
        </div>
      </>
    );
  } else {
    return (
      <>
        <NavBar q={query}></NavBar>
        <div className="w-full flex gap-50  justify-center content-center">
          <button
            onClick={() => {
              navigate(`/search/games?q=${query}`);
            }}
          >
            game
          </button>
          <button
            onClick={() => {
              navigate(`/search/movies?q=${query}`);
            }}
          >
            movies
          </button>
        </div>

        <div className="flex flex-wrap gap-5 p-4">
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
        </div>
      </>
    );
  }
}

export default SearchPage;
