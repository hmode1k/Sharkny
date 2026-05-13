import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import Modal from "./Modal";

function GameCard({ name, img, id, platform, status, media_type }) {
  const [isEditing, setIsEditing] = useState(false);
  const [type, setType] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  function handleClick() {
    navigate(`/${media_type}/${id}`);
  }

  return (
    <div className="relative">
      <div className="p-4 w-35  h-50 border-1  flex items-end relative hover:scale-110 hover:cursor-pointer transition-all duration-250 rounded-4xl overflow-hidden">
        <img
          src={img?.replace("t_thumb", "t_cover_big")}
          alt=""
          className="absolute inset-0 z-0 object-cover  w-full h-full"
        />
        <div
          className="absolute inset-0 bg-black/40 rounded-4xl hover:bg-black/10 transition-all duration-250 z-2"
          onClick={handleClick}
        ></div>
        <div className="abolute z-4">
          <h4 className="text-sky-50 w-full bg-black/10">{name}</h4>
          <h4 className="text-sky-50 w-full ">{status}</h4>
          <h4 className="text-sky-50 w-full">{platform}</h4>
          {location.pathname.startsWith("/search") ? (
            <></>
          ) : (
            <>
              <div className="w-full absolute z-10 bottom-1 left-10 p-1 flex flex-col gap-1">
                <button
                  className="text-sky-50"
                  onClick={() => {
                    setIsEditing(true);
                    setType("edit");
                  }}
                >
                  EDIT
                </button>
                <button
                  className="text-sky-50"
                  onClick={() => {
                    setIsEditing(true);
                    setType("delete");
                  }}
                >
                  DELETE
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {isEditing ? (
        <>
          <div className="bg-sky-700">
            <Modal
              dbplatform={platform}
              dbstatus={status}
              setEditing={setIsEditing}
              type={type}
              id={id}
            ></Modal>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

export default GameCard;
