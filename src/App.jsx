import "./App.css";
import NavBar from "./components/NavBar";
import CardContainer from "./components/CardContainer";
import { supabase } from "./supabase-client";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import AsideWrapper from "./components/AsideWrapper";
import { useAuth } from "./AuthContext";

function App() {
  const navigate = useNavigate();
  const { category } = useParams();
  const { user, setUserId } = useAuth();

  useEffect(() => {
    const fetchId = async () => {
      const { error, data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        console.error(error);
      }
      setUserId(data[0].id);
      console.log("fetching ", data);
    };

    fetchId();
  }, [user, setUserId]);

  return (
    <>
      <NavBar></NavBar>
      <div className="h-full w-full sm:grid sm:grid-cols-[150px_minmax(200px,_1fr)]">
        <AsideWrapper></AsideWrapper>
        <div className="bg-main text-text-primary">
          <div className=" tab">
            <button
              onClick={() => {
                navigate(`/main/games`);
              }}
              className={`${category === "games" && "active"} `}
            >
              Games
            </button>
            <button
              onClick={() => {
                navigate(`/main/movies`);
              }}
              className={`${category === "movies" && "active"} `}
            >
              Movies
            </button>
          </div>
          <CardContainer header="library" media_type={category}></CardContainer>
          <CardContainer
            header="wishlist"
            media_type={category}
          ></CardContainer>
          <CardContainer
            header="completed"
            media_type={category}
          ></CardContainer>
        </div>
      </div>
    </>
  );
}

export default App;
