import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import "./index.css";
import App from "./App.jsx";
import SearchPage from "./components/SearchPage.jsx";
import LibraryPage from "./components/LibraryPage.jsx";
import WishlistPage from "./components/WishlistPage.jsx";
import GameInfoPage from "./components/GameInfoPage.jsx";
import LoginPage from "./components/LoginPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "search",
    element: <SearchPage />,
  },
  {
    path: "library",
    element: <LibraryPage />,
  },
  {
    path: "wishlist",
    element: <WishlistPage />,
  },
  {
    path: "gamecardpage",
    element: <GameInfoPage />,
  },
  {
    path: "main",
    element: <App />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
