import React, { useState } from "react";
import Navigation from "../components/Navigation";

const SearchPage: React.FC = () => {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: implement opensearch logic
    alert(`Searching for: ${query}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-4xl mx-auto p-4 mt-4">
        <h1 className="text-2xl font-bold mb-4">Search Users</h1>
        <form onSubmit={handleSearch} className="flex items-center space-x-2">
          <input
            type="text"
            className="border border-gray-300 rounded px-2 py-1"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter a name, college, interest, etc."
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            Search
          </button>
        </form>
      </div>
    </div>
  );
};

export default SearchPage;
