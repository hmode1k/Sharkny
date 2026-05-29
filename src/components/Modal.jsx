import { useState } from "react";
import { supabase } from "../supabase-client";
import { useParams } from "react-router";
import { useAuth } from "../AuthContext";
import { useData } from "../DataContext";

function Modal({ dbstatus, dbplatform, setEditing, type, id, name }) {
  const { setGames, setMovies } = useData();
  const { user } = useAuth();
  const [status, setStatus] = useState(dbstatus);
  const [platform, setPlatform] = useState(dbplatform);
  const [toast, setToast] = useState("");
  const [toastType, setToastType] = useState("");
  const { category } = useParams();
  console.log(category);

  function handleClose() {
    setEditing(false);
  }

  const handleEdit = async (e) => {
    e.preventDefault();

    if (category === "games") {
      const { error } = await supabase
        .from("users_games")
        .update({
          platform: platform,
          status: status,
        })
        .eq("game_id", id)
        .eq("user_id", user.id);

      if (error) {
        console.error(error);
        setToastType("error");
        setToast("Error");
        return;
      }

      setToastType("Success");
      setToast("Editied Game");
      setGames((prev) =>
        prev.map((game) =>
          game.game_id === id ? { ...game, status: status } : game,
        ),
      );
      setTimeout(() => {
        handleClose();
      }, 1000);
      console.log("edited");
    } else {
      const { error } = await supabase
        .from("users_movies")
        .update({
          platform: platform,
          status: status,
        })
        .eq("movie_id", id)
        .eq("user_id", user.id);

      if (error) {
        console.error(error);
        setToastType("error");
        setToast("Error");
        return;
      }
      setToastType("Success");
      setToast("Edited Movie");
      setMovies((prev) =>
        prev.map((movie) =>
          movie.movies.id === id ? { ...movie, status: status } : movie,
        ),
      );
      setTimeout(() => {
        handleClose();
      }, 1000);
    }
  };

  const handleDelete = async () => {
    if (category === "games") {
      const { error } = await supabase
        .from("users_games")
        .delete("")
        .eq("game_id", id)
        .eq("user_id", user.id);

      if (error) {
        console.error(error);
        setToastType("error");
        setToast("Error");
        return;
      }
      setToastType("Success");
      setToast("Deleted Game");
      setGames((prev) => prev.filter((item) => item.games.id !== id));
      setTimeout(() => {
        handleClose();
      }, 1000);
    } else {
      const { error } = await supabase
        .from("users_movies")
        .delete("")
        .eq("movie_id", id)
        .eq("user_id", user.id);

      if (error) {
        console.error(error);
        setToastType("error");
        setToast("Error");
        return;
      }
      setToastType("Success");
      setToast("Deleted Movie");
      setMovies((prev) => prev.filter((item) => item.movies.id !== id));

      setTimeout(() => {
        handleClose();
      }, 1000);
    }
  };

  return (
    <>
      {type === "edit" ? (
        <>
          <div
            className="fixed w-screen h-screen z-20 flex items-center justify-center  top-0 left-0  bg-black/80 text-white p-4"
            onClick={(e) => {
              handleClose();
              e.stopPropagation();
            }}
          >
            <div className="flex flex-col gap-5">
              <div
                className=" bg-nav p-4 rounded-lg"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <div className="w-full flex justify-between items-center pbe-4">
                  <h1>{name}</h1>
                  <button
                    onClick={() => {
                      handleClose();
                    }}
                  >
                    X
                  </button>
                </div>
                <div className="">
                  <form action="">
                    <h1 className="p-2">Status:</h1>

                    <fieldset className="flex gap-2">
                      <label className="cursor-pointer inline-flex items-center gap-2">
                        <input
                          type="radio"
                          name={status}
                          value="library"
                          className="peer sr-only"
                          checked={status === "library"}
                          onChange={(e) => setStatus(e.target.value)}
                        />

                        <span className=" px-4 rounded-full border border-gray-500 text-gray-300 select-none transition   peer-checked:border-accent-primary peer-checked:text-accent-text peer-checked:bg-accent-primary">
                          Library
                        </span>
                      </label>
                      <label className="cursor-pointer inline-flex items-center gap-2">
                        <input
                          type="radio"
                          name={status}
                          value="wishlist"
                          className="peer sr-only"
                          checked={status === "wishlist"}
                          onChange={(e) => setStatus(e.target.value)}
                        />

                        <span className=" px-4 rounded-full border border-gray-500 text-gray-300 select-none transition   peer-checked:border-accent-primary peer-checked:text-accent-text peer-checked:bg-accent-primary">
                          Wishlist
                        </span>
                      </label>

                      <label className="cursor-pointer inline-flex items-center gap-2">
                        <input
                          type="radio"
                          name={status}
                          value="completed"
                          className="peer sr-only"
                          checked={status === "completed"}
                          onChange={(e) => setStatus(e.target.value)}
                        />

                        <span className=" px-4 rounded-full border border-gray-500 text-gray-300 select-none transition   peer-checked:border-accent-primary peer-checked:text-accent-text peer-checked:bg-accent-primary">
                          Completed
                        </span>
                      </label>
                    </fieldset>
                    {category === "games" ? (
                      <>
                        <h1 className="p-2">Platform:</h1>
                        <fieldset className="flex gap-2">
                          <label className="cursor-pointer inline-flex items-center gap-2">
                            <input
                              type="radio"
                              name={platform}
                              value="fitgirl"
                              checked={platform === "fitgirl"}
                              className="peer sr-only"
                              onChange={(e) => {
                                setPlatform(e.target.value);
                              }}
                            />

                            <span className=" px-4 rounded-full border border-gray-500 text-gray-300 select-none transition   peer-checked:border-accent-primary peer-checked:text-accent-text peer-checked:bg-accent-primary">
                              Fitgirl
                            </span>
                          </label>
                          <label className="cursor-pointer inline-flex items-center gap-2">
                            <input
                              type="radio"
                              name={platform}
                              value="dodi"
                              checked={platform === "dodi"}
                              className="peer sr-only"
                              onChange={(e) => {
                                setPlatform(e.target.value);
                              }}
                            />

                            <span className=" px-4 rounded-full border border-gray-500 text-gray-300 select-none transition   peer-checked:border-accent-primary peer-checked:text-accent-text peer-checked:bg-accent-primary">
                              Dodi
                            </span>
                          </label>
                          <label className="cursor-pointer inline-flex items-center gap-2">
                            <input
                              type="radio"
                              name={platform}
                              value="steamrip"
                              checked={platform === "steamrip"}
                              className="peer sr-only"
                              onChange={(e) => {
                                setPlatform(e.target.value);
                              }}
                            />
                            <span className=" px-4 rounded-full border border-gray-500 text-gray-300 select-none transition   peer-checked:border-accent-primary peer-checked:text-accent-text peer-checked:bg-accent-primary">
                              Steamrip
                            </span>
                          </label>
                        </fieldset>
                      </>
                    ) : (
                      <></>
                    )}

                    <button
                      type="submit"
                      onClick={handleEdit}
                      className="w-full p-2 mbs-4 bg-accent-primary text-accent-text rounded-2xl hover:bg-accent-hover transition-all duration-100"
                    >
                      Edit
                    </button>
                  </form>
                </div>
              </div>
              <div>
                {toast.length === 0 ? (
                  <></>
                ) : (
                  <>
                    <h1
                      className={` border-1 px-4 rounded-xl z-40 text-text-primary text-center ${toastType === "error" ? "bg-red-500/20 border-red-500" : "bg-green-500/20 border-green-500"}`}
                    >
                      {toast}
                    </h1>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div
            className="fixed w-screen h-screen z-20 flex items-center justify-center  top-0 left-0  bg-black/80 text-white"
            onClick={() => handleClose()}
          >
            <div className="flex flex-col gap-5">
              <div
                className="bg-nav p-4 rounded-lg"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <div className="flex justify-between items-center w-full ">
                  <h1>Delete</h1>
                  <h1
                    onClick={() => {
                      handleClose();
                    }}
                    className="cursor-pointer"
                  >
                    X
                  </h1>
                </div>
                <div>
                  <h1 className="mbs-2 py-2">
                    Are You Sure You Want To Delete{" "}
                    <span className="bold text-red-400">{name}</span>
                  </h1>
                  <button
                    onClick={handleDelete}
                    className="mbs-2 p-2 w-full bg-red-500 rounded-2xl tranisiton-all duration-200 hover:opacity-[0.7]"
                  >
                    DELETE
                  </button>
                </div>
              </div>
              <div>
                {toast.length === 0 ? (
                  <></>
                ) : (
                  <>
                    <h1
                      className={` border-1 px-4 rounded-xl z-40 text-text-primary text-center ${toastType === "error" ? "bg-red-500/20 border-red-500" : "bg-green-500/20 border-green-500"}`}
                    >
                      {toast}
                    </h1>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Modal;
