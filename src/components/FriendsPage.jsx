import NavBar from "./NavBar";
import Aside from "./Aside";
import { useEffect, useState } from "react";
import { supabase } from "../supabase-client";
import ProfileCard from "./ProfileCard";

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
    <>
      <NavBar></NavBar>
      <div className="w-full grid grid-cols-[150px_minmax(200px,_1fr)]">
        <Aside></Aside>
        <div className="w-full">
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
    </>
  );
}
export default FriendsPage;
