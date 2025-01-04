import React from "react";
import Navigation from "../components/Navigation";

const PickMatchesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-4xl mx-auto p-4 mt-4">
        <h1 className="text-2xl font-bold mb-4">Pick Matches for This Week</h1>
        <p className="text-gray-700">
          {/* TODO: */}
          Here you can view and pick your matches for the week.
        </p>
      </div>
    </div>
  );
};

export default PickMatchesPage;
