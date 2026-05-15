import NavBar from "./NavBar";
import Aside from "./Aside";
import FullCardContainer from "./FullCardContainer";
import { useLocation } from "react-router";

function LibraryPage() {
  const location = useLocation();
  const path = location.pathname.split("/");
  return (
    <>
      <NavBar></NavBar>
      <div className="h-full w-full grid grid-cols-[150px_minmax(200px,_1fr)]">
        <Aside className=""></Aside>
        <div>
          <FullCardContainer
            header={"library"}
            media_type={path[1]}
          ></FullCardContainer>
        </div>
      </div>
    </>
  );
}
export default LibraryPage;
