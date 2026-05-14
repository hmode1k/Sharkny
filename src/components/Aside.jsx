import { Link, useNavigate } from "react-router";
import { supabase } from "../supabase-client";

function Aside() {
  const navigate = useNavigate();

  const logOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="flex flex-col gap-4 w-full h-full bg-red-700">
      <div>
        <h1 className="ms-2 p-1">games</h1>
        <div className="ms-6">
          <h2>
            <Link to="/games/library">Library</Link>
          </h2>
          <h2>
            <Link to="/games/wishlist">Wishlist</Link>
          </h2>
          <h2>
            <Link to="/games/completed">completed</Link>
          </h2>
        </div>
        <br />
        <h1 className="ms-2 p-1">movies</h1>
        <div className="ms-6">
          <h2>
            <Link to="/movies/library">Library</Link>
          </h2>
          <h2>
            <Link to="/movies/wishlist">Wishlist</Link>
          </h2>
          <h2>
            <Link to="/movies/completed">completed</Link>
          </h2>
        </div>
        <br />
        <h1 className="ms-2 p-1">
          <Link to="/search/games">Search</Link>
        </h1>
        <h1 className="ms-2 p-1">
          <Link to="/profile">Profile</Link>
        </h1>
        <h1 className="ms-2 p-1">
          <Link to="/friends">Friends</Link>
        </h1>
        <h1 className="ms-2 p-1">Free Games</h1>
      </div>

      <button onClick={logOut}>logOut</button>
    </div>
  );
}

export default Aside;
