import NavBar from "./NavBar";
import Aside from "./Aside";
import FullCardContainer from "./FullCardContainer";

function WishlistPage() {
  return (
    <>
      <NavBar></NavBar>
      <div className="h-full w-full grid grid-cols-[150px_minmax(200px,_1fr)]">
        <Aside className=""></Aside>
        <div>
          <FullCardContainer header={"wishlist"}></FullCardContainer>
        </div>
      </div>
    </>
  );
}
export default WishlistPage;
