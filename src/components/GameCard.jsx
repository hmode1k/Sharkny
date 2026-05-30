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
      <div
        className="max-sm:w-25 max-sm:h-35 max-sm:text-xs ps-2 pbe-1 w-35 h-50 border-1 flex flex-col justify-end hover:cursor-pointer rounded-4xl overflow-hidden card-bg "
        style={{
          backgroundImage: `url(${img?.replace("t_thumb", "t_cover_big")})`,
        }}
        onClick={handleClick}
      >
        <div className="flex flex-col w-full h-full justify-between p-2">
          {location.pathname.startsWith("/search") ? (
            <></>
          ) : (
            <>
              <div className="w-full p-1 flex flex-col gap-1 items-end">
                <button
                  className={`
                    ${
                      location.pathname.includes("profile")
                        ? "opacity-0"
                        : "opacity-90"
                    } text-white w-6 max-sm:w-5 max-sm:h-5 max-sm:text-[8px] h-6 bg-yellow-500 rounded-4xl card-stuff`}
                  disabled={
                    location.pathname.includes("profile") ? true : false
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(true);
                    setType("edit");
                  }}
                >
                  🖉
                </button>
                <button
                  className={`
                    ${
                      location.pathname.includes("profile")
                        ? "opacity-0"
                        : "opacity-90"
                    } text-white w-6 h-6 max-sm:w-5 max-sm:h-5 max-sm:text-[8px] bg-red-500 rounded-4xl card-stuff`}
                  disabled={
                    location.pathname.includes("profile") ? true : false
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(true);
                    setType("delete");
                  }}
                >
                  X
                </button>
              </div>
            </>
          )}
          <div>
            <h4 className="text-white w-full card-name">{name}</h4>
            <div className=" flex gap-2 text-[0.7rem] w-full ">
              <h4 className="text-accent-text bg-accent-primary card-stuff border-1 border-blue-500 px-1 rounded-sm max-sm:text-[8px]">
                {status?.charAt(0).toUpperCase() + status?.slice(1) || ""}
              </h4>
              {platform ? (
                <>
                  <h4 className="text-accent-text bg-accent-primary card-stuff border-1 border-blue-500 px-1 rounded-sm max-sm:text-[8px]">
                    {platform?.charAt(0).toUpperCase() + platform?.slice(1) ||
                      ""}
                  </h4>
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
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
              name={name}
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
