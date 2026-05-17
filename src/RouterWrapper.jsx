import { useEffect, useState } from "react";
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
import FullPage from "./components/FullPage.jsx";
import RequestsPage from "./components/RequestsPage.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import { supabase } from "./supabase-client.js";

function RouterWrapper() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <LoginPage />,
    },
    {
      path: "/search/games",
      element: (
        <ProtectedRoute user={user}>
          <SearchPage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/search/movies",
      element: (
        <ProtectedRoute user={user}>
          <SearchPage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/games",
      element: (
        <ProtectedRoute user={user}>
          <FullPage key="games" />
        </ProtectedRoute>
      ),
    },
    {
      path: "/games/library",
      element: (
        <ProtectedRoute user={user}>
          <LibraryPage key="games-library" />
        </ProtectedRoute>
      ),
    },
    {
      path: "/games/wishlist",
      element: (
        <ProtectedRoute user={user}>
          <WishlistPage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/games/completed",
      element: (
        <ProtectedRoute user={user}>
          <PlayedPage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/movies",
      element: (
        <ProtectedRoute user={user}>
          <FullPage key="movies" />
        </ProtectedRoute>
      ),
    },
    {
      path: "/movies/library",
      element: (
        <ProtectedRoute user={user}>
          <LibraryPage key="movies-library" />
        </ProtectedRoute>
      ),
    },
    {
      path: "/movies/wishlist",
      element: (
        <ProtectedRoute user={user}>
          <WishlistPage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/movies/completed",
      element: (
        <ProtectedRoute user={user}>
          <PlayedPage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/games/:id",
      element: (
        <ProtectedRoute user={user}>
          <GameInfoPage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/tv/:id",
      element: (
        <ProtectedRoute user={user}>
          <MovieInfoPage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/movie/:id",
      element: (
        <ProtectedRoute user={user}>
          <MovieInfoPage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/main",
      element: <Navigate to="/main/games" replace />,
    },
    {
      path: "/main/:category",
      element: (
        <ProtectedRoute user={user}>
          <App />
        </ProtectedRoute>
      ),
    },
    {
      path: "/profile/",
      element: (
        <ProtectedRoute user={user}>
          <Profile />
        </ProtectedRoute>
      ),
    },
    {
      path: "/profile/:id",
      element: (
        <ProtectedRoute user={user}>
          <Profile />
        </ProtectedRoute>
      ),
    },
    {
      path: "/profile/:id/:media_type",
      element: (
        <ProtectedRoute user={user}>
          <Profile />
        </ProtectedRoute>
      ),
    },
    {
      path: "/profile/:id/:media_type/:category",
      element: (
        <ProtectedRoute user={user}>
          <Profile />
        </ProtectedRoute>
      ),
    },
    {
      path: "/friends",
      element: (
        <ProtectedRoute user={user}>
          <FriendsPage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/requests",
      element: (
        <ProtectedRoute user={user}>
          <RequestsPage />
        </ProtectedRoute>
      ),
    },
  ]);

  if (loading) return <div>Loading...</div>;

  return <RouterProvider router={router} />;
}

export default RouterWrapper;
