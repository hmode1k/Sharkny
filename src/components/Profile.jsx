import { useEffect, useState } from "react";
import CardContainer from "./CardContainer";
import NavBar from "./NavBar";
import { supabase } from "../supabase-client";
import { useLocation, useParams } from "react-router";
import FullCardContainer from "./FullCardContainer";

function Profile() {
  const [name, setName] = useState("UserName");
  const [img, setImg] = useState(null);
  const [userId, setUserId] = useState(null);
  const [URLId, setURLId] = useState(null);
  const location = useLocation();
  const path = location.pathname.split("/");
  const { id } = useParams();
  const [isEditingName, setIsEditingName] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const filePath = `${userId}/${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("avatars")
      .upload(filePath, file);

    if (error) {
      console.error(error);
      return;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

    const imageUrl = data.publicUrl;

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        avatar_url: imageUrl,
      })
      .eq("user_id", userId);

    if (updateError) {
      console.error(updateError);
      return;
    }

    console.log("profile image updated");
  };

  const handleNameEdit = async () => {
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: name,
      })
      .eq("user_id", userId);

    if (error) {
      console.error(error);
      return;
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (id === undefined) {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        const { error, data } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id);
        console.log(data);

        if (error) {
          console.error(error);
          return;
        }

        setName(data[0].full_name);
        setImg(data[0].avatar_url);
        setUserId(data[0].user_id);
        setURLId(data[0].id);
        setLoading(false);
      } else {
        const { error, data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", id);

        if (error) {
          console.error(error);
          return;
        }

        setName(data[0].full_name);
        setImg(data[0].avatar_url);
        setUserId(data[0].user_id);
        setURLId(id);
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (
    path.includes("library") ||
    path.includes("wishlist") ||
    path.includes("played")
  ) {
    return (
      <div>
        <NavBar></NavBar>
        <img src={img} alt="" className="w-50 h-50" />
        <h1>{name}</h1>
        <FullCardContainer header={path[3]} userId={userId}></FullCardContainer>
      </div>
    );
  } else {
    return loading ? (
      <>
        <h1>loading</h1>
      </>
    ) : (
      <>
        <div>
          <NavBar></NavBar>
          <img src={img} alt="" className="w-50 h-50" />
          <input
            type="file"
            accept="image/*"
            placeholder="EDIT IMAGEEEEEE"
            onChange={handleUpload}
          />
          {isEditingName ? (
            <div>
              <input
                placeholder={name}
                value={name}
                autoFocus
                onChange={(e) => {
                  setName(e.target.value);
                }}
              ></input>
              <button
                onClick={() => {
                  setIsEditingName(false);
                  handleNameEdit();
                }}
              >
                Done
              </button>
            </div>
          ) : (
            <div>
              <h1>{name}</h1>
              <button onClick={() => setIsEditingName(true)}>EDIIIIIIT</button>
            </div>
          )}

          <CardContainer
            header="library"
            userId={userId}
            id={URLId}
          ></CardContainer>
          <CardContainer
            header="wishlist"
            userId={userId}
            id={URLId}
          ></CardContainer>
          <CardContainer
            header="played"
            userId={userId}
            id={URLId}
          ></CardContainer>
        </div>
      </>
    );
  }
}

export default Profile;
