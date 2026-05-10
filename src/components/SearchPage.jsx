import NavBar from "./NavBar";
import GameCard from "./GameCard";

function SearchPage() {
  return (
    <>
      <NavBar></NavBar>

      <div className="flex flex-wrap gap-5 p-4">
        <GameCard></GameCard>
        <GameCard></GameCard>
        <GameCard></GameCard>
        <GameCard></GameCard>
        <GameCard></GameCard>
        <GameCard></GameCard>
        <GameCard></GameCard>
        <GameCard></GameCard>
        <GameCard></GameCard>
        <GameCard></GameCard>
        <GameCard></GameCard>
        <GameCard></GameCard>
      </div>
    </>
  );
}

export default SearchPage;
