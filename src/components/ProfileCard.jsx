import { useNavigate } from "react-router";

function ProfileCard({ name, img, id }) {
  const navigate = useNavigate();
  function goToProfile() {
    navigate(`/profile/${id}/games`);
  }

  console.log("mapped", name, id, img);

  return (
    <div
      className="w-full h-auto sm:max-h-20 bg-accent-primary flex items-center p-2 px-4 text-text-primary gap-5 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02]"
      onClick={goToProfile}
    >
      <img src={img} alt="" className="rounded-[50%] w-15 h-15 object-cover" />
      <h1 className="text-xl">{name}</h1>
    </div>
  );
}

export default ProfileCard;
