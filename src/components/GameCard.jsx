function GameCard() {
  let gameCover =
    "https://media.rawg.io/media/games/dcb/dcbb67f371a9a28ea38ffd73ee0f53f3.jpg";
  let gameName = "fortnite";

  return (
    <div
      className="p-4 w-50 h-65 border-2 bg-cover bg-center bg-no-repeat flex items-end relative hover:scale-110 hover:cursor-pointer transition-all duration-250 rounded-4xl"
      style={{
        backgroundImage: `url('${gameCover}')`,
      }}
    >
      <div className="absolute inset-0 bg-black/40 rounded-4xl hover:bg-black/20 transition-all duration-250"></div>
      <h4 className="text-sky-50 absolute ">{gameName}</h4>
    </div>
  );
}

export default GameCard;
