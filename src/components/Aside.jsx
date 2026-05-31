import { Link, useNavigate } from "react-router";
import { supabase } from "../supabase-client";
import { useState } from "react";

function Aside() {
  const navigate = useNavigate();
  const [openSection, setOpenSection] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function handleNavigate(path, cat) {
    navigate(`/${path}/${cat}`);
  }

  const toggleSection = (name) => {
    setOpenSection((prev) => (prev === name ? null : name));
  };

  const logOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (!sidebarOpen && window.innerWidth < 640) {
    return (
      <>
        <div>
          <button
            onClick={() => setSidebarOpen(true)}
            className="sm:hidden p-2"
          >
            ☰
          </button>
        </div>
      </>
    );
  }

  return (
    <div
      className={`flex flex-col  gap-4 h-full bg-nav text-text-secondary border-r-1 border-white/5 transition-all duration-300 sm:p-4
        ${sidebarOpen ? "max-sm:w-full max-sm:items-center" : "max-sm:w-0 sm:w-full max-sm:overflow-hidden"}`}
    >
      <div className="max-sm:w-full max-sm:flex max-sm:flex-col max-sm:items-center max-sm:justify-center">
        <button
          onClick={() => setSidebarOpen(false)}
          className="md:hidden sm:items-center p-2"
        >
          ☰
        </button>
        <div className="flex gap-5 sm:p-2">
          <h1
            className="cursor-pointer"
            onClick={() => handleNavigate("games", "")}
          >
            Games
          </h1>
          <button onClick={() => toggleSection("games")}>
            {openSection === "games" ? <>↑</> : <>↓</>}
          </button>
        </div>
        <div
          className={`${openSection === "games" ? "max-h-40" : "max-h-0"} overflow-hidden transition-all`}
        >
          <ul className="p-2 ps-6">
            <li>
              <Link to="/games/library">Library</Link>
            </li>
            <li>
              <Link to="/games/wishlist">Wishlist</Link>
            </li>
            <li>
              <Link to="/games/completed">Completed</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-sm:w-full max-sm:flex max-sm:flex-col max-sm:items-center max-sm:justify-center">
        <div className="flex gap-5 p-2">
          <h1 className="cursor-pointer">
            <Link to="/movies" replace>
              Movies
            </Link>
          </h1>
          <button onClick={() => toggleSection("movies")}>
            {openSection === "movies" ? <>↑</> : <>↓</>}
          </button>
        </div>
        <div
          className={`${openSection === "movies" ? "max-h-40" : "max-h-0"} overflow-hidden transition-all`}
        >
          <ul className="p-2 ps-6">
            <li>
              <Link to="/movies/library" replace>
                Library
              </Link>
            </li>
            <li>
              <Link to="/movies/wishlist" replace>
                Wishlist
              </Link>
            </li>
            <li>
              <Link to="/movies/completed">Completed</Link>
            </li>
          </ul>
        </div>
      </div>
      <div>
        <h1 className="ms-2 p-1">
          <Link to={`/profile/${"1"}/games`}>Profile</Link>
        </h1>
        <h1 className="ms-2 p-1">
          <Link to="/friends">Friends</Link>
        </h1>
        <h1 className="ms-2 p-1">
          <Link to="/requests">Requests</Link>
        </h1>
      </div>

      <button onClick={logOut} className="justify-center">
        Log Out
      </button>
    </div>
  );
}

export default Aside;
