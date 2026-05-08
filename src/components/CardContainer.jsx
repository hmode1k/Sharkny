import GameCard from "./GameCard";

function CardContainer({ header }) {
  return (
    <div className="p-4">
      <div className="flex gap-4 ps-4 mbe-2">
        <h2 className="text-2xl">{header}</h2>
        <button>expand</button>
      </div>
      <div className="flex flex-row flex-nowrap *:shrink-0 p-4 gap-4 w-full overflow-x-scroll overflow-y-hidden shadwon-[-10px_0_10px_rgba(0,0,0,0.55)] hover-scroll">
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
