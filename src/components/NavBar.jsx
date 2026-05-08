import SearchComponent from "./SearchComponent";

function NavBar() {
  return (
    <div className="w-full flex justify-between p-4">
      <h1 className="text-4xl text-black hover:cursor-pointer">Sharkny</h1>
      <SearchComponent width="80" />
    </div>
  );
}

export default NavBar;
