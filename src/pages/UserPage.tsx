import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";
import { UserData } from "../interfaces/User";

const UserPage: React.FC = () => {
  const { token, email } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!email || !token) {
      navigate("/");
      return;
    }
    setLoading(true);

    fetch(`https://api.yalecrush.com/v1/user/${email}`, {
      method: "GET",
      headers: {
        Authorization: `Authorization ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to load user data");
        }
        return res.json();
      })
      .then((data: UserData) => {
        setUserData(data);
      })
      .catch((err: any) => {
        setError(err.message || "Error loading user data");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [email, token, navigate]);

  // Handle form changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, type, value } = e.target;

    if (type === "checkbox") {
      // Now we know 'e.target' is an HTMLInputElement
      const { checked } = e.target as HTMLInputElement;
      setUserData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          [name]: checked,
        };
      });
    } else {
      // For text/select/etc.
      setUserData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          [name]: value,
        };
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !token || !userData) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.yalecrush.com/v1/user/${email}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update user data");
      }
      const updated = await response.json();
      setUserData(updated);
      alert("User info updated successfully!");
    } catch (err: any) {
      setError(err.message || "Error updating user data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-2xl mx-auto p-4 mt-4 bg-white shadow-md rounded">
        <h1 className="text-2xl font-bold mb-4">User Page</h1>

        {loading && <p className="text-gray-600">Loading...</p>}
        {error && <p className="text-red-500 mb-2">{error}</p>}
        {!loading && userData && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Example fields */}
            <div>
              <label className="block font-semibold mb-1" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={userData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-2 py-1"
              />
            </div>

            <div>
              <label
                className="block font-semibold mb-1"
                htmlFor="residential_college"
              >
                Residential College
              </label>
              <input
                id="residential_college"
                name="residential_college"
                type="text"
                value={userData.residential_college || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-2 py-1"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1" htmlFor="notif_pref">
                Notifications
              </label>
              <input
                id="notif_pref"
                name="notif_pref"
                type="checkbox"
                checked={userData.notif_pref}
                onChange={handleChange}
                className="mr-2"
              />
              <span>Receive notifications?</span>
            </div>

            {/* TODO: */}

            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              disabled={loading}
            >
              Update
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserPage;
