import "./App.css";
import SearchBar from "./components/Searchcomponent";
import CardContainer from "./components/CardContainer";

function App() {
  return (
    <>
      <div className="w-full flex justify-between p-4">
        <h1 className="text-4xl hover:cursor-pointer">Sharkny</h1>
        <SearchBar></SearchBar>
      </div>
      <hr />
      <CardContainer header="Library" />
      <CardContainer header="Wishlist" />
    </>
  );
}

export default App;
