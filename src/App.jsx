import "./App.css";
import { TopBanner } from "./components/AdBanner";
import { AdBannerNative } from "./components/AdBannerNative"
import { AdSocialBar } from "./components/AdSocialBar"
import NavBar from "./components/NavBar";
import CardContainer from "./components/CardContainer";
import { useNavigate, useParams } from "react-router";
import AsideWrapper from "./components/AsideWrapper";

function App() {
  const navigate = useNavigate();
  const { category } = useParams();

  return (
    <>
      <NavBar></NavBar>
      <TopBanner></TopBanner>
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
          <AdBannerNative></AdBannerNative>
          <CardContainer
            header="wishlist"
            media_type={category}
          ></CardContainer>
          <AdBannerNative></AdBannerNative>

          <CardContainer
            header="completed"
            media_type={category}
          ></CardContainer>
          <AdBannerNative></AdBannerNative>

        </div>
      </div>
      <TopBanner></TopBanner>
      <AdSocialBar></AdSocialBar>
    </>
  );
}

export default App;
