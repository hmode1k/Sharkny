import { useState } from "react";

function ViewRequestModal({ setModalOpen, modalRequest }) {
  const [tab, setTab] = useState("games");

  console.log("modalreq", modalRequest);
  return (
    <>
      <div className="bg-red-500 w-[50%] h-[50%] absolute inset-0 translate-[50%]">
        <h1>Modal</h1>
        <div>
          <button onClick={() => setTab("games")}>games</button>
          <button onClick={() => setTab("movies")}>movies</button>
        </div>
        <ul>
          {tab === "games"
            ? modalRequest.requested_games.map((game) => {
                return <li key={game.id}>{game.name}</li>;
              })
            : modalRequest.requested_movies.map((movie) => {
                return <li key={movie.id}>{movie.name}</li>;
              })}
        </ul>
        <button onClick={() => setModalOpen(false)}>Close</button>
      </div>
    </>
  );
}

export default ViewRequestModal;
