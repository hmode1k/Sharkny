import { useEffect, useRef, useState } from "react";
import NavBar from "./NavBar";
import { useNavigate, useParams } from "react-router";
import { supabase } from "../supabase-client";
import { useData } from "../DataContext";
import { useAuth } from "../AuthContext";

function GameInfoPage() {
  const { user } = useAuth();
  const { setGames } = useData();
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gameExists, setGameExists] = useState(false);
  const [toast, setToast] = useState("");
  const [toastType, setToastType] = useState("");
  const [status, setStatus] = useState("library");
  const [platform, setPlatform] = useState("fitgirl");
  const ref = useRef();
  console.log(platform);
  console.log(status);
  const navigate = useNavigate();

  const handleback = (e) => {
    e.preventDefault();
    navigate(-1);
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from("users_games")
      .delete("")
      .eq("game_id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error(error);
      setToastType("error");
      setToast("Error");
      setTimeout(() => {
        setToast("");
      }, 3000);
      return;
    }

    setToastType("Success");
    setToast("Deleted Game");
    setGameExists(false);
    setGames((prev) => prev.filter((item) => item.games.id !== Number(id)));
    console.log();
    setTimeout(() => {
      setToast("");
    }, 3000);
  };

  const handleInsertion = async (e) => {
    e.preventDefault();

    const { error } = await supabase.from("games").insert({
      id: game.id,
      name: game.name,
      cover: game.cover?.url
        ? game.cover.url.replace("t_thumb", "t_cover_big")
        : "",
      summary: game.summary,
      screenshots:
        game.screenshots?.map((s) => ({
          url: s.url.replace("t_thumb", "t_screenshot_big"),
        })) || [],
    });
    if (error) {
      console.error(error);
    }

    const { data, error2 } = await supabase
      .from("users_games")
      .insert({
        user_id: user.id,
        game_id: game.id,
        platform: platform,
        status: status,
      })
      .select(`*, games(*)`)
      .single();
    if (error2) {
      console.error(error2);
      setToastType("error");
      setToast("Error Adding Game");
      setTimeout(() => {
        setToast("");
      }, 3000);
      return;
    }

    setToastType("success");
    setToast(`Game Added To ${status}`);
    setGameExists(true);
    console.log("gameeeeeeeeeeeeeeeeeeee", game);

    setGames((prev) => [data, ...prev]);
    setTimeout(() => {
      setToast("");
    }, 3000);
  };

  async function handleEdit(e) {
    e.preventDefault();

    const { error } = await supabase
      .from("users_games")
      .update({
        status: status,
        platform: platform,
      })
      .eq("game_id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error(error);
      setToastType("error");
      setToast("Error Editing Game Info");
      setTimeout(() => {
        setToast("");
      }, 3000);
      return;
    }

    setToastType("success");
    setToast("Game Info Edited ");
    setGames((prev) =>
      prev.map((game) =>
        game.game_id === Number(id) ? { ...game, status: status } : game,
      ),
    );
    setTimeout(() => {
      setToast("");
    }, 3000);
  }

  useEffect(() => {
    const loadGameInfo = async () => {
      const { error, data } = await supabase
        .from("users_games")
        .select("*")
        .eq("game_id", id)
        .eq("user_id", user.id);

      if (error) {
        console.error(error);
      }

      if (data.length !== 0) {
        const res = await supabase.from("games").select("*").eq("id", id);
        setGame(res.data[0]);

        setLoading(false);
        setGameExists(true);
        setStatus(data[0].status);
        setPlatform(data[0].platform);
        console.log("from db");
        console.log(res.data[0]);
      } else {
        const res = await supabase.functions.invoke("game-info", {
          body: {
            id: id,
          },
        });

        setGame(res.data[0]);
        console.log(res.data[0]);
        setLoading(false);
        console.log("from api");
      }
    };

    loadGameInfo();
  }, [id]);

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

  return loading ? (
    <>
      <div className="flex flex-col min-h-screen w-full bg-main">
        <NavBar></NavBar>

        <div className="px-4 flex flex-col gap-5 ">
          <h2
            className="text-text-secondary m-0 ps-4 cursor-pointer text-[2rem] hover:text-text-primary"
            onClick={handleback}
          >
            ←
          </h2>
          <div
            className="sm:grid
            sm:grid-cols-[clamp(140px,17vw,240px)_1fr]
            sm:gap-6
            sm:items-start
            flex gap-5
            "
          >
            <div>
              <div
                className="relative overflow-hidden bg-neutral-700/20 border-1 border-gray-600 w-full
                        h-70 max-sm:w-35 max-sm:h-50
                        rounded-3xl"
              >
                <div className="absolute -inset-10 w-full animate-shimmer rotate-12 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </div>
            </div>

            <div className="flex flex-col gap-4 min-w-0 w-full overflow-hidden">
              <div className="p-4 flex flex-col gap-5">
                <h1 className="text-[clamp(1.5rem,3vw,2rem)] fint-bold text-text-primary">
                  <div className=" relative overflow-hidden bg-gray-700/20 w-40 max-sm:w-20 h-5 rounded-xl border-1 border-gray-600 ">
                    <div className="absolute -inset-10 w-full animate-shimmer rotate-12 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  </div>
                </h1>
                <h4 className="text-[clamp(0.5rem,0.9rem,1.5rem)] text-text-secondary leading-relaxed min-w-0 break-words max-sm:text-[0.65rem]">
                  <div className=" relative overflow-hidden bg-gray-700/20 w-[80%] max-sm:w-30 h-5 rounded-xl border-1 border-gray-600 ">
                    <div className="absolute -inset-10 w-full animate-shimmer rotate-12 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  </div>
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  ) : (
    <div className="flex flex-col min-h-screen w-full bg-main">
      <NavBar></NavBar>

      <div className="px-4 flex flex-col gap-5 ">
        <h2
          className="text-text-secondary m-0 ps-4 cursor-pointer text-[2rem] hover:text-text-primary"
          onClick={handleback}
        >
          ←
        </h2>
        <div
          className="sm:grid
            sm:grid-cols-[clamp(140px,17vw,240px)_1fr]
            sm:gap-6
            sm:items-start
            flex gap-5
            "
        >
          <div>
            <img
              src={
                game.cover?.url
                  ? game.cover.url.replace("t_thumb", "t_cover_big")
                  : game.cover
                    ? game.cover
                    : "//images.igdb.com/igdb/image/upload/t_cover_big/cobz58.jpg"
              }
              alt=""
              className="w-full
                        h-auto
                        rounded-3xl
                        object-cover
                        border-1
                        border-white/5
                        "
            />
          </div>

          <div className="flex flex-col gap-4 min-w-0 w-full overflow-hidden">
            <div>
              <h1 className="text-[clamp(1.5rem,3vw,2rem)] fint-bold text-text-primary">
                {game.name}
              </h1>
              <h4 className="text-[clamp(0.5rem,0.9rem,1.5rem)] text-text-secondary leading-relaxed min-w-0 break-words max-sm:text-[0.65rem]">
                {game.summary}
              </h4>
            </div>
            <div
              className="flex
                gap-4
                overflow-x-auto
                hover-scroll
                pb-2 min-w-0 max-sm:hidden
              "
              ref={ref}
            >
              {game?.screenshots?.map((screen) => {
                return (
                  <img
                    key={screen.id}
                    src={
                      screen?.url
                        ? screen.url.replace("t_thumb", "t_screenshot_big")
                        : ""
                    }
                    className="w-[clamp(140px,17vw,240px)]
                            h-auto
                            rounded-xl
                            shrink-0
                            object-cover
                            border-1
                        border-white/5"
                  ></img>
                );
              })}
            </div>
          </div>
        </div>
        <div className="flex  overflow-x-scroll p-2 pbs-6 gap-5 sm:hidden">
          {game?.screenshots?.map((screen) => {
            return (
              <img
                key={screen.id}
                src={
                  screen?.url
                    ? screen.url.replace("t_thumb", "t_screenshot_big")
                    : ""
                }
                className="w-60 h-30 border-1
                        border-white/5"
              ></img>
            );
          })}
        </div>

        <form
          action=""
          className="flex
          flex-col
                  gap-5
                  w-full
                  max-w-full
                  min-w-0"
        >
          <div className="w-full sm:flex items-center gap-10 ">
            <fieldset className="flex gap-2 sm:gap-3 flex-wrap items-center ">
              <h2 className="ps-1 py-1 text-text-primary">Status: </h2>
              <label className="cursor-pointer inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="status"
                  value="library"
                  className="peer sr-only"
                  checked={status === "library"}
                  onChange={(e) => setStatus(e.target.value)}
                />

                <span
                  className="
    px-4
    rounded-full
    border
    border-gray-500
    text-gray-300
    select-none
    transition

peer-checked:border-accent-primary
    peer-checked:text-accent-text
    peer-checked:bg-accent-primary
  "
                >
                  Library
                </span>
              </label>
              <label className="cursor-pointer inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="status"
                  value="wishlist"
                  className="peer sr-only"
                  checked={status === "wishlist"}
                  onChange={(e) => setStatus(e.target.value)}
                />

                <span
                  className="
    px-4
    rounded-full
    border
    border-gray-500
    text-gray-300
    select-none
    transition

peer-checked:border-accent-primary
    peer-checked:text-accent-text
    peer-checked:bg-accent-primary
  "
                >
                  Wishlist
                </span>
              </label>
              <label className="cursor-pointer inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="status"
                  value="completed"
                  className="peer sr-only"
                  checked={status === "completed"}
                  onChange={(e) => setStatus(e.target.value)}
                />

                <span
                  className=" px-4 rounded-full border border-gray-500 text-gray-300 select-none transition       peer-checked:border-accent-primary
    peer-checked:text-accent-text peer-checked:bg-accent-primary"
                >
                  Completed
                </span>
              </label>
            </fieldset>

            <fieldset className="flex gap-3 flex-wrap max-sm:pbs-4">
              <h2 className="text-text-primary">Platform: </h2>
              <label className="cursor-pointer inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="platform"
                  value="fitgirl"
                  className="peer sr-only"
                  checked={platform === "fitgirl"}
                  onChange={(e) => setPlatform(e.target.value)}
                />

                <span
                  className="
    px-4
    rounded-full
    border
    border-gray-500
    text-gray-300
    select-none
    transition

    peer-checked:border-accent-primary
    peer-checked:text-accent-text
    peer-checked:bg-accent-primary
  "
                >
                  Fitgirl
                </span>
              </label>
              <label className="cursor-pointer inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="platform"
                  value="dodi"
                  className="peer sr-only"
                  checked={platform === "dodi"}
                  onChange={(e) => setPlatform(e.target.value)}
                />

                <span
                  className="
    px-4
    rounded-full
    border
    border-gray-500
    text-gray-300
    select-none
    transition

peer-checked:border-accent-primary
    peer-checked:text-accent-text
    peer-checked:bg-accent-primary
  "
                >
                  dodi
                </span>
              </label>
              <label className="cursor-pointer inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="platform"
                  value="steamrip"
                  className="peer sr-only"
                  checked={platform === "steamrip"}
                  onChange={(e) => setPlatform(e.target.value)}
                />

                <span
                  className="
    px-4
    rounded-full
    border
    border-gray-500
    text-gray-300
    select-none
    transition

peer-checked:border-accent-primary
    peer-checked:text-accent-text
    peer-checked:bg-accent-primary
  "
                >
                  steamrip
                </span>
              </label>
            </fieldset>
            <div className="flex pe-6 pbs-8 md:hidden w-full">
              {gameExists ? (
                <div className="flex gap-5 w-full">
                  <button
                    onClick={handleDelete}
                    className="justify-self-end self-end bg-accent-primary border-border-main transition border-1 px-8 max-sm:w-[30%]  rounded-xl text-lg text-gray-300 hover:bg-accent-hover"
                  >
                    Delete
                  </button>
                  <button
                    type="submit"
                    onClick={handleEdit}
                    className="justify-self-end self-end bg-accent-primary border-border-main transition border-1 px-24 max-sm:w-[70%] rounded-xl text-lg text-gray-300 hover:bg-accent-hover"
                  >
                    Edit
                  </button>
                </div>
              ) : (
                <div className="flex gap-5">
                  <button
                    type="submit"
                    onClick={handleInsertion}
                    className="justify-self-end self-end bg-accent-primary border-border-main transition border-1 px-24 max-sm:w-full rounded-xl text-lg text-gray-300 hover:bg-accent-hover"
                  >
                    Add
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="flex max-md:hidden">
            {gameExists ? (
              <div className="flex gap-5">
                <button
                  onClick={handleDelete}
                  className="justify-self-end self-end bg-accent-primary border-border-main transition border-1 px-8 rounded-xl text-lg text-accent-text hover:bg-accent-hover"
                >
                  Delete
                </button>
                <button
                  type="submit"
                  onClick={handleEdit}
                  className="justify-self-end self-end bg-accent-primary border-border-main transition border-1 px-24  rounded-xl text-lg text-accent-text hover:bg-accent-hover"
                >
                  Edit
                </button>
              </div>
            ) : (
              <div className="flex gap-5">
                <button
                  type="submit"
                  onClick={handleInsertion}
                  className="justify-self-end self-end bg-accent-primary border-border-main transition border-1 px-24 rounded-xl text-lg text-accebt-text hover:bg-accent-hover"
                >
                  Add
                </button>
              </div>
            )}
          </div>
        </form>
        <div className="relative w-full h-full ">
          {toast.length === 0 ? (
            <></>
          ) : (
            <>
              <div className="absolute flex flex-col items-center justify-end w-full h-full">
                <h1
                  className={` max-w-50 text-center  border-1 px-4 rounded-xl text-text-primary ${toastType === "error" ? "bg-red-500/20 border-red-500" : "bg-green-500/20 border-green-500"}`}
                >
                  {toast}
                </h1>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default GameInfoPage;
