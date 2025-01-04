import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navigation: React.FC = () => {
  const { logout } = useAuth();

  return (
    <nav className="w-full bg-blue-500 p-4 flex items-center justify-between">
      <div className="flex gap-4">
        <NavLink
          to="/user"
          className="text-white font-semibold hover:underline"
        >
          User
        </NavLink>
        <NavLink
          to="/pick-matches"
          className="text-white font-semibold hover:underline"
        >
          Pick Matches
        </NavLink>
        <NavLink
          to="/old-matches"
          className="text-white font-semibold hover:underline"
        >
          Old Matches
        </NavLink>
        <NavLink
          to="/search"
          className="text-white font-semibold hover:underline"
        >
          Search
        </NavLink>
      </div>
      <button
        onClick={logout}
        className="bg-white text-blue-500 px-3 py-1 rounded hover:bg-gray-200"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navigation;
