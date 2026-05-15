import { useEffect, useRef, useState } from "react";
import GameCard from "./GameCard";
import { supabase } from "../supabase-client";
import { useLocation, useNavigate } from "react-router";

function CardContainer({ header, userId, id, media_type }) {
  const [libItems, setLibItems] = useState([]);
  const [loading, setLoading] = useState(true);
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
    const fetchLibrary = async () => {
      if (media_type === "games") {
        const { data, error } = await supabase
          .from("users_games")
          .select(
            `
    *,
    games (
      *
    )
  `,
          )
          .eq("user_id", userId)
          .eq("status", header)
          .limit(16);

        if (error) {
          console.error(error);
          return;
        }

        setLoading(false);
        setLibItems(data);
      } else if (media_type === "movies") {
        const { data, error } = await supabase
          .from("users_movies")
          .select(
            `
    *,
    movies (
      *
    )
  `,
          )
          .eq("user_id", userId)
          .eq("status", header)
          .limit(16);

        if (error) {
          console.error(error);
          return;
        }

        setLoading(false);
        setLibItems(data);
      }
    };

    fetchLibrary();
  }, [header, userId, media_type]);

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
        <div
          className="flex flex-row flex-nowrap *:shrink-0 p-4 gap-4 overflow-x-scroll overflow-y-hidden hover-scroll w-full relative"
          ref={ref}
        >
          {libItems.map((item) => {
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
        </div>
      </div>
    );
  } else if (media_type === "movies") {
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
          {libItems.map((item) => {
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
        </div>
      </div>
    );
  }
}

export default CardContainer;
