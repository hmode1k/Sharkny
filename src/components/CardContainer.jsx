import GameCard from "./GameCard";
import { Link } from "react-router";

function CardContainer({ header }) {
  return (
    <div className="p-4">
      <div className="flex gap-4 ps-4 mbe-2">
        <h2 className="text-2xl">{header}</h2>
        <Link to="/library">Expand</Link>
      </div>
      <div className="flex flex-row flex-nowrap *:shrink-0 p-4 gap-4 overflow-x-scroll overflow-y-hidden hover-scroll w-full relative">
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

export default CardContainer;
