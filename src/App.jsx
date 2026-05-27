import "./App.css";
import NavBar from "./components/NavBar";
import CardContainer from "./components/CardContainer";
import { useEffect, useState } from "react";
import { supabase } from "./supabase-client";
import { useNavigate, useParams } from "react-router";
import AsideWrapper from "./components/AsideWrapper";

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
      <div className="h-full w-full sm:grid sm:grid-cols-[150px_minmax(200px,_1fr)]">
        <AsideWrapper></AsideWrapper>
        <div className="bg-main text-text-primary">
          <div className=" tab">
            <button
              onClick={() => {
                navigate(`/main/games`);
                setLoading(true);
              }}
              className={`${category === "games" && "active"} `}
            >
              Games
            </button>
            <button
              onClick={() => {
                navigate(`/main/movies`);
                setLoading(true);
              }}
              className={`${category === "movies" && "active"} `}
            >
              Movies
            </button>
          </div>
          <CardContainer
            header="library"
            userId={userId}
            media_type={category}
          ></CardContainer>
          <CardContainer
            header="wishlist"
            userId={userId}
            media_type={category}
          ></CardContainer>
          <CardContainer
            header="completed"
            userId={userId}
            media_type={category}
          ></CardContainer>
        </div>
      </div>
    </>
  );
}

export default App;
