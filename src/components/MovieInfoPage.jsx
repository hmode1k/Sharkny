import { useEffect, useState } from "react";
import NavBar from "./NavBar";
import { useLocation, useNavigate, useParams } from "react-router";
import { supabase } from "../supabase-client";
import { useData } from "../DataContext";
import { useAuth } from "../AuthContext";

function MovieInfoPage() {
  const { user } = useAuth();
  const { setMovies } = useData();
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [movieExists, setMovieExists] = useState(false);
  const [toast, setToast] = useState("");
  const [toastType, setToastType] = useState("");
  const [status, setStatus] = useState("library");
  const navigate = useNavigate();
  const location = useLocation();

  const handleDelete = async (e) => {
    e.preventDefault();

    const { error } = await supabase
      .from("users_movies")
      .delete("")
      .eq("movie_id", id)
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
    setToast("Deleted Movie");
    setMovieExists(false);
    setMovies((prev) => prev.filter((item) => item.movies.id !== Number(id)));

    setTimeout(() => {
      setToast("");
    }, 3000);
  };

  const handleback = (e) => {
    e.preventDefault();
    navigate(-1);
  };

  const handleInsertion = async (e) => {
    e.preventDefault();

    const { error } = await supabase.from("movies").insert({
      id: movie.id,
      title: movie.title,
      poster: movie.poster,
      description: movie.description,
      media_type: movie.media_type,
      backdrop: movie.backdrop,
      release_date: movie.release_date,
      rating: movie.rating,
    });
    if (error) {
      console.error(error);
    }

    const { data, error2 } = await supabase
      .from("users_movies")
      .insert({
        user_id: user?.id,
        movie_id: movie.id,
        status: status,
      })
      .select(` *, movies(*)`)
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
    setToast(`Movie Added To ${status}`);
    setMovieExists(true);
    setMovies((prev) => [data, ...prev]);
    setTimeout(() => {
      setToast("");
    }, 3000);
  };

  async function handleEdit(e) {
    e.preventDefault();

    const { error } = await supabase
      .from("users_movies")
      .update({
        status: status,
      })
      .eq("movie_id", id)
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
    setToast("Movie Info Edited ");
    setMovies((prev) =>
      prev.map((movie) =>
        movie.movies.id === Number(id) ? { ...movie, status: status } : movie,
      ),
    );
    setTimeout(() => {
      setToast("");
    }, 3000);
  }

  useEffect(() => {
    const loadMovieInfo = async () => {
      const { error, data } = await supabase
        .from("users_movies")
        .select("*")
        .eq("movie_id", id)
        .eq("user_id", user?.id);

      if (error) {
        console.error(error);
      }

      if (data.length !== 0) {
        const res = await supabase.from("movies").select("*").eq("id", id);
        setMovie(res.data[0]);

        setLoading(false);
        setMovieExists(true);
        setStatus(data[0].status);
        console.log("from db");
        console.log(res.data);
      } else if (location.pathname.startsWith("/tv")) {
        const res = await supabase.functions.invoke("movie-info", {
          body: {
            id: id,
            media_type: "tv",
          },
        });

        setMovie(res.data);
        console.log(res.data);
        setLoading(false);
        console.log("from api");
      } else if (location.pathname.startsWith("/movie")) {
        const res = await supabase.functions.invoke("movie-info", {
          body: {
            id: id,
            media_type: "movie",
          },
        });

        setMovie(res.data);
        console.log(res.data);
        setLoading(false);
        console.log("from api");
      }
    };

    loadMovieInfo();
  }, [id, location.pathname, user?.id]);

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
    <div className="w-full h-screen bg-main text-text-primary flex-col">
      <NavBar></NavBar>
      <div className="p-4 py-2 flex flex-col gap-5 ">
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
          <div className="max-sm:w-[70%]">
            <img
              src={movie.poster}
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
            <h1 className="text-[clamp(1.5rem,3vw,2rem)] fint-bold text-text-primary">
              {movie.title}
            </h1>
            <h4 className="text-[clamp(0.5rem,0.9rem,1.5rem)] text-text-secondary leading-relaxed min-w-0 break-words max-sm:text-[0.65rem]">
              {movie.description}
            </h4>
          </div>
        </div>

        <form
          action=""
          className="flex
                  gap-4
                  w-full
                  h-full
                  max-w-full
                  min-w-0"
        >
          <div className="w-full">
            <h2 className="p-1 text-text-primary">Status: </h2>
            <fieldset className="flex gap-3 flex-wrap">
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
                  onChange={(e) => {
                    setStatus(e.target.value);
                  }}
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
                  onChange={(e) => {
                    setStatus(e.target.value);
                  }}
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
                  Completed
                </span>
              </label>
            </fieldset>
            <div className="flex pe-6 pbs-8 md:hidden w-full">
              {movieExists ? (
                <div className="flex gap-5 w-full">
                  <button
                    className="justify-self-end self-end bg-accent-primary border-border-main transition border-1 px-8 max-sm:w-[30%] rounded-xl text-lg text-accent-text hover:bg-accent-hover"
                    onClick={handleDelete}
                  >
                    Delete
                  </button>
                  <button
                    type="submit"
                    onClick={handleEdit}
                    className="justify-self-end self-end bg-accent-primary border-border-main transition border-1 px-24 max-sm:w-[70%] rounded-xl text-lg text-accent-text hover:bg-accent-hover"
                  >
                    Edit
                  </button>
                </div>
              ) : (
                <div className="flex gap-5">
                  <button
                    type="submit"
                    onClick={handleInsertion}
                    className="justify-self-end self-end bg-accent-primary border-border-main transition border-1 px-24 max-sm:w-full rounded-xl text-lg text-accent-text hover:bg-accent-hover"
                  >
                    Add
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex pe-6 max-md:hidden">
            {movieExists ? (
              <div className="flex gap-5 w-full">
                <button
                  className="justify-self-end self-end bg-accent-primary border-border-main transition border-1 px-8 rounded-xl text-lg text-accent-text  hover:bg-accent-hover"
                  onClick={handleDelete}
                >
                  Delete
                </button>
                <button
                  type="submit"
                  onClick={handleEdit}
                  className="justify-self-end self-end bg-accent-primary border-border-main transition border-1 px-24  rounded-xl text-lg text-accent-text  hover:bg-accent-hover"
                >
                  Edit
                </button>
              </div>
            ) : (
              <div className="flex gap-5">
                <button
                  type="submit"
                  onClick={handleInsertion}
                  className="justify-self-end self-end bg-accent-primary border-border-main transition border-1 px-24 rounded-xl text-lg text-accent-text  hover:bg-accent-hover"
                >
                  Add
                </button>
              </div>
            )}
          </div>
        </form>
        <div className="relative w-full h-full">
          {toast.length === 0 ? (
            <></>
          ) : (
            <>
              <div className="absolute flex w-full h-full flex-col items-center justify-end">
                <h1
                  className={`max-w-50 text-center border-1 px-4 rounded-xl text-text-primary ${toastType === "error" ? "bg-red-500/20 border-red-500" : "bg-green-500/20 border-green-500"}`}
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
export default MovieInfoPage;
