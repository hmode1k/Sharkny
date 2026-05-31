import { useEffect, useRef, useState } from "react";
import GameCard from "./GameCard";
import { useLocation, useNavigate } from "react-router";
import { useData } from "../DataContext";
import { supabase } from "../supabase-client";

function CardContainer({ header, id, media_type, URLId }) {
  const [games, setGames] = useState([]);
  const [movies, setMovies] = useState([]);

  const {
    games: contextGames,
    movies: contextMovies,
    loading: contextLoading,
  } = useData();

  const [loading, setLoading] = useState(contextLoading);

  useEffect(() => {
    if (id === undefined) {
      setGames(contextGames);
      setMovies(contextMovies);
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      if (id === undefined) {
        return;
      }
      setLoading(true);
      const { data: games } = await supabase
        .from("users_games")
        .select(`* , games(*)`)
        .eq("user_id", id);
      const { data: movies } = await supabase
        .from("users_movies")
        .select(`* , movies(*)`)
        .eq("user_id", id);

      setGames(games);
      setMovies(movies);
      setLoading(false);
    };

    fetchData();
  }, [id, contextGames, contextMovies]);

  const location = useLocation();
  const navigate = useNavigate();
  const ref = useRef(null);

  function handleNavigate() {
    if (location.pathname.startsWith("/profile")) {
      navigate(`/profile/${URLId}/${media_type}/${header}`);
    } else {
      navigate(`/${media_type}/${header}`);
    }
  }

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleWheel = (e) => {
      if (e.deltaY === 0) return;

      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", handleWheel);
    };
  }, [ref.current]);

  if ((loading && id !== undefined) || (contextLoading && id === undefined)) {
    return (
      <>
        <div>
          <div className="p-4">
            <div className="flex gap-4 ps-4 mbe-2 items-center">
              <h2 className="text-2xl max-sm:text-xl">
                {header.charAt(0).toUpperCase() + header.slice(1)}
              </h2>
              <h2
                onClick={handleNavigate}
                className="cursor-pointer mbs-1 text-text-muted hover:text-text-secondary transition-all delay-20 text-lg max-sm:text-sm"
              >
                ➜
              </h2>
            </div>

            <div
              className="flex flex-row flex-nowrap *:shrink-0 p-4 gap-4 overflow-x-scroll overflow-y-hidden hover-scroll w-full relative"
              ref={ref}
            >
              <GameCard
                loading={id === undefined ? contextLoading : loading}
              ></GameCard>
              <GameCard
                loading={id === undefined ? contextLoading : loading}
              ></GameCard>
              <GameCard
                loading={id === undefined ? contextLoading : loading}
              ></GameCard>
              <GameCard
                loading={id === undefined ? contextLoading : loading}
              ></GameCard>
              <GameCard
                loading={id === undefined ? contextLoading : loading}
              ></GameCard>
              <GameCard
                loading={id === undefined ? contextLoading : loading}
              ></GameCard>
              <GameCard
                loading={id === undefined ? contextLoading : loading}
              ></GameCard>
              <GameCard
                loading={id === undefined ? contextLoading : loading}
              ></GameCard>
              <GameCard
                loading={id === undefined ? contextLoading : loading}
              ></GameCard>
              <GameCard
                loading={id === undefined ? contextLoading : loading}
              ></GameCard>
              <GameCard
                loading={id === undefined ? contextLoading : loading}
              ></GameCard>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (media_type === "games" && !loading) {
    return (
      <div className="p-4">
        <div className="flex gap-4 ps-4 mbe-2 items-center">
          <h2 className="text-2xl max-sm:text-xl">
            {header.charAt(0).toUpperCase() + header.slice(1)}
          </h2>
          <h2
            onClick={handleNavigate}
            className="cursor-pointer mbs-1 text-text-muted hover:text-text-secondary transition-all delay-20 text-lg max-sm:text-sm"
          >
            ➜
          </h2>
        </div>

        <div
          className="flex flex-row flex-nowrap *:shrink-0 p-4 gap-4 overflow-x-scroll overflow-y-hidden hover-scroll w-full relative"
          ref={ref}
        >
          {games
            .filter((item) => item?.status === header)
            .map((item) => {
              return (
                <GameCard
                  key={item.id}
                  id={item.games.id}
                  name={item.games.name}
                  img={item.games.cover}
                  platform={item.platform}
                  status={item.status}
                  media_type={media_type}
                ></GameCard>
              );
            })}
          {games.filter((item) => item.status === header).length === 0 && (
            <>
              <h1>This List Is Empty</h1>
            </>
          )}
        </div>
      </div>
    );
  } else if (media_type === "movies" && !loading) {
    return (
      <div className="p-4">
        <div className="flex gap-4 ps-4 mbe-2">
          <h2 className="text-2xl">
            {header.charAt(0).toUpperCase() + header.slice(1)}
          </h2>
          <h2
            onClick={handleNavigate}
            className="cursor-pointer mbs-1 text-text-muted hover:text-text-secondary transition-all delay-20 text-lg"
          >
            ➜
          </h2>
        </div>
        <div
          className="flex flex-row flex-nowrap *:shrink-0 p-4 gap-4 overflow-x-scroll overflow-y-hidden hover-scroll w-full relative"
          ref={ref}
        >
          {movies
            .filter((item) => item?.status === header)
            .map((item) => {
              return (
                <GameCard
                  key={item.movie_id}
                  id={item.movie_id}
                  name={item.movies.title}
                  img={item.movies.poster}
                  status={item.status}
                  media_type={item.movies.media_type}
                ></GameCard>
              );
            })}
          {movies.filter((item) => item.status === header).length === 0 && (
            <>
              <h1>This List Is Empty</h1>
            </>
          )}
        </div>
      </div>
    );
  }
}

export default CardContainer;
