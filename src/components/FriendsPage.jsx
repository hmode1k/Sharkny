import NavBar from "./NavBar";
import { useEffect, useState } from "react";
import { supabase } from "../supabase-client";
import ProfileCard from "./ProfileCard";
import AsideWrapper from "./AsideWrapper";
import { useAuth } from "../AuthContext";

function FriendsPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [localSearch, setLocalSearch] = useState("");
  const { user } = useAuth();

  const filteredItems = users.filter((item) => {
    const itemName = item?.full_name || "";

    return itemName.toLowerCase().includes(localSearch.toLowerCase());
  });

  useEffect(() => {
    const fetchUsers = async () => {
      const [profilesRes, favoritesRes] = await Promise.all([
        supabase.from("profiles").select("*"),
        supabase
          .from("favorite_user")
          .select("favorite_id")
          .eq("user_id", user.id)
          .eq("is_favorite", true),
      ]);

      const favoriteIds = new Set(favoritesRes.data.map((f) => f.favorite_id));
      const users = profilesRes.data.map((profile) => ({
        ...profile,
        is_favorite: favoriteIds.has(profile.id),
      }));

      users.sort((a, b) => {
        if (a.is_favorite !== b.is_favorite) {
          return Number(b.is_favorite) - Number(a.is_favorite);
        }

        return a.full_name.localeCompare(b.full_name);
      });

      setUsers(users);
      setLoading(false);
    };

    fetchUsers();
  }, [user.id]);

  return loading ? (
    <>
      <div className="h-full overflow-hidden">
        <NavBar></NavBar>
        <div className="w-full h-full sm:grid sm:grid-cols-[150px_minmax(200px,_1fr)] ">
          <AsideWrapper></AsideWrapper>
          <div className="p-4">
            <div className="flex gap-10 text-text-primary items-center ">
              <h1 className="text-xl">Friends</h1>
              <input
                type="text"
                placeholder="Search Friends"
                value={localSearch}
                className="w-[30%] max-sm:w-[60%] bg-search border-1 border-white/10 rounded-xl px-2"
                onChange={(e) => {
                  setLocalSearch(e.target.value);
                }}
              />
            </div>
            <div className="flex flex-col gap-5 p-4 max-sm:flex-col overflow-scroll ">
              <ProfileCard loading={loading}></ProfileCard>
              <ProfileCard loading={loading}></ProfileCard>
              <ProfileCard loading={loading}></ProfileCard>
              <ProfileCard loading={loading}></ProfileCard>
              <ProfileCard loading={loading}></ProfileCard>
              <ProfileCard loading={loading}></ProfileCard>
              <ProfileCard loading={loading}></ProfileCard>
              <ProfileCard loading={loading}></ProfileCard>
              <ProfileCard loading={loading}></ProfileCard>
              <ProfileCard loading={loading}></ProfileCard>
            </div>
          </div>
        </div>
      </div>
    </>
  ) : (
    <div className="h-full overflow-hidden">
      <NavBar></NavBar>
      <div className="w-full h-full sm:grid sm:grid-cols-[150px_minmax(200px,_1fr)] ">
        <AsideWrapper></AsideWrapper>
        <div className="p-4">
          <div className="flex gap-10 text-text-primary items-center ">
            <h1 className="text-xl">Friends</h1>
            <input
              type="text"
              placeholder="Search Friends"
              value={localSearch}
              className="w-[30%] max-sm:w-[60%] bg-search border-1 border-white/10 rounded-xl px-2"
              onChange={(e) => {
                setLocalSearch(e.target.value);
              }}
            />
          </div>
          <div className="flex flex-col gap-5 p-4 max-sm:flex-col overflow-scroll ">
            {filteredItems.map((user) => {
              return (
                <ProfileCard
                  key={user.id}
                  name={user.full_name}
                  img={user.avatar_url}
                  id={user.id}
                  favorite={user.is_favorite}
                ></ProfileCard>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
export default FriendsPage;
