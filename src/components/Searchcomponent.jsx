function SearchComponent({ width, autofocus, setQuery, query, handleClick }) {
  const barStyles = {
    "--width": `${width}%`,
  };

  return (
    <div
      className="flex flex-row w-[50%] md:w-[var(--width)] items-center rounded-2xl hover:cursor-pointer mbs-1 text-text-secondary max-sm:w-full max-sm:ps-8"
      style={barStyles}
    >
      <form
        action=""
        onSubmit={handleClick}
        className="w-full h-full rounded-2xl hover:cursor-pointer focus:z-10 px-2 flex gap-2"
      >
        <div className="relative w-full">
          <input
            type="text"
            id="search"
            className="w-full h-full rounded-2xl focus:z-10 bg-search px-2 focus:outline-none focus:bg-search focus:text-text-primary text-text-muted border-1 border-white/5 focus:border-white/10"
            placeholder="Search..."
            value={query}
            autoFocus={autofocus}
            autoComplete="off"
            onChange={(e) => setQuery(e.target.value)}
          />

          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2
            text-gray-400 hover:text-white
            text-sm"
              type="button"
            >
              X
            </button>
          )}
        </div>
        <button type="submit" className="text-[1.5rem]">
          ⌕
        </button>
      </form>
    </div>
  );
}

export default SearchComponent;
