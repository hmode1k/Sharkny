import { useNavigate } from "react-router";
import { supabase } from "../supabase-client";
import { useAuth } from "../AuthContext";
import { useState } from "react";
import { Heart } from "lucide-react";

function ProfileCard({ name, img, id, loading, favorite }) {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(favorite || false);

  const navigate = useNavigate();
  function goToProfile() {
    navigate(`/profile/${id}/games`);
  }

  async function toggleFavorite() {
    if (isFavorite) {
      setIsFavorite(false);
      const { error } = await supabase
        .from("favorite_user")
        .delete("")
        .eq("user_id", user.id)
        .eq("favorite_id", id);

      if (error) {
        console.error(error);
        setIsFavorite(true);

        return;
      }

      setIsFavorite(false);
    } else {
      setIsFavorite(true);

      const { error } = await supabase.from("favorite_user").insert({
        user_id: user.id,
        favorite_id: id,
        is_favorite: true,
      });

      if (error) {
        console.error(error);
        setIsFavorite(false);

        return;
      }
      setIsFavorite(true);
    }
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
        className="rounded-[50%] w-15 h-15 object-cover max-sm:w-10 max-sm:h-10"
      />
      <div className="flex justify-between w-full">
        <h1 className="text-xl max-sm:text-lg">{name}</h1>
        <h2
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite();
          }}
        >
          <Heart
            className={
              isFavorite
                ? "fill-pink-500 text-pink-500"
                : "fill-none text-white"
            }
          />
        </h2>
      </div>
    </div>
  );
}

export default ProfileCard;
