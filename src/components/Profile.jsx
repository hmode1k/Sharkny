import { useEffect, useState } from "react";
import CardContainer from "./CardContainer";
import NavBar from "./NavBar";
import { supabase } from "../supabase-client";
import { useLocation, useNavigate, useParams } from "react-router";
import FullCardContainer from "./FullCardContainer";
import RequestModal from "./RequestMoal";
import AsideWrapper from "./AsideWrapper";
import { useAuth } from "../AuthContext";

function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const { id, category, media_type } = useParams();
  const [isEditingName, setIsEditingName] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [toastType, setToastType] = useState("");

  const handleUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setToast("Uploading Img Please Wait");
    setToastType("uploading");

    const filePath = `${user.id}/${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("avatars")
      .upload(filePath, file);

    if (error) {
      console.error(error);
      setToast("Error Uploading Img Please Try Again later");
      setToastType("error");
      setTimeout(() => {
        setToast("");
      }, 4000);
      return;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

    const imageUrl = data.publicUrl;

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        avatar_url: imageUrl,
      })
      .eq("user_id", user.id);

    if (updateError) {
      console.error(updateError);
      return;
    }

    console.log("profile image updated");
    setToast("Uploaded Successfully");
    setToastType("success");

    setTimeout(() => {
      setToast("");
    }, 4000);
  };

  const handleNameEdit = async () => {
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: profile.full_name,
      })
      .eq("user_id", user.id);

    if (error) {
      console.error(error);
      return;
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (id === undefined || id === null) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id);

        console.log(data[0]);
        navigate(`/profile/${data[0].id}/games`);
      }

      const { error, data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id);

      if (error) {
        console.error(error);
        return;
      }
      setProfile(data[0]);
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
    return loading ? (
      <>
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
                <div className="relative overflow-hidden rounded-full bg-neutral-700/20 border-1 border-gray-600 w-25 h-25">
                  <div className="absolute -inset-10 w-full animate-shimmer rotate-12 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </div>
                <div className=" relative overflow-hidden bg-gray-700/20 w-40 h-5 rounded-xl border-1 border-gray-600 ">
                  <div className="absolute -inset-10 w-full animate-shimmer rotate-12 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </div>
              </div>
              <FullCardContainer
                key={`${category}-${id}-${media_type}`}
                header={category === "full" ? null : category}
                media_type={media_type}
              ></FullCardContainer>
            </div>
          </div>
        </div>
      </>
    ) : (
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
                src={profile.avatar_url}
                alt=""
                className="w-25 h-25 object-cover rounded-[50%]"
              />
              <h1 className="text-xl text-text-primary">{profile.full_name}</h1>
            </div>
            <FullCardContainer
              key={`${category}-${id}-${media_type}`}
              header={category === "full" ? null : category}
              media_type={media_type}
            ></FullCardContainer>
          </div>
        </div>
      </div>
    );
  } else {
    return loading ? (
      <>
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
                <div className="relative overflow-hidden rounded-full bg-neutral-700/20 border-1 border-gray-600 w-25 h-25">
                  <div className="absolute -inset-10 w-full animate-shimmer rotate-12 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </div>
                <div className=" relative overflow-hidden bg-gray-700/20 w-40 h-5 rounded-xl border-1 border-gray-600 ">
                  <div className="absolute -inset-10 w-full animate-shimmer rotate-12 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </div>
              </div>
              <div className="text-text-primary">
                <CardContainer
                  header="library"
                  media_type={media_type}
                ></CardContainer>
                <CardContainer
                  header="wishlist"
                  media_type={media_type}
                ></CardContainer>
                <CardContainer
                  header="completed"
                  media_type={media_type}
                ></CardContainer>
              </div>
            </div>
          </div>
        </div>
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
                  <RequestModal
                    setModalOpen={setIsModalOpen}
                    requested_name={profile.full_name}
                  ></RequestModal>
                ) : (
                  <></>
                )}
              </div>
              <div className="flex items-center p-4">
                <img
                  src={profile.avatar_url}
                  alt=""
                  className="w-25 h-25 object-cover rounded-[50%] max-sm:w-15 max-sm:h-15"
                />

                {isEditingName ? (
                  <div
                    className="fixed w-screen h-screen z-20 flex items-center justify-center  top-0 left-0  bg-black/80 text-white p-4 flex flex-col gap-5"
                    onClick={() => setIsEditingName(false)}
                  >
                    <div
                      className="bg-main border-1 border-white/5 flex flex-col  items-center justify-center gap-10 p-4 rounded-2xl "
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
                        placeholder={profile.full_name}
                        value={profile.full_name}
                        autoFocus
                        className="border-1 border-white/20 rounded-lg px-2"
                        onChange={(e) => {
                          setProfile({ ...profile, full_name: e.target.value });
                        }}
                      ></input>

                      <button
                        onClick={() => {
                          setIsEditingName(false);
                          handleNameEdit();
                        }}
                        className="bg-accent-primary text-accent-text w-full rounded-lg hover:bg-accent-hover transition-all duration-200"
                      >
                        Done
                      </button>
                    </div>
                    <div>
                      {toast.length > 0 ? (
                        <>
                          <h1
                            className={`${toastType === "success" ? "bg-green-500/50 border-green-600" : toastType === "error" ? "  bg-red-500/50 border-red-600" : " bg-yellow-500/50 border-yellow-600"} text-white w-full p-2 rounded-xl border-2`}
                          >
                            {toast}
                          </h1>
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between w-full px-4">
                    <h1 className="text-xl max-sm:text-sm">
                      {profile.full_name}
                    </h1>

                    <div className="flex items-center gap-10">
                      {user.id === profile.user_id ? (
                        <>
                          <button
                            onClick={() => setIsEditingName(true)}
                            className="px-4 bg-accent-primary rounded-2xl hover:bg-accent-hover transition-all duration-200 text-accent-text max-sm:text-xs max-sm:py-2"
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
                            className="px-4 bg-accent-primary rounded-2xl hover:bg-accent-hover transition-all duration-200 text-accent-text max-sm:text-xs max-sm:py-2"
                          >
                            Make A Request
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
                  media_type={media_type}
                  id={profile.user_id}
                  URLId={id}
                ></CardContainer>
                <CardContainer
                  header="wishlist"
                  media_type={media_type}
                  id={profile.user_id}
                  URLId={id}
                ></CardContainer>
                <CardContainer
                  header="completed"
                  id={profile.user_id}
                  media_type={media_type}
                  URLId={id}
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
