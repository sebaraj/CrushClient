import { Routes, Route } from "react-router-dom";
import StartPage from "./pages/StartPage";
import SignUpPage from "./pages/SignUpPage";

import UserPage from "./pages/UserPage";
import PickMatchesPage from "./pages/PickMatchesPage";
import OldMatchesPage from "./pages/OldMatchesPage";
import SearchPage from "./pages/SearchPage";

import ProtectedRoute from "./ProtectedRoute";
import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<StartPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* Protected Routes */}
        <Route
          path="/user"
          element={
            <ProtectedRoute>
              <UserPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pick-matches"
          element={
            <ProtectedRoute>
              <PickMatchesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/old-matches"
          element={
            <ProtectedRoute>
              <OldMatchesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <SearchPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </GoogleOAuthProvider>
  );
}

export default App;
