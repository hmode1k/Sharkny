import { useEffect, useRef } from "react";
import GameCard from "./GameCard";
import { useLocation, useNavigate } from "react-router";
import { useData } from "../DataContext";

function CardContainer({ header, id, media_type }) {
  const { games, movies } = useData();
  const location = useLocation();
  const navigate = useNavigate();
  const ref = useRef(null);

  function handleNavigate() {
    if (location.pathname.startsWith("/profile")) {
      navigate(`/profile/${id}/${media_type}/${header}`);
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

    console.log("container:", el);
    return () => {
      el.removeEventListener("wheel", handleWheel);
    };
  }, [ref.current]);

  if (media_type === "games") {
    return (
      <div className="p-4">
        <div className="flex gap-4 ps-4 mbe-2 items-center">
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
          {games
            .filter((item) => item.status === header)
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
          {games.length === 0 && (
            <>
              <h1 className="text-text-muted">
                Your List Is Empty Fill It Up!
              </h1>
            </>
          )}
        </div>
      </div>
    );
  } else if (media_type === "movies") {
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
            .filter((item) => item.status === header)
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
          {movies.length === 0 && (
            <>
              <h1 className="text-text-muted">
                Your List Is Empty Fill It Up!
              </h1>
            </>
          )}
        </div>
      </div>
    );
  }
}

export default CardContainer;
