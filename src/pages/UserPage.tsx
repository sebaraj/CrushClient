import React, { useEffect, useState, ChangeEvent } from "react";
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, type, value } = e.target;

    if (type === "checkbox") {
      const { checked } = e.target as HTMLInputElement;
      setUserData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          [name]: checked,
        };
      });
    } else {
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

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setUploadError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setUploadError(null);

    try {
      const presignedResp = await fetch(
        "https://api.yalecrush.com/v1/user/search",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!presignedResp.ok) {
        throw new Error("Failed to get presigned URL");
      }

      const { url } = await presignedResp.json();
      if (!url) {
        throw new Error("No presigned URL found in response");
      }

      const uploadResp = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": selectedFile.type,
        },
        body: selectedFile,
      });

      if (!uploadResp.ok) {
        throw new Error("Failed to upload file to S3");
      }

      const newS3Link = url.split("?")[0];

      const updateResponse = await fetch(
        `https://api.yalecrush.com/v1/user/${email}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...userData,
            picture_s3_url: newS3Link,
          }),
        },
      );

      if (!updateResponse.ok) {
        throw new Error("Failed to update user's S3 URL");
      }

      const updatedUserData = await updateResponse.json();
      setUserData(updatedUserData);
      setSelectedFile(null);
      alert("Profile picture updated successfully!");
    } catch (err: any) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const profileImageUrl = userData?.picture_s3_url
    ? userData.picture_s3_url
    : "https://via.placeholder.com/150?text=No+Image";

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-2xl mx-auto p-4 mt-4 bg-white shadow-md rounded">
        <h1 className="text-2xl font-bold mb-4">User Page</h1>

        {loading && <p className="text-gray-600">Loading...</p>}
        {error && <p className="text-red-500 mb-2">{error}</p>}
        {!loading && userData && (
          <>
            <div className="flex flex-col items-center mb-6">
              <img
                src={profileImageUrl}
                alt="Profile"
                className="w-32 h-32 object-cover rounded-full border border-gray-300"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://via.placeholder.com/150?text=No+Image";
                }}
              />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
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

              {/* TODO: get pictures (s3 website bucket or adjacent bucket to user images) */}
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
                <label
                  className="block font-semibold mb-1"
                  htmlFor="notif_pref"
                >
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

              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                disabled={loading}
              >
                Update
              </button>
            </form>

            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-2">
                Change Profile Image
              </h2>
              <input type="file" onChange={handleFileChange} accept="image/*" />
              {selectedFile && (
                <p className="mt-2 text-gray-600">
                  Ready to upload: {selectedFile.name}
                </p>
              )}
              {uploadError && <p className="text-red-500">{uploadError}</p>}

              <button
                onClick={handleUpload}
                className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                disabled={!selectedFile || uploading}
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserPage;
