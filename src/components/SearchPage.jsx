import NavBar from "./NavBar";
import GameCard from "./GameCard";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { supabase } from "../supabase-client";

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const query = searchParams.get("q");
  const recent = searchParams.get("recent") || null;

  const [visibleGames, setVisibleGames] = useState(null);
  const [movies, setMovies] = useState([]);
  const [moviesToatlPages, setMoviesTotalPages] = useState(null);
  const [gamesTotalPages, setGamesTotalPages] = useState(null);
  const [loading, setLoading] = useState(true);

  const currentPage = Number(searchParams.get("p")) || 1;

  function getPages(current, total) {
    const pages = [];

    const delta = 2; // how many pages around current

    const range = [];

    for (
      let i = Math.max(2, current - delta);
      i <= Math.min(total - 1, current + delta);
      i++
    ) {
      range.push(i);
    }

    // always include first page
    pages.push(1);

    if (current - delta > 2) {
      pages.push("...");
    }

    pages.push(...range);

    if (current + delta < total - 1) {
      pages.push("...");
    }

    // always include last page
    if (total > 1) {
      pages.push(total);
    }

    return pages;
  }

  function getVisibleGames(games) {
    const CARDS_PER_PAGE = 20;

    const startIndex = (currentPage - 1) * CARDS_PER_PAGE;

    const endIndex = startIndex + CARDS_PER_PAGE;

    setVisibleGames(games.slice(startIndex, endIndex));
  }

  useEffect(() => {
    setLoading(true);
    const handleSearch = async () => {
      const gamesRes = await supabase.functions.invoke("search-games", {
        body: JSON.stringify({
          search: query,
          page: currentPage,
          recent: recent,
        }),
      });

      const ranked = gamesRes.data.sort(
        (a, b) => (b.total_rating_count || 0) - (a.total_rating_count || 0),
      );

      let totalPages;
      if (query) {
        totalPages = Math.ceil(ranked.length / 20);
        getVisibleGames(ranked);
      } else {
        setVisibleGames(ranked);
        totalPages = 50;
      }
      setGamesTotalPages(getPages(currentPage, totalPages));

      const movieRes = await supabase.functions.invoke("search-media", {
        body: JSON.stringify({
          query: query,
          page: currentPage,
        }),
      });

      setMovies(movieRes.data.results);
      setMoviesTotalPages(getPages(currentPage, movieRes.data.total_pages));
      setLoading(false);
    };

    handleSearch();
  }, [query, location.pathname, currentPage, recent]);

  if (loading) {
    return (
      <>
        <div>
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
                className={`${location.pathname.includes("games") && "active"}`}
              >
                Games
              </button>
              <button
                onClick={() => {
                  navigate(`/search/movies?q=${query}`);
                }}
                className={`${location.pathname.includes("movies") && "active"}`}
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
          </div>
        </div>
      </>
    );
  }

  if (
    visibleGames.length === 0 &&
    !loading &&
    location.pathname.includes("games")
  ) {
    return (
      <>
        <div>
          <div>
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
            <div>
              <h1 className="text-text-primary p-4">No Results</h1>
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
            <NavBar q={query}></NavBar>
            <div className="flex w-full items-center relative text-text-primary">
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
            <div>
              <h1 className="text-text-primary p-4">No Results</h1>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (location.pathname === "/search/games") {
    return (
      <div className="bg-main text-text-primary h-full ">
        <NavBar q={query}></NavBar>
        <div className="flex w-full items-center  relative">
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

        <div className="flex flex-wrap gap-5 p-4 bg-main h-full items-center justify-center max-sm:p-2">
          {visibleGames.map((game) => {
            return (
              <GameCard
                key={game.id}
                name={game.name}
                img={
                  game.cover?.url
                    ? game.cover.url
                    : "https://imgs.search.brave.com/I9lRT1KD63dS5F4kY28jKwaJsWWrEuMQbZiIJV-jd0k/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/bWFnbmlmaWMuY29t/L3ByZW1pdW0tdmVj/dG9yL3RpY2stbWFy/ay1pY29uLXN5bWJv/bC12ZWN0b3ItaWxs/dXN0cmF0aW9uXzg3/NTI0MC0yOTA2Lmpw/Zz9zZW10PWFpc19o/eWJyaWQmdz03NDAm/cT04MA"
                }
                id={game.id}
                media_type={"games"}
              ></GameCard>
            );
          })}
        </div>
        <div className="px-8 p-2 flex gap-2 items-center">
          {gamesTotalPages.map((p, i) =>
            p === "..." ? (
              <span key={i} className="px-2">
                ...
              </span>
            ) : (
              <button
                key={i}
                onClick={() => setSearchParams({ p, q: query, recent: recent })}
                className={`p-1 ${
                  p === currentPage
                    ? "text-text-primary font-bold"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {p}
              </button>
            ),
          )}
          <div>
            {recent && (
              <>
                <select
                  value={recent}
                  onChange={(e) => {
                    setSearchParams((prev) => {
                      const params = new URLSearchParams(prev);
                      params.set("recent", e.target.value);
                      params.set("p", "1"); // reset pagination
                      return params;
                    });
                  }}
                >
                  <option value="week" className="text-black">
                    This Week
                  </option>
                  <option value="month" className="text-black">
                    This Month
                  </option>
                  <option value="year" className="text-black">
                    This Year
                  </option>
                  <option value="all" className="text-black">
                    All Time
                  </option>
                </select>
              </>
            )}
          </div>
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

        <div className="flex flex-wrap gap-5 p-4 bg-main h-full items-center justify-center max-sm:p-2">
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
        <div className="px-8 p-2 flex gap-2">
          {moviesToatlPages.map((p, i) =>
            p === "..." ? (
              <span key={i} className="px-2">
                ...
              </span>
            ) : (
              <button
                key={i}
                onClick={() => setSearchParams({ p, q: query })}
                className={`p-1 ${
                  p === currentPage
                    ? "text-text-primary font-bold"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {p}
              </button>
            ),
          )}
        </div>
      </div>
    );
  }
}

export default SearchPage;
