import { useEffect, useState } from "react";
import CardContainer from "./CardContainer";
import NavBar from "./NavBar";
import { supabase } from "../supabase-client";
import { useLocation, useNavigate, useParams } from "react-router";
import FullCardContainer from "./FullCardContainer";
import RequestModal from "./RequestMoal";
import AsideWrapper from "./AsideWrapper";

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
        <div className="h-full w-full sm:grid sm:grid-cols-[150px_minmax(200px,_1fr)]">
          <AsideWrapper></AsideWrapper>
          <div>
            <div className="w-full flex gap-50  justify-center content-center tab ">
              <button
                onClick={() => {
                  navigate(location.pathname.replace("/movies", "/games"));
                  setLoading(true);
                }}
                className={`${media_type === "games" && "active"}`}
              >
                Games
              </button>
              <button
                onClick={() => {
                  navigate(location.pathname.replace("/games", "/movies"));
                  setLoading(true);
                }}
                className={`${media_type === "movies" && "active"}`}
              >
                Movies
              </button>
            </div>
            <div className="flex items-center p-4 gap-5">
              <img
                src={img}
                alt=""
                className="w-25 h-25 object-cover rounded-[50%]"
              />
              <h1 className="text-xl text-text-primary">{name}</h1>
            </div>
            <FullCardContainer
              key={`${category}-${id}-${media_type}`}
              header={category === "full" ? null : category}
              userId={userId}
              media_type={media_type}
            ></FullCardContainer>
          </div>
        </div>
      </div>
    );
  } else {
    return loading ? (
      <>
        <h1>loading</h1>
      </>
    ) : (
      <>
        <div className="text-text-primary">
          <NavBar></NavBar>
          <div className="h-full w-full sm:grid sm:grid-cols-[150px_minmax(200px,_1fr)]">
            <AsideWrapper></AsideWrapper>
            <div>
              <div className="w-full flex gap-50  justify-center content-center tab">
                <button
                  onClick={() => {
                    navigate(`/profile/${id}/games`);
                    setLoading(true);
                  }}
                  className={`${media_type === "games" && "active"}`}
                >
                  Games
                </button>
                <button
                  onClick={() => {
                    navigate(`/profile/${id}/movies`);
                    setLoading(true);
                  }}
                  className={`${media_type === "movies" && "active"}`}
                >
                  Movies
                </button>
              </div>
              <div>
                {isModalOpen ? (
                  <RequestModal setModalOpen={setIsModalOpen}></RequestModal>
                ) : (
                  <></>
                )}
              </div>
              <div className="flex items-center p-4">
                <img
                  src={img}
                  alt=""
                  className="w-25 h-25 object-cover rounded-[50%]"
                />

                {isEditingName ? (
                  <div
                    className="fixed w-screen h-screen z-20 flex items-center justify-center  top-0 left-0  bg-black/80 text-white p-4"
                    onClick={() => setIsEditingName(false)}
                  >
                    <div
                      className="bg-main border-1 border-white/5 flex flex-col  items-center justify-center gap-10 p-4 rounded-2xl"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <label className="border-1 border-white rounded-[50%] w-30 h-30 cursor-pointer hover:bg-white/90 transition-all duration-200 flex items-center justify-center hover:text-black">
                        Upload Img
                        <input
                          type="file"
                          accept="image/*"
                          className="sr-only "
                          placeholder="EDIT IMAGEEEEEE"
                          onChange={handleUpload}
                        />
                      </label>
                      <input
                        placeholder={name}
                        value={name}
                        autoFocus
                        className="border-1 border-white/20 rounded-lg px-2"
                        onChange={(e) => {
                          setName(e.target.value);
                        }}
                      ></input>

                      <button
                        onClick={() => {
                          setIsEditingName(false);
                          handleNameEdit();
                          window.location.reload();
                        }}
                        className="bg-accent-primary w-full rounded-lg hover:bg-accent-hover transition-all duration-200"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between w-full px-4">
                    <h1 className="text-xl">{name}</h1>

                    <div className="flex items-center gap-10">
                      {userId === authinticatedUserId ? (
                        <>
                          <button
                            onClick={() => setIsEditingName(true)}
                            className="px-4 bg-accent-primary rounded-2xl hover:bg-accent-hover transition-all duration-200"
                          >
                            Edit Profile
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setIsModalOpen(true);
                            }}
                            className="px-4 bg-accent-primary rounded-2xl hover:bg-accent-hover transition-all duration-200"
                          >
                            Request Games
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
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
          </div>
        </div>
      </>
    );
  }
}

export default Profile;
