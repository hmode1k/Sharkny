import GameCard from "./GameCard";
import SearchComponent from "./SearchComponent";

function FullCardContainer() {
  return (
    <div className="w-full p-2">
      <div className="flex items-center gap-10 p-2">
        <SearchComponent width="50" />
        <h2 className="text-black">Filter</h2>
      </div>
      <div className="flex flex-wrap gap-5 p-2">
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
    </div>
  );
}

export default FullCardContainer;
