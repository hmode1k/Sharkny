import { useEffect, useState } from "react";
import NavBar from "./NavBar";
import { useNavigate, useParams } from "react-router";
import { supabase } from "../supabase-client";

function GameInfoPage() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gameExists, setGameExists] = useState(false);
  const [status, setStatus] = useState("library");
  const [platform, setPlatform] = useState("fitgirl");
  const navigate = useNavigate();

  const handleInsertion = async (e) => {
    e.preventDefault();
    const {
      data: { user },
    } = await supabase.auth.getUser();

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

    const { error2 } = await supabase.from("users_games").insert({
      user_id: user.id,
      game_id: game.id,
      platform: platform,
      status: status,
    });
    if (error2) {
      console.error(error2);
      return;
    }

    navigate("/");
  };

  async function handleEdit(e) {
    e.preventDefault();
    const {
      data: { user },
    } = await supabase.auth.getUser();
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
      return;
    }
    navigate("/");
  }

  useEffect(() => {
    const loadGameInfo = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

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
        setLoading(false);
        console.log("from api");
      }
    };

    loadGameInfo();
  }, [id]);

  return loading ? (
    <>
      <h1>loading</h1>
    </>
  ) : (
    <div>
      <NavBar></NavBar>
      <div>
        <h1>{game.name}</h1>
        <h4>{game.summary}</h4>
        <h1>{game.name}</h1>
        <img
          src={
            game.cover?.url
              ? game.cover.url
              : game.cover
                ? game.cover
                : "//images.igdb.com/igdb/image/upload/t_cover_big/cobz58.jpg"
          }
          alt=""
        />
        <div>
          {game.screenshots.map((screen) => {
            return (
              <img key={screen.id} src={screen.url} className="w-60 h-30"></img>
            );
          })}
        </div>
        <form action="">
          <fieldset>
            <label htmlFor="">
              <input
                type="radio"
                name="status"
                value="library"
                checked={status === "library"}
                onChange={(e) => {
                  setStatus(e.target.value);
                }}
              />
              library
            </label>
            <label htmlFor="">
              <input
                type="radio"
                name="status"
                value="wishlist"
                checked={status === "wishlist"}
                onChange={(e) => {
                  setStatus(e.target.value);
                }}
              />
              wishlist
            </label>
            <label htmlFor="">
              <input
                type="radio"
                name="status"
                value="played"
                checked={status === "played"}
                onChange={(e) => {
                  setStatus(e.target.value);
                }}
              />
              played
            </label>
          </fieldset>

          <fieldset>
            <label htmlFor="">
              <input
                type="radio"
                name="platform"
                value="fitgirl"
                checked={platform === "fitgirl"}
                onChange={(e) => {
                  setPlatform(e.target.value);
                }}
              />
              fitgirl
            </label>
            <label htmlFor="">
              <input
                type="radio"
                name="platform"
                value="dodi"
                checked={platform === "dodi"}
                onChange={(e) => {
                  setPlatform(e.target.value);
                }}
              />
              dodi
            </label>
            <label htmlFor="">
              <input
                type="radio"
                name="platform"
                value="steamrip"
                checked={platform === "steamrip"}
                onChange={(e) => {
                  setPlatform(e.target.value);
                }}
              />
              steamrip
            </label>
          </fieldset>
          {gameExists ? (
            <>
              <button type="submit" onClick={handleEdit}>
                Edit
              </button>
            </>
          ) : (
            <>
              <button type="submit" onClick={handleInsertion}>
                Add
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

export default GameInfoPage;
