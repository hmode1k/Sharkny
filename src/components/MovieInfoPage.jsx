import { useEffect, useState } from "react";
import NavBar from "./NavBar";
import { useLocation, useNavigate, useParams } from "react-router";
import { supabase } from "../supabase-client";

function MovieInfoPage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [movieExists, setMovieExists] = useState(false);
  const [status, setStatus] = useState("library");
  const navigate = useNavigate();
  const location = useLocation();

  const handleDelete = async (e) => {
    e.preventDefault();
    console.log("deleting");
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase
      .from("users_movies")
      .delete("")
      .eq("movie_id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error(error);
      return;
    }
  };

  const handleback = (e) => {
    e.preventDefault();
    navigate(-1);
  };

  const handleInsertion = async (e) => {
    e.preventDefault();
    const {
      data: { user },
    } = await supabase.auth.getUser();

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

    const { error2 } = await supabase.from("users_movies").insert({
      user_id: user.id,
      movie_id: movie.id,
      status: status,
    });
    if (error2) {
      console.error(error2);
      return;
    }
    console.log("inserted");
  };

  async function handleEdit(e) {
    e.preventDefault();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { error } = await supabase
      .from("users_movies")
      .update({
        status: status,
      })
      .eq("movie_id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error(error);
      return;
    }
    navigate("/");
  }

  useEffect(() => {
    const loadMovieInfo = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { error, data } = await supabase
        .from("users_movies")
        .select("*")
        .eq("movie_id", id)
        .eq("user_id", user.id);

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
  }, [id, location.pathname]);

  return loading ? (
    <>
      <h1>loading</h1>
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

    peer-checked:border-blue-500
    peer-checked:text-blue-500
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

    peer-checked:border-blue-500
    peer-checked:text-blue-500
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

    peer-checked:border-blue-500
    peer-checked:text-blue-500
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
                    className="justify-self-end self-end bg-accent-primary border-border-main transition border-1 px-8 max-sm:w-[30%] rounded-xl text-lg text-gray-300 hover:bg-accent-hover"
                    onClick={handleDelete}
                  >
                    Delete
                  </button>
                  <button
                    type="submit"
                    onClick={handleEdit}
                    className="justify-self-end self-end bg-accent-primary border-border-main transition border-1 px-24 max-sm:w-[70%] rounded-xl text-lg text-gray-300 hover:bg-accent-hover"
                  >
                    Edit
                  </button>
                </div>
              ) : (
                <div className="flex gap-5">
                  <button
                    type="submit"
                    onClick={handleInsertion}
                    className="justify-self-end self-end bg-accent-primary border-border-main transition border-1 px-24 max-sm:w-full rounded-xl text-lg text-gray-300 hover:bg-accent-hover"
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
                  className="justify-self-end self-end bg-accent-primary border-border-main transition border-1 px-8 rounded-xl text-lg text-gray-300 hover:bg-accent-hover"
                  onClick={handleDelete}
                >
                  Delete
                </button>
                <button
                  type="submit"
                  onClick={handleEdit}
                  className="justify-self-end self-end bg-accent-primary border-border-main transition border-1 px-24  rounded-xl text-lg text-gray-300 hover:bg-accent-hover"
                >
                  Edit
                </button>
              </div>
            ) : (
              <div className="flex gap-5">
                <button
                  type="submit"
                  onClick={handleInsertion}
                  className="justify-self-end self-end bg-accent-primary border-border-main transition border-1 px-24 rounded-xl text-lg text-gray-300 hover:bg-accent-hover"
                >
                  Add
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
export default MovieInfoPage;
