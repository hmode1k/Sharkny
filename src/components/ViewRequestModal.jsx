import { useState } from "react";

function ViewRequestModal({
  setModalOpen,
  modalRequest,
  handleUpdate,
  handleDelete,
  requester,
}) {
  const [tab, setTab] = useState("games");

  console.log("modalreq", modalRequest);

  return (
    <div
      className="fixed w-screen h-screen z-20 flex items-center justify-center  top-0 left-0  bg-black/80 text-white p-4"
      onClick={() => setModalOpen(false)}
    >
      <div
        className=" p-2 rounded-2xl bg-main w-[30%] h-[80%]"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="h-full">
          <div className="flex justify-between p-2">
            <h1>Request: {modalRequest.request_status}</h1>
            <button
              onClick={() => {
                setModalOpen(false);
              }}
            >
              X
            </button>
          </div>
          <div className="flex gap-5 tab px-4">
            <button
              onClick={() => {
                setTab("games");
              }}
              className={`${tab === "games" && "active"}`}
            >
              Games
            </button>
            <button
              onClick={() => {
                setTab("movies");
              }}
              className={`${tab === "movies" && "active"}`}
            >
              Movies
            </button>
          </div>
          <div className="h-full flex flex-col">
            {tab === "games" ? (
              <div className="overflow-scroll h-[60%] pbe-4">
                <ul className=" p-4 flex flex-col gap-2">
                  {modalRequest.requested_games.map((game) => {
                    return <li key={game.id}>{game.name}</li>;
                  })}
                </ul>
              </div>
            ) : (
              <div className="overflow-scroll h-[60%] pbe-4">
                <ul className=" p-4 flex flex-col gap-2">
                  {modalRequest.requested_movies.map((movie) => {
                    return <li key={movie.id}>{movie.name}</li>;
                  })}
                </ul>
              </div>
            )}
            {modalRequest.request_status === "pending" ? (
              <div>
                {modalRequest.requester_id === requester ? (
                  <></>
                ) : (
                  <>
                    <div className="flex w-full gap-5">
                      <button
                        onClick={() =>
                          handleUpdate("rejected", modalRequest.id)
                        }
                        className="text-text-primary bg-red-500 hover:bg-red-400 transition-all duration-200 cursor-pointer w-full mbs-8 rounded-2xl"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() =>
                          handleUpdate("accepted", modalRequest.id)
                        }
                        className="text-text-primary bg-green-500 hover:bg-accent-hover transition-all duration-200 cursor-pointer w-full mbs-8 rounded-2xl"
                      >
                        Accept
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                {modalRequest.request_status === "accepted" ? (
                  <>
                    <button
                      onClick={() => handleUpdate("completed", modalRequest.id)}
                      className="text-text-primary bg-accent-primary hover:bg-accent-hover transition-all duration-200 cursor-pointer w-full mbs-8 rounded-2xl"
                    >
                      Complete
                    </button>
                  </>
                ) : (
                  <></>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  //   return (
  //     <>
  //       <div className="bg-red-500 w-[50%] h-[50%] absolute inset-0 translate-[50%]">
  //         <h1>Modal</h1>
  //         <div>
  //           <button onClick={() => setTab("games")}>games</button>
  //           <button onClick={() => setTab("movies")}>movies</button>
  //         </div>
  //         <ul>
  //           {tab === "games"
  //             ? modalRequest.requested_games.map((game) => {
  //                 return <li key={game.id}>{game.name}</li>;
  //               })

  //         </ul>
  //         <button onClick={() => setModalOpen(false)}>Close</button>
  //       </div>
  //     </>
  //   );
}

export default ViewRequestModal;
