function SearchComponent({ width, autofocus, setQuery, query, handleClick }) {
  const barStyles = {
    "--width": `${width}%`,
  };

  return (
    <div
      className="flex flex-row bg-sky-400 w-[50%] md:w-[var(--width)] items-center rounded-2xl hover:cursor-pointer mbs-1"
      style={barStyles}
    >
      <form
        action=""
        onSubmit={handleClick}
        className="w-full h-full rounded-2xl hover:cursor-pointer focus:z-10 bg-green-500 px-2 flex"
      >
        <input
          type="text"
          id="search"
          className="w-full h-full rounded-2xl focus:z-10 bg-green-500 px-2 focus:outline-none"
          placeholder="Search..."
          value={query}
          autoFocus={autofocus}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit"> search</button>
      </form>
    </div>
  );
}

export default SearchComponent;
