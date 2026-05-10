import { Link, useNavigate } from "react-router";
import { supabase } from "../supabase-client";

let navigate;

const logOut = async () => {
  await supabase.auth.signOut();
  navigate("/");
};

function Aside() {
  navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 w-full h-full bg-red-700">
      <div>
        <h1 className="ms-2 p-1">My Library</h1>
        <div className="ms-6">
          <h2>
            <Link to="/library">Library</Link>
          </h2>
          <h2>
            <Link to="/wishlist">Wishlist</Link>
          </h2>
          <h2>
            <Link to="/played">Played</Link>
          </h2>
        </div>
        <br />
        <h1 className="ms-2 p-1">
          <Link to="/search">Search</Link>
        </h1>
        <h1 className="ms-2 p-1">Free Games</h1>
      </div>

      <button onClick={logOut}>logOut</button>
    </div>
  );
}

export default Aside;
