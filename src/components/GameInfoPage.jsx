import { useEffect, useRef, useState } from "react";
import NavBar from "./NavBar";
import { useNavigate, useParams } from "react-router";
import { supabase } from "../supabase-client";
import { useData } from "../DataContext";
import { useAuth } from "../AuthContext";
import GameCard from "./GameCard";

function GameInfoPage() {
  const { user } = useAuth();
  const { setGames } = useData();
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [rawgData, setRawgData] = useState(null);
  const [rawgLoading, setRawgLoading] = useState(true);
  const [collection, setCollection] = useState(null);
  const [collectuinLoading, setCollectionLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [gameExists, setGameExists] = useState(false);
  const [toast, setToast] = useState("");
  const [toastType, setToastType] = useState("");
  const [status, setStatus] = useState("library");
  const [platform, setPlatform] = useState("fitgirl");
  const scrollRefs = useRef([]);

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
      .eq("user_id", user?.id);

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
        user_id: user?.id,
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
      .eq("user_id", user?.id);

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
        .eq("user_id", user?.id);

      if (error) {
        console.error(error);
      }

      if (data.length !== 0) {
        const res = await supabase.from("games").select("*").eq("id", id);
        setGame(res.data[0]);

        setGameExists(true);
        setStatus(data[0].status);
        setPlatform(data[0].platform);
      }

      const res = await supabase.functions.invoke("game-info", {
        body: {
          id: id,
        },
      });

      setGame({
        ...res.data[0],
        first_release_date: res.data[0].first_release_date
          ? new Date(res.data[0].first_release_date * 1000)
              .toISOString()
              .split("T")[0]
          : null,
      });

      console.log(res.data[0]);
      setLoading(false);
    };

    loadGameInfo();
  }, [id, user?.id]);

  useEffect(() => {
    const loadRawg = async () => {
      const res = await supabase.functions.invoke("rapid-api", {
        body: {
          id: id,
          first_release_date: game?.first_release_date,
          name: game?.name,
        },
      });

      if (!res.data) {
        return;
      }
      setRawgData(res.data);
      setRawgLoading(false);
    };

    loadRawg();
  }, [game?.first_release_date, game?.name, id]);

  useEffect(() => {
    const loadCollection = async () => {
      const res = await supabase.functions.invoke("fetch-collection", {
        body: {
          collectionId: game?.collections[0].id,
          collectionGameId: id,
        },
      });

      if (!res.data) {
        return;
      }
      console.log("ressssssssss");
      console.log(res.data);
      setCollection(res.data);
      setCollectionLoading(false);
    };

    loadCollection();
  }, [game?.collections, id]);

  const handleWheel = (e) => {
    if (e.deltaY === 0) return;

    e.preventDefault();
    e.currentTarget.scrollLeft += e.deltaY;
  };

  const attachWheel = (el) => {
    if (!el) return;

    const handler = (e) => {
      if (e.deltaY === 0) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };

    el.addEventListener("wheel", handler, { passive: false });

    // store cleanup on element itself
    el._wheelHandler = handler;
  };

  useEffect(() => {
    return () => {
      document.querySelectorAll("[data-wheel]").forEach((el) => {
        if (el._wheelHandler) {
          el.removeEventListener("wheel", el._wheelHandler);
        }
      });
    };
  }, []);

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
      <div className="z-10">
        <NavBar></NavBar>
      </div>
      <div className={`relative ${rawgData?.background ? "" : "bg-main"}`}>
        {rawgData?.background && (
          <img
            src={rawgData?.background}
            className="fixed inset-0 w-full h-screen object-cover "
          />
        )}

        <div
          className={`absolute inset-0 ${rawgData?.background && "bg-gradient-to-t from-black via-black/70 to-black/30"}`}
        />

        <div className="relative z-10 ">
          <div className="px-4 flex flex-col gap-5 ">
            <h2
              className="text-text-secondary m-0 ps-4 cursor-pointer text-[2rem] hover:text-text-primary [text-shadow:0_2px_10px_rgba(0,0,0,0.9)]"
              onClick={handleback}
            >
              ←
            </h2>
          </div>
          <div className="flex flex-col gap-5">
            {/* image and stuff next to it(name rating etc...) div */}
            <div className="text-white flex px-2 max-sm:flex-col max-sm:gap-5 [text-shadow:0_2px_10px_rgba(0,0,0,0.9)]">
              <div>
                <img
                  src={game?.cover?.url?.replace("t_thumb", "t_cover_big")}
                  alt=""
                  className="max-sm:w-full w-[90%] h-auto rounded-xl border-1 border-black [box-shadow:0_2px_10px_rgba(0,0,0,1)]"
                />
              </div>
              <div className="flex flex-col gap-3">
                <h1 className="text-4xl">{game.name}</h1>
                {/* caclulate rating from out of 100 to out of 5 and fix it to just 2 numbers after the floatng point */}
                <div className="flex gap-5">
                  <h3 className="text-md text-text-secondary ">
                    Release Date: {game?.first_release_date}
                  </h3>
                  <h2 className="">
                    ⭐: {((game?.rating * 5) / 100).toFixed(2)}
                  </h2>
                </div>
                <div className="flex gap-2 p-2">
                  {game?.game_modes?.map((mode) => {
                    return (
                      <h1 className="p-1 bg-accent-primary/50 border-1 border-accent-primary rounded-lg text-xs">
                        {mode.name}
                      </h1>
                    );
                  })}
                </div>
                <div className="flex gap-2 flex-wrap">
                  <h1 className="text-lg max-sm:text-sm">Genres: </h1>
                  {game?.genres?.map((genre) => {
                    return (
                      <h1 className="p-1 bg-accent-primary/50 border-1 border-accent-primary rounded-lg text-xs max-sm:text-[10px]">
                        {genre.name}
                      </h1>
                    );
                  })}
                </div>
                <div className="flex gap-2 flex-wrap">
                  <h1 className="text-lg max-sm:text-sm">Themes: </h1>
                  {game?.themes?.map((theme) => {
                    return (
                      <h1 className="p-1 bg-accent-primary/50 border-1 border-accent-primary rounded-lg text-xs max-sm:text-[10px]">
                        {theme.name}
                      </h1>
                    );
                  })}
                </div>
                <div className="flex gap-2 flex-wrap">
                  <h1 className="text-lg max-sm:text-sm">Platforms: </h1>
                  {game?.platforms?.map((platform) => {
                    return (
                      <h1 className="p-1 bg-accent-primary/50 border-1 border-accent-primary rounded-lg text-xs max-sm:text-[10px]">
                        {platform.abbreviation}
                      </h1>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* summary screenshots div */}
            <div className="text-white flex flex-col gap-5 [text-shadow:0_2px_10px_rgba(0,0,0,0.9)]">
              <div className="p-2">
                <h1 className="text-lg max-sm:text-md">Game Description:</h1>
                <h2 className="p-2 text-text-secondary max-sm:text-sm">
                  {game?.summary}
                </h2>
              </div>

              <div
                className="flex flex-row gap-5 w-full overflow-scroll hover-scroll pb-2 min-w-0"
                ref={attachWheel}
              >
                {game?.screenshots?.map((screen) => {
                  return (
                    <img
                      key={screen.id}
                      src={screen?.url?.replace("t_thumb", "t_screenshot_big")}
                      className="w-[clamp(250px,30vw,400px)] h-auto rounded-xl shrink-0 object-cover border-1 border-white/5 "
                    ></img>
                  );
                })}
              </div>

              <div className="p-2 rounded-xl">
                {game?.videos && (
                  <>
                    <iframe
                      width="100%"
                      src={`https://www.youtube.com/embed/${game?.videos[0]?.video_id}`}
                      title="Game Trailer"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="rounded-xl h-[400px] max-sm:h-[200px] px-4 "
                    />
                  </>
                )}
              </div>

              <div>
                {collectuinLoading ? (
                  <></>
                ) : (
                  <>
                    <h1 className="px-4  ">More Games From The Series:</h1>
                    <div
                      className="flex overflow-scroll gap-5 p-4"
                      ref={attachWheel}
                    >
                      {collection?.map((item) => {
                        return (
                          <GameCard
                            key={item.id}
                            id={item?.id}
                            name={item?.name}
                            img={item?.cover?.url}
                            media_type={"games"}
                          ></GameCard>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              <div>
                <div>
                  <h1 className="px-4  ">Similar Games:</h1>
                  <div
                    className="flex overflow-scroll gap-5 p-4"
                    ref={attachWheel}
                  >
                    {game?.similar_games?.map((item) => {
                      return (
                        <GameCard
                          key={item.id}
                          id={item?.id}
                          name={item?.name}
                          img={item?.cover?.url}
                          media_type={"games"}
                        ></GameCard>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div>
                {game?.dlcs?.cover ? (
                  <>
                    <h1 className="px-4">DLCs:</h1>
                    <div className="flex gap-5 overflow-scroll px-6 p-2">
                      {game?.dlcs?.map((dlc) => {
                        return (
                          <div className="relative w-[clamp(250px,40vw,400px)] h-auto rounded-xl overflow-hidden">
                            <img
                              src={dlc?.cover?.url?.replace(
                                "t_thumb",
                                "t_screenshot_med",
                              )}
                              className="w-full h-full object-cover"
                            />

                            {/* dark overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                            <h1 className="absolute bottom-0 p-2 z-10 text-white font-medium">
                              {dlc.name}
                            </h1>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <></>
                )}
              </div>

              <div>
                {rawgLoading ? (
                  <></>
                ) : (
                  <>
                    <div className="flex text-sm p-4 gap-2">
                      <div className="space-y-2 w-[50%] ">
                        {Object.entries(rawgData?.minimum_reqs).map(
                          ([key, value]) => (
                            <div key={key}>
                              <h3 className="font-bold text-text-primary">
                                {key}
                              </h3>

                              <p className="text-text-secondary">{value}</p>
                            </div>
                          ),
                        )}
                      </div>
                      <br />
                      <div className="space-y-3">
                        {Object.entries(rawgData?.recommended_reqs).map(
                          ([key, value]) => (
                            <div key={key}>
                              <h3 className="font-bold text-text-primary">
                                {key}
                              </h3>

                              <p className="text-text-secondary">{value}</p>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <form
            action=""
            className="flex
          flex-col
                  gap-5
                  w-full
                  max-w-full
                  min-w-0
                  p-4"
          >
            <div className="w-full gap-5 flex flex-col ">
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
                <label className="cursor-pointer inline-flex items-center gap-2">
                  <input
                    type="radio"
                    name="platform"
                    value="steamgg"
                    className="peer sr-only"
                    checked={platform === "steamgg"}
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
                    Steam GG
                  </span>
                </label>
                <label className="cursor-pointer inline-flex items-center gap-2">
                  <input
                    type="radio"
                    name="platform"
                    value="steam"
                    className="peer sr-only"
                    checked={platform === "steam"}
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
                    Steam
                  </span>
                </label>
                <label className="cursor-pointer inline-flex items-center gap-2">
                  <input
                    type="radio"
                    name="platform"
                    value="goggames"
                    className="peer sr-only"
                    checked={platform === "goggames"}
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
                    GoG Games
                  </span>
                </label>
              </fieldset>
              <div className="flex pe-6 pbs-8 md:hidden w-full">
                {gameExists ? (
                  <div className="flex gap-5 w-full">
                    <button
                      onClick={handleDelete}
                      className="justify-self-end self-end bg-accent-primary border-border-main transition border-1 px-8 max-sm:w-[40%] text-center rounded-xl text-lg text-black hover:bg-accent-hover"
                    >
                      Delete
                    </button>
                    <button
                      type="submit"
                      onClick={handleEdit}
                      className="justify-self-end self-end bg-accent-primary border-border-main transition border-1 px-24 max-sm:w-[70%] text-center rounded-xl text-lg text-black hover:bg-accent-hover"
                    >
                      Edit
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-5">
                    <button
                      type="submit"
                      onClick={handleInsertion}
                      className="justify-self-end self-end bg-accent-primary border-border-main transition border-1 px-24 max-sm:w-full text-center rounded-xl text-lg text-black hover:bg-accent-hover"
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
                    className="justify-self-end self-end bg-accent-primary border-border-main transition border-1 px-8 rounded-xl text-center text-lg text-black hover:bg-accent-hover"
                  >
                    Delete
                  </button>
                  <button
                    type="submit"
                    onClick={handleEdit}
                    className="justify-self-end self-end bg-accent-primary border-border-main transition border-1 px-24  rounded-xl text-center text-lg text-black hover:bg-accent-hover"
                  >
                    Edit
                  </button>
                </div>
              ) : (
                <div className="flex gap-5">
                  <button
                    type="submit"
                    onClick={handleInsertion}
                    className="justify-self-end self-end bg-accent-primary border-border-main transition border-1 px-24 rounded-xl text-center text-lg text-black hover:bg-accent-hover"
                  >
                    Add
                  </button>
                </div>
              )}
            </div>
          </form>
          <div className="relative w-full h-full bg-black">
            {toast.length === 0 ? (
              <></>
            ) : (
              <>
                <div className="absolute flex flex-col items-center justify-end w-full h-full z-40 bg-black ">
                  <div className="flex flex-col items-center justify-end w-full h-full bg-black">
                    <h1
                      className={`max-w-50 text-center px-4 py-2 rounded-xl text-text-primary border
  ${
    toastType === "error"
      ? "bg-red-500/10 border-red-500"
      : "bg-green-500/10 border-green-500"
  }
  shadow-2xl backdrop-blur-md mbe-8 shadow-[0_10px_30px_rgba(0,0,0,0.4)]`}
                    >
                      {toast}
                    </h1>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameInfoPage;
