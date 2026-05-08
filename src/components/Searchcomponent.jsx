function SearchComponent({ width }) {
  const barStyles = {
    "--width": `${width}%`,
  };

  console.log(barStyles);
  return (
    <div
      className="flex flex-row bg-sky-400 w-[var(--width)] items-center p-2 rounded-2xl hover:cursor-pointer mbs-1"
      style={barStyles}
    >
      <input
        type="text"
        id="search"
        className="w-full rounded-2xl hover:cursor-pointer focus:z-10 bg-green-500 px-2"
        placeholder="Search..."
      />
    </div>
  );
}

export default SearchComponent;
