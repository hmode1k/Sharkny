import { useEffect, useState } from "react";
import NavBar from "./NavBar";
import { useParams } from "react-router";
import { supabase } from "../supabase-client";

function GameInfoPage() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("library");
  const [platform, setPlatform] = useState("fitgirl");

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
  };

  useEffect(() => {
    const fetchGameDetails = async () => {
      const res = await fetch(searchURL);
      const data = await res.json();
      console.log(data);
      setGame(data);
      setLoading(false);
    };

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

          <button type="submit" onClick={handleInsertion}>
            Add
          </button>
        </form>
      </div>
    </div>
  );
}

export default GameInfoPage;
