import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
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
import MovieInfoPage from "./components/MovieInfoPage.jsx";

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
    path: "/games/library",
    element: <LibraryPage />,
  },
  {
    path: "/games/wishlist",
    element: <WishlistPage />,
  },
  {
    path: "/games/completed",
    element: <PlayedPage />,
  },
  {
    path: "/movies/library",
    element: <LibraryPage />,
  },
  {
    path: "/movies/wishlist",
    element: <WishlistPage />,
  },
  {
    path: "/movies/completed",
    element: <PlayedPage />,
  },
  {
    path: "game/:id",
    element: <GameInfoPage />,
  },
  {
    path: "tv/:id",
    element: <MovieInfoPage />,
  },
  {
    path: "movie/:id",
    element: <MovieInfoPage />,
  },
  {
    path: "main",
    element: <Navigate to="/main/games" replcae />,
  },
  {
    path: "main/:category",
    element: <App />,
  },
  {
    path: "profile/games",
    element: <Profile />,
  },
  {
    path: "profile",
    element: <Profile />,
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
    path: "profile/:id/games/library",
    element: <Profile />,
  },
  {
    path: "profile/:id/games/wishlist",
    element: <Profile />,
  },
  {
    path: "profile/:id/games/played",
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
