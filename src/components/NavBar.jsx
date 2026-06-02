import SearchComponent from "./SearchComponent";
import logo from "../assets/sharkny.png";
import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
function NavBar(q) {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState(q.q || "");
  const [selectedSearch, setSelectedSearch] = useState("Top");
  useEffect(() => {
    setQuery(q.q);
  }, [q]);

  const handleClick = (e) => {
    e.preventDefault();
    if (location.pathname.startsWith("/search")) {
      navigate(`${location.pathname}?q=${encodeURIComponent(query)}`);
    } else {
      navigate(`/search/games?q=${encodeURIComponent(query)}`);
    }
  };

  const isSearchPage = location.pathname === "/search";

  return (
    <div className="w-full flex justify-between p-4 bg-nav border-b-1 border-bottom border-white/10">
      <div>
        <div className="flex gap-5 items-center">
          <Link to="/main" className="flex gap-2 items-center">
            <img
              src={logo}
              alt=""
              className="w-10 h-10 max-sm:w-6 max-sm:h-6"
            />
            <h1 className="text-4xl text-white hover:cursor-pointer max-sm:text-[1.4rem]">
              Sharkny
            </h1>
          </Link>
          <div className="flex flex-col gap-1 ">
            <select
              className="text-white"
              value={selectedSearch}
              onChange={(e) => {
                if (e.target.value === "popular") {
                  setSelectedSearch(e.target.value);
                  navigate("/search/games?q=");
                } else if (e.target.value === "recent") {
                  setSelectedSearch(e.target.value);
                  navigate("/search/games?q=&recent=week");
                }
              }}
            >
              <option className="text-black">Search</option>
              <option value="popular" className="text-black">
                Popular
              </option>
              <option value="recent" className="text-black">
                Recent
              </option>
            </select>
            {/* <Link to="/search/games?q=">
              <h2 className="text-white  max-sm:text-xs">Popular</h2>
            </Link>
            <Link to="/search/games?q=&recent=week">
              <h2 className="text-white max-sm:text-xs">Recent</h2>
            </Link> */}
          </div>
        </div>
      </div>
      <SearchComponent
        autofocus={isSearchPage}
        setQuery={setQuery}
        query={query}
        handleClick={handleClick}
      />
    </div>
  );
}

export default NavBar;
