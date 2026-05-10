import SearchComponent from "./SearchComponent";
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
function NavBar(q) {
  const navigate = useNavigate();
  const location = useLocation();

  const [query, setQuery] = useState(q.q || "");

  function handleSearchClick() {
    if (location.pathname != "/search") {
      navigate("/search?q=");
    }
  }

  const handleClick = (e) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const isSearchPage = location.pathname === "/search";

  return (
    <div className="w-full flex justify-between p-4">
      <h1 className="text-4xl text-black hover:cursor-pointer">
        <Link to="/main">Sharkny</Link>
      </h1>
      <SearchComponent
        width="80"
        clickhandler={handleSearchClick}
        autofocus={isSearchPage}
        setQuery={setQuery}
        query={query}
        handleClick={handleClick}
      />
    </div>
  );
}

export default NavBar;
