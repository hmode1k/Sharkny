import SearchComponent from "./SearchComponent";
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
function NavBar(q) {
  const navigate = useNavigate();
  const location = useLocation();

  const [query, setQuery] = useState(q.q || "");

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
      <h1 className="text-4xl text-white hover:cursor-pointer max-sm:text-[1.5rem]">
        <Link to="/main">Sharkny</Link>
      </h1>
      <SearchComponent
        width="80"
        autofocus={isSearchPage}
        setQuery={setQuery}
        query={query}
        handleClick={handleClick}
      />
    </div>
  );
}

export default NavBar;
