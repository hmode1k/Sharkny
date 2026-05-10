import NavBar from "./NavBar";
import GameCard from "./GameCard";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

function SearchPage() {
  const [searchParams] = useSearchParams();

  const query = searchParams.get("q");
  const [games, setGames] = useState([]);
  let searchURL = `https://api.rawg.io/api/games?search=${query}&key=1806ecb756ee40288b7dbed9e611ab2d`;

  useEffect(() => {
    const handleSearch = async (searchURL) => {
      const res = await fetch(searchURL);
      const data = await res.json();
      setGames(data.results);
    };

    if (!query) {
      handleSearch(
        "https://api.rawg.io/api/games?page=1&page_size=10&key=1806ecb756ee40288b7dbed9e611ab2d",
      );
    }

    handleSearch(searchURL);
  }, [query, searchURL]);

  return (
    <>
      <NavBar q={query}></NavBar>

      <div className="flex flex-wrap gap-5 p-4">
        {games.map((game) => {
          return (
            <GameCard
              key={game.id}
              name={game.name}
              img={game.background_image}
            ></GameCard>
          );
        })}
      </div>
    </>
  );
}

export default SearchPage;
