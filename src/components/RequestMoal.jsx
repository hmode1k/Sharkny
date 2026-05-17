import { useEffect, useState } from "react";

import { useParams } from "react-router";
import { supabase } from "../supabase-client";

function RequestModal({ setModalOpen }) {
  const { id } = useParams();
  const [media, setMedia] = useState(null);
  const [games, setGames] = useState(null);
  const [tab, setTab] = useState("games");
  const [toast, setToast] = useState("");
  const [toastType, setToastType] = useState("");
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
      setToastType("error");
      setToast("Error Requseting");
      return;
    }

    setToastType("success");
    setToast("Request Made Successfully");
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
      <div
        className="fixed w-screen h-screen z-20 flex items-center justify-center  top-0 left-0  bg-black/80 text-white p-4"
        onClick={() => setModalOpen(false)}
      >
        <div>
          {toast.length === 0 ? (
            <></>
          ) : (
            <>
              <h1
                className={`absolute left-[40%] bottom-5 border-1 px-4 rounded-xl text-text-primary ${toastType === "error" ? "bg-red-500/20 border-red-500" : "bg-green-500/20 border-green-500"}`}
              >
                {toast}
              </h1>
            </>
          )}
        </div>
        <div
          className=" p-2 rounded-2xl bg-main w-[30%] h-[80%]"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="h-full">
            <div className="flex justify-between p-2">
              <h1>Request</h1>
              <button
                onClick={() => {
                  setModalOpen(false);
                }}
              >
                X
              </button>
            </div>
            <div className="flex gap-5 tab px-4">
              <button
                onClick={() => {
                  setTab("games");
                }}
                className={`${tab === "games" && "active"}`}
              >
                Games
              </button>
              <button
                onClick={() => {
                  setTab("movies");
                }}
                className={`${tab === "movies" && "active"}`}
              >
                Movies
              </button>
            </div>
            <div className="h-full flex flex-col">
              {tab === "games" ? (
                <div className="overflow-scroll h-[60%] pbe-4">
                  <ul className=" p-4 flex flex-col gap-2">
                    {games.map((item) => {
                      console.log(item);
                      return (
                        <li
                          key={item.game_id}
                          onClick={() =>
                            toggleGame(item.game_id, item.games.name)
                          }
                          className={`${
                            selectedGames.some((i) => i.id === item.game_id)
                              ? "selected"
                              : ""
                          } w-full border-white border-1 px-2 rounded-xl cursor-pointer`}
                        >
                          {item.games.name}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : (
                <div className="overflow-scroll h-[60%] pbe-4">
                  <ul className=" p-4 flex flex-col gap-2">
                    {media.map((item) => {
                      console.log("item movie id", item.movie_id);
                      return (
                        <li
                          key={item.movie_id}
                          onClick={() =>
                            toggleMovie(item.movie_id, item.movies.title)
                          }
                          className={`${
                            selectedMedia.some((i) => i.id === item.movie_id)
                              ? "selected"
                              : ""
                          } w-full border-white border-1 px-2 rounded-xl cursor-pointer`}
                        >
                          {item.movies.title}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
              <button
                onClick={() => handleRequest()}
                className="text-text-primary bg-accent-primary hover:bg-accent-hover transition-all duration-200 cursor-pointer w-full mbs-8 rounded-2xl"
              >
                Request
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default RequestModal;
