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
      const gamesRes = await supabase.functions.invoke("search-games", {
        body: JSON.stringify({
          search: query,
        }),
      });

      const ranked = gamesRes.data.sort((a, b) => {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();

        if (aName === query) return -1;
        if (bName === query) return 1;

        return 0;
      });

      setGames(ranked);

      const movieRes = await supabase.functions.invoke("search-media", {
        body: JSON.stringify({
          query: query,
        }),
      });

      setMovies(movieRes.data);
      setLoading(false);
    };

    handleSearch();
  }, [query, location.pathname]);

  if (loading) {
    return (
      <>
        <div>
          <NavBar></NavBar>
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
          <div className="flex flex-wrap gap-5 p-4 bg-main h-full items-center max-sm:p-2">
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
      </>
    );
  }

  if (games.length === 0 && !loading && location.pathname.includes("games")) {
    return (
      <>
        <div>
          <div>
            <NavBar></NavBar>
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
            <div>
              <h1>No Results</h1>
            </div>
          </div>
        </div>
      </>
    );
  } else if (
    movies.length === 0 &&
    !loading &&
    location.pathname.includes("movies")
  ) {
    return (
      <>
        <div>
          <div>
            <NavBar></NavBar>
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
            <div>
              <h1>No Results</h1>
            </div>
          </div>
        </div>
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

        <div className="flex flex-wrap gap-5 p-4 bg-main h-full items-center max-sm:p-2">
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
      </div>
    );
  } else {
    return (
      <div className="bg-main text-text-primary h-full">
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
          <div className="w-full flex gap-50  justify-center content-center bg-main h-full tab ">
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
        </div>

        <div className="flex flex-wrap gap-5 p-4 bg-main h-full items-center max-sm:p-2">
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
      </div>
    );
  }
}

export default SearchPage;
