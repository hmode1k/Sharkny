function SearchComponent({ width, clickhandler, autofocus }) {
  const barStyles = {
    "--width": `${width}%`,
  };

  return (
    <div
      className="flex flex-row bg-sky-400 w-[var(--width)] items-center rounded-2xl hover:cursor-pointer mbs-1"
      style={barStyles}
      onClick={clickhandler}
    >
      <input
        type="text"
        id="search"
        className="w-full h-full rounded-2xl hover:cursor-pointer focus:z-10 bg-green-500 px-2"
        placeholder="Search..."
        autoFocus={autofocus}
      />
    </div>
  );
}

export default SearchComponent;
