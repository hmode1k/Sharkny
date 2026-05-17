import NavBar from "./NavBar";
import FullCardContainer from "./FullCardContainer";
import { useLocation } from "react-router";
import AsideWrapper from "./AsideWrapper";

function WishlistPage() {
  const location = useLocation();
  const path = location.pathname.split("/");
  return (
    <>
      <NavBar></NavBar>
      <div className="h-full w-full sm:grid sm:grid-cols-[150px_minmax(200px,_1fr)]">
        <AsideWrapper></AsideWrapper>
        <div>
          <FullCardContainer
            key={path[1]}
            header={"wishlist"}
            media_type={path[1]}
          ></FullCardContainer>
        </div>
      </div>
    </>
  );
}
export default WishlistPage;
