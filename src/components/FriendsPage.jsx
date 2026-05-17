import NavBar from "./NavBar";
import { useEffect, useState } from "react";
import { supabase } from "../supabase-client";
import ProfileCard from "./ProfileCard";
import AsideWrapper from "./AsideWrapper";

function FriendsPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const { error, data } = await supabase.from("profiles").select("*");

      if (error) {
        console.error(error);
        return;
      }
      console.log(data);
      setUsers(data);
      setLoading(false);
    };

    fetchUsers();
  }, []);

  return loading ? (
    <>
      <h1>loading</h1>
    </>
  ) : (
    <div className="h-screen overflow-hidden">
      <NavBar></NavBar>
      <div className="w-full h-full sm:grid sm:grid-cols-[150px_minmax(200px,_1fr)] ">
        <AsideWrapper></AsideWrapper>
        <div className="flex gap-5 p-4 max-sm:flex-col ">
          {users.map((user) => {
            return (
              <ProfileCard
                name={user.full_name}
                img={user.avatar_url}
                id={user.id}
              ></ProfileCard>
            );
          })}
        </div>
      </div>
    </div>
  );
}
export default FriendsPage;
