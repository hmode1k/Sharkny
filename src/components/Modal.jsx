import { useState } from "react";
import { supabase } from "../supabase-client";

function Modal({ dbstatus, dbplatform, setEditing, type, id }) {
  const [status, setStatus] = useState(dbstatus);
  const [platform, setPlatform] = useState(dbplatform);

  const handleEdit = async (e) => {
    e.preventDefault();
    console.log("editing");
    console.log(status, platform);
    const {
      data: { user },
    } = await supabase.auth.getUser();
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
      return;
    }
    window.location.reload();
  };

  const handleDelete = async () => {
    console.log("deleting");
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { error } = await supabase
      .from("users_games")
      .delete("")
      .eq("game_id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error(error);
      return;
    }

    window.location.reload();
  };

  return (
    <>
      {type === "edit" ? (
        <>
          <div className="fixed w-screen h-screen z-20 flex items-center justify-center  top-0 left-0  bg-black/80 text-white">
            <div className="">
              <div className="">
                <form action="">
                  <input
                    type="radio"
                    name={status}
                    value="library"
                    checked={status === "library"}
                    onChange={(e) => {
                      setStatus(e.target.value);
                    }}
                  />
                  <label htmlFor="">library</label>
                  <input
                    type="radio"
                    name={status}
                    value="wishlist"
                    checked={status === "wishlist"}
                    onChange={(e) => {
                      setStatus(e.target.value);
                    }}
                  />
                  <label htmlFor="">wishlist</label>

                  <input
                    type="radio"
                    name={status}
                    value="played"
                    checked={status === "played"}
                    onChange={(e) => {
                      setStatus(e.target.value);
                    }}
                  />
                  <label htmlFor="">played</label>

                  <input
                    type="radio"
                    name={platform}
                    value="fitgirl"
                    checked={platform === "fitgirl"}
                    onChange={(e) => {
                      setPlatform(e.target.value);
                    }}
                  />
                  <label htmlFor="">fitgirl</label>

                  <input
                    type="radio"
                    name={platform}
                    value="dodi"
                    checked={platform === "dodi"}
                    onChange={(e) => {
                      setPlatform(e.target.value);
                    }}
                  />
                  <label htmlFor="">dodi</label>

                  <input
                    type="radio"
                    name={platform}
                    value="steamrip"
                    checked={platform === "steamrip"}
                    onChange={(e) => {
                      setPlatform(e.target.value);
                    }}
                  />
                  <label htmlFor="">steamrip</label>
                  <button type="submit" onClick={handleEdit}>
                    Edit
                  </button>
                </form>
                <button
                  onClick={() => {
                    setEditing(false);
                  }}
                >
                  exit
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="fixed w-screen h-screen z-20 flex items-center justify-center  top-0 left-0  bg-black/30 text-white">
            <h1>are you sure you want to delete this?</h1>
            <button onClick={handleDelete}>DELETE</button>
            <button
              onClick={() => {
                setEditing(false);
              }}
            >
              EXIT
            </button>
          </div>
        </>
      )}
    </>
  );
}

export default Modal;
