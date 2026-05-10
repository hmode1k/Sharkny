import SearchComponent from "./SearchComponent";
import { Link, useNavigate, useLocation } from "react-router";
function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  function handleSearchClick() {
    if (location.pathname != "/search") {
      navigate("/search");
    }
  }

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
      />
    </div>
  );
}

export default NavBar;
