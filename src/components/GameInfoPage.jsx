import { useEffect, useState } from "react";
import NavBar from "./NavBar";
import { useNavigate, useParams } from "react-router";
import { supabase } from "../supabase-client";

function GameInfoPage() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("library");
  const [platform, setPlatform] = useState("fitgirl");
  const [gameExists, setGameExists] = useState(false);
  const navigate = useNavigate();

  const searchURL = `https://api.rawg.io/api/games/${id}?key=1806ecb756ee40288b7dbed9e611ab2d`;

  const handleInsertion = async (e) => {
    e.preventDefault();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.from("games").insert({
      id: game.id,
      name: game.name,
      background_img: game.background_image,
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
    const checkDB = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { error, data } = await supabase
        .from("users_games")
        .select("*")
        .eq("game_id", id)
        .eq("user_id", user.id);

      console.log(data);

      if (error) {
        console.error(error);
      }

      if (data.length !== 0) {
        setGameExists(true);
        setStatus(data[0].status);
        setPlatform(data[0].platform);
      }
    };

    const fetchGameDetails = async () => {
      const res = await fetch(searchURL);
      const data = await res.json();
      setGame(data);
      setLoading(false);
    };

    checkDB();
    fetchGameDetails();
  }, [id, searchURL]);

  return loading ? (
    <>
      <h1>loading</h1>
    </>
  ) : (
    <div>
      <NavBar></NavBar>
      <div>
        <h1>{game.name}</h1>
        <h1>{game.name}</h1>
        <h1>{game.name}</h1>
        <img src={game.background_image_additional} alt="" />
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
