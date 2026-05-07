import "./App.css";
import SearchBar from "./components/Searchcomponent";

function App() {
  return (
    <>
      <div className="w-full flex justify-between p-4">
        <h1 className="text-4xl hover:cursor-pointer">Sharkny</h1>
        <SearchBar></SearchBar>
      </div>
      <hr />
    </>
  );
}

export default App;
