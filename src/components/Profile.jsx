import { useEffect, useState } from "react";
import CardContainer from "./CardContainer";
import NavBar from "./NavBar";
import { supabase } from "../supabase-client";
import { useLocation, useNavigate, useParams } from "react-router";
import FullCardContainer from "./FullCardContainer";
import RequestModal from "./RequestMoal";

function Profile() {
  const [name, setName] = useState("UserName");
  const [img, setImg] = useState(null);
  const [userId, setUserId] = useState(null);
  const [URLId, setURLId] = useState(null);
  const [authinticatedUserId, setAuthinticatedUserId] = useState(null);
  const { id, category, media_type } = useParams();
  console.log("id", id);
  const [isEditingName, setIsEditingName] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      if (id === undefined || id === null) {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id);

        console.log(data[0]);
        navigate(`/profile/${data[0].id}/games`);
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      setAuthinticatedUserId(user.id);

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
    };

    fetchUser();
  }, [id, location.pathname, navigate]);

  if (
    category === "library" ||
    category === "wishlist" ||
    category === "completed" ||
    category === "full"
  ) {
    return (
      <div>
        <NavBar></NavBar>
        <div className="w-full flex gap-50  justify-center content-center">
          <button
            onClick={() => {
              navigate(`/${location.pathname.replace("/movies", "/games")}`);
              setLoading(true);
            }}
          >
            game
          </button>
          <button
            onClick={() => {
              navigate(`/${location.pathname.replace("/games", "/movies")}`);
              setLoading(true);
            }}
          >
            movies
          </button>
        </div>
        <img src={img} alt="" className="w-50 h-50" />
        <h1>{name}</h1>
        <FullCardContainer
          header={category === "full" ? null : category}
          userId={userId}
          media_type={media_type}
        ></FullCardContainer>
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
          <div className="w-full flex gap-50  justify-center content-center">
            <button
              onClick={() => {
                navigate(`/profile/${id}/games`);
                setLoading(true);
              }}
            >
              game
            </button>
            <button
              onClick={() => {
                navigate(`/profile/${id}/movies`);
                setLoading(true);
              }}
            >
              movies
            </button>
            <button
              onClick={() => {
                navigate(`${location.pathname}/full`);
                setLoading(true);
              }}
            >
              FULL
            </button>
            {userId === authinticatedUserId ? (
              <></>
            ) : (
              <>
                <button
                  onClick={() => {
                    setIsModalOpen(true);
                  }}
                >
                  REQUEST
                </button>
              </>
            )}
          </div>
          <div>
            {isModalOpen ? (
              <RequestModal></RequestModal>
            ) : (
              <>
                <h1>ff</h1>
              </>
            )}
          </div>
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
          <div>
            <CardContainer
              header="library"
              userId={userId}
              media_type={media_type}
              id={URLId}
            ></CardContainer>
            <CardContainer
              header="wishlist"
              userId={userId}
              media_type={media_type}
              id={URLId}
            ></CardContainer>
            <CardContainer
              header="completed"
              userId={userId}
              id={URLId}
              media_type={media_type}
            ></CardContainer>
          </div>
        </div>
      </>
    );
  }
}

export default Profile;
