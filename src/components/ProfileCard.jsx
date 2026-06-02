import { useNavigate } from "react-router";

function ProfileCard({ name, img, id, loading }) {
  const navigate = useNavigate();
  function goToProfile() {
    navigate(`/profile/${id}/games`);
  }

  if (loading) {
    return (
      <>
        <div>
          <div
            className="w-full h-auto sm:max-h-20 bg-accent-primary flex items-center p-2 px-4 text-text-primary gap-5 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02]"
            onClick={goToProfile}
          >
            <div className="relative overflow-hidden rounded-full bg-neutral-700/20 border-1 border-gray-600 w-15 h-15">
              <div className="absolute -inset-10 w-full animate-shimmer rotate-12 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </div>
            <div className=" relative overflow-hidden bg-gray-700/20 w-40 h-5 rounded-xl border-1 border-gray-600 ">
              <div className="absolute -inset-10 w-full animate-shimmer rotate-12 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div
      className="w-full h-auto sm:max-h-20 bg-accent-primary/55 border-2 border-accent-primary flex items-center p-2 px-4 text-text-primary gap-5 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02]"
      onClick={goToProfile}
    >
      <img
        src={img || null}
        alt=""
        className="rounded-[50%] w-15 h-15 object-cover"
      />
      <h1 className="text-xl">{name}</h1>
    </div>
  );
}

export default ProfileCard;
