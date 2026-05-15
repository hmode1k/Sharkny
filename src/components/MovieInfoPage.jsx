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
    <div>
      <NavBar></NavBar>
      <div>
        <h1>{movie.title}</h1>
        <h4>{movie.description}</h4>
        <img src={movie.poster} alt="" />
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
                value="completed"
                checked={status === "completed"}
                onChange={(e) => {
                  setStatus(e.target.value);
                }}
              />
              completed
            </label>
          </fieldset>

          {movieExists ? (
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
export default MovieInfoPage;
