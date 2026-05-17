import { Link, useNavigate } from "react-router";
import { supabase } from "../supabase-client";
import { useState } from "react";

function Aside() {
  const navigate = useNavigate();
  const [openSection, setOpenSection] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
            onClick={() => {
              navigate("/games", { replace: true });
            }}
            className="cursor-pointer"
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
            <li onClick={() => navigate("/games/library", { replace: true })}>
              Library
            </li>
            <li onClick={() => navigate("/games/wishlist", { replace: true })}>
              Wishlist
            </li>
            <li onClick={() => navigate("/games/completed", { replace: true })}>
              Completed
            </li>
          </ul>
        </div>
      </div>
      <div className="max-sm:w-full max-sm:flex max-sm:flex-col max-sm:items-center max-sm:justify-center">
        <div className="flex gap-5 p-2">
          <h1
            onClick={() => {
              navigate("/movies", { replace: true });
            }}
            className="cursor-pointer"
          >
            Movies
          </h1>
          <button onClick={() => toggleSection("movies")}>
            {openSection === "movies" ? <>↑</> : <>↓</>}
          </button>
        </div>
        <div
          className={`${openSection === "movies" ? "max-h-40" : "max-h-0"} overflow-hidden transition-all`}
        >
          <ul className="p-2 ps-6">
            <li onClick={() => navigate("/movies/library", { replace: true })}>
              Library
            </li>
            <li onClick={() => navigate("/movies/wishlist", { replace: true })}>
              Wishlist
            </li>
            <li
              onClick={() => navigate("/movies/completed", { replace: true })}
            >
              Completed
            </li>
          </ul>
        </div>
      </div>
      <div>
        <h1 className="ms-2 p-1">
          <Link to="/profile">Profile</Link>
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
