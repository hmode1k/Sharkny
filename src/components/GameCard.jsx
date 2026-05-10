import { useNavigate } from "react-router";

function GameCard({ name, img, id }) {
  const navigate = useNavigate();

  function handleClick() {
    navigate(`/games/${id}`);
  }

  return (
    <div onClick={handleClick}>
      <div
        className="p-4 max-w-42 min-w-40  h-60 border-1 bg-cover bg-center bg-no-repeat flex items-end relative hover:scale-110 hover:cursor-pointer transition-all duration-250 rounded-4xl"
        style={{
          backgroundImage: `url('${img}')`,
        }}
      >
        <div className="absolute inset-0 bg-black/40 rounded-4xl hover:bg-black/10 transition-all duration-250"></div>
        <h4 className="text-sky-50 absolute ">{name}</h4>
      </div>
    </div>
  );
}

export default GameCard;
