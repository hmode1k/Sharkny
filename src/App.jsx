import "./App.css";
import Aside from "./components/Aside";
import NavBar from "./components/NavBar";
import CardContainer from "./components/CardContainer";
import { useEffect, useState } from "react";
import { supabase } from "./supabase-client";
import { useNavigate, useParams } from "react-router";

function App() {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { category } = useParams();
  console.log("param", category);
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserId(user.id);
      setLoading(false);
    };

    fetchUser();
  });

  return loading ? (
    <>loading</>
  ) : (
    <>
      <NavBar></NavBar>
      <div className="h-full w-full grid grid-cols-[150px_minmax(200px,_1fr)]">
        <Aside className=""></Aside>
        <div>
          <div className="w-full flex gap-50  justify-center content-center">
            <button
              onClick={() => {
                navigate(`/main/games`);
                setLoading(true);
              }}
            >
              game
            </button>
            <button
              onClick={() => {
                navigate(`/main/movies`);
                setLoading(true);
              }}
            >
              movies
            </button>
          </div>
          <CardContainer
            header="library"
            userId={userId}
            media_type={category}
            setLoading2={setLoading}
          ></CardContainer>
          <CardContainer
            header="wishlist"
            userId={userId}
            media_type={category}
            setLoading2={setLoading}
          ></CardContainer>
          <CardContainer
            header="completed"
            userId={userId}
            media_type={category}
            setLoading2={setLoading}
          ></CardContainer>
        </div>
      </div>
    </>
  );
}

export default App;
