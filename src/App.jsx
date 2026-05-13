import "./App.css";
import Aside from "./components/Aside";
import NavBar from "./components/NavBar";
import CardContainer from "./components/CardContainer";
import { useEffect, useState } from "react";
import { supabase } from "./supabase-client";

function App() {
  const [userId, setUserId] = useState(null);
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserId(user.id);
    };

    fetchUser();
  });

  return (
    <>
      <NavBar></NavBar>
      <div className="h-full w-full grid grid-cols-[150px_minmax(200px,_1fr)]">
        <Aside className=""></Aside>
        <div>
          <CardContainer header="library" userId={userId}></CardContainer>
          <CardContainer header="wishlist" userId={userId}></CardContainer>
          <CardContainer header="played" userId={userId}></CardContainer>
        </div>
      </div>
    </>
  );
}

export default App;
