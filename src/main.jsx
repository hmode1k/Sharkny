import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import "./index.css";
import App from "./App.jsx";
import SearchPage from "./components/SearchPage.jsx";
import LibraryPage from "./components/LibraryPage.jsx";
import WishlistPage from "./components/WishlistPage.jsx";
import GameInfoPage from "./components/GameInfoPage.jsx";
import PlayedPage from "./components/PlayedPage.jsx";
import LoginPage from "./components/LoginPage.jsx";
import Profile from "./components/Profile.jsx";
import FriendsPage from "./components/FriendsPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "search/games",
    element: <SearchPage />,
  },
  {
    path: "search/movies",
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
    path: "played",
    element: <PlayedPage />,
  },
  {
    path: "game/:id",
    element: <GameInfoPage />,
  },
  {
    path: "main",
    element: <App />,
  },
  {
    path: "profile",
    element: <Profile />,
  },
  {
    path: "profile/:id",
    element: <Profile />,
  },
  {
    path: "profile/:id/library",
    element: <Profile />,
  },
  {
    path: "profile/:id/wishlist",
    element: <Profile />,
  },
  {
    path: "profile/:id/played",
    element: <Profile />,
  },
  {
    path: "friends",
    element: <FriendsPage />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
