import "./App.css";
import Aside from "./components/Aside";
import NavBar from "./components/NavBar";
import CardContainer from "./components/CardContainer";

function App() {
  return (
    <>
      <NavBar></NavBar>
      <div className="h-full w-full grid grid-cols-[150px_minmax(200px,_1fr)]">
        <Aside className=""></Aside>
        <div>
          <CardContainer header="library"></CardContainer>
          <CardContainer header="wishlist"></CardContainer>
        </div>
      </div>
    </>
  );
}

export default App;
