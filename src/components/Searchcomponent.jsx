function SearchBar() {
  return (
    <div className="flex flex-row bg-sky-400 w-[80vw] items-center p-2 rounded-2xl hover:cursor-pointer">
      <input
        type="text"
        id="search"
        className="w-full rounded-2xl hover:cursor-pointer focus:z-10 bg-green-500 px-2"
        placeholder="Search..."
      />
    </div>
  );
}

export default SearchBar;
