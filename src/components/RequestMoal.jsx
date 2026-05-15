import { useEffect, useState } from "react";

import { useParams } from "react-router";
import { supabase } from "../supabase-client";

function RequestModal() {
  const { id } = useParams();
  const [media, setMedia] = useState(null);
  const [games, setGames] = useState(null);
  const [selectedGames, setSelectedGames] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleRequest = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", user.id);
    console.log("requester id is: ", data[0].id);

    const { error } = await supabase.from("requests").insert({
      requester_id: data[0].id,
      requested_id: id,
      requested_games: selectedGames,
      requested_movies: selectedMedia,
    });

    if (error) {
      console.error(error);
    }
  };

  const toggleGame = (id, name) => {
    setSelectedGames((prev) => {
      const exists = prev.some((g) => g.id === id);

      if (exists) {
        return prev.filter((g) => g.id !== id);
      }

      return [...prev, { id, name }];
    });
  };

  const toggleMovie = (id, name) => {
    setSelectedMedia((prev) => {
      const exists = prev.some((m) => m.id === id);

      if (exists) {
        return prev.filter((m) => m.id !== id);
      }

      return [...prev, { id, name }];
    });
  };

  useEffect(() => {
    const fetchLibrary = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("user_id")
        .eq("id", id);

      const [gamesRes, moviesRes] = await Promise.all([
        supabase
          .from("users_games")
          .select("*, games(*)")
          .eq("user_id", data[0].user_id)
          .eq("status", "library"),

        supabase
          .from("users_movies")
          .select("*, movies(*)")
          .eq("user_id", data[0].user_id)
          .eq("status", "library"),
      ]);

      setMedia(moviesRes.data);
      setGames(gamesRes.data);
      setLoading(false);
    };

    fetchLibrary();
  }, [id]);
  if (loading) {
    return (
      <>
        <h1>loading</h1>
      </>
    );
  } else {
    console.log("selected games", selectedGames);
    console.log("selected media", selectedMedia);

    return (
      <div className="absolute inset-0 translate-[50%] z-10">
        <h1>modal</h1>
        <div>
          <ul>
            <h1>movies</h1>
            {media.map((item) => {
              console.log("item movie id", item.movie_id);
              return (
                <li
                  key={item.movie_id}
                  onClick={() => toggleMovie(item.movie_id, item.movies.title)}
                  className={
                    selectedMedia.some((i) => i.id === item.movie_id)
                      ? "selected"
                      : ""
                  }
                >
                  {item.movies.title}
                </li>
              );
            })}
          </ul>
          <ul>
            <h1>games</h1>
            {games.map((item) => {
              console.log(item);
              return (
                <li
                  key={item.game_id}
                  onClick={() => toggleGame(item.game_id, item.games.name)}
                  className={
                    selectedGames.some((i) => i.id === item.game_id)
                      ? "selected"
                      : ""
                  }
                >
                  {item.games.name}
                </li>
              );
            })}
          </ul>
        </div>
        <button onClick={() => handleRequest()}>Request</button>
        <button>Cancel</button>
      </div>
    );
  }
}
export default RequestModal;
