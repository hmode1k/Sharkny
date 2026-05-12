import { useNavigate } from "react-router";

function ProfileCard({ name, img, id }) {
  const navigate = useNavigate();
  function goToProfile() {
    navigate(`/profile/${id}`);
  }

  console.log("mapped", name, id, img);

  return (
    <div className="w-full h-20 border-black" onClick={goToProfile}>
      <img src={img} alt="" className="rounded-[50%] w-10 h-10" />
      <h1>{name}</h1>
    </div>
  );
}

export default ProfileCard;
