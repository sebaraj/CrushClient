import React, { useEffect, useState, ChangeEvent } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";
import { UserData } from "../interfaces/User";
import { allInterests } from "../data/interests";

const UserPage: React.FC = () => {
  const { token, email } = useAuth();
  const navigate = useNavigate();

  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const parseIncomingData = (data: any): UserData => {
    if (Array.isArray(data.interests)) {
      data.interest_1 = data.interests[0] ?? "";
      data.interest_2 = data.interests[1] ?? "";
      data.interest_3 = data.interests[2] ?? "";
      data.interest_4 = data.interests[3] ?? "";
      data.interest_5 = data.interests[4] ?? "";
      delete data.interests;
    }

    if (Array.isArray(data.answers)) {
      data.question1 = data.answers[0] ?? 3;
      data.question2 = data.answers[1] ?? 3;
      data.question3 = data.answers[2] ?? 3;
      data.question4 = data.answers[3] ?? 3;
      data.question5 = data.answers[4] ?? 3;
      data.question6 = data.answers[5] ?? 3;
      data.question7 = data.answers[6] ?? 3;
      data.question8 = data.answers[7] ?? 3;
      data.question9 = data.answers[8] ?? 3;
      data.question10 = data.answers[9] ?? 3;
      data.question11 = data.answers[10] ?? 3;
      data.question12 = data.answers[11] ?? 3;
      delete data.answers;
    }

    return data;
  };

  useEffect(() => {
    // if (!email || !token) {
    //   navigate("/");
    //   return;
    // }

    setLoading(true);
    fetch(`https://api.yalecrush.com/v1/user/info/${email}`, {
      method: "GET",
      headers: {
        Authorization: token || "",
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          console.log("Error data from user/info: ", errorData);
          // change to throw error
        }
        return res.json();
      })
      .then((data: UserData) => {
        const transformedData = parseIncomingData(data);
        setUserData(transformedData);
      })
      .catch((err: any) => {
        console.error("Fetch error for user info:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [email, token, navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    if (!userData) return;
    const { name, type, value } = e.target;

    setUserData((prev) => {
      if (!prev) return prev;

      if (type === "checkbox") {
        const { checked } = e.target as HTMLInputElement;
        return {
          ...prev,
          [name]: checked,
        };
      }

      if (name.startsWith("question")) {
        return {
          ...prev,
          [name]: parseInt(value, 10),
        };
      }

      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleUserInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !token || !userData) return;

    setLoading(true);
    setError(null);

    try {
      const clone = { ...userData } as any;
      delete clone.answers;
      delete clone.interests;
      delete clone.question1;
      delete clone.question2;
      delete clone.question3;
      delete clone.question4;
      delete clone.question5;
      delete clone.question6;
      delete clone.question7;
      delete clone.question8;
      delete clone.question9;
      delete clone.question10;
      delete clone.question11;
      delete clone.question12;

      const resp = await fetch(
        `https://api.yalecrush.com/v1/user/info/${email}`,
        {
          method: "PUT",
          headers: {
            Authorization: token || "",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(clone),
        },
      );

      if (!resp.ok) {
        const errorData = await resp.json();
        throw new Error(errorData.message || "Failed to update user data");
      }

      console.log("User info updated successfully");
    } catch (err: any) {
      setError(err.message || "Error updating user data");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswersSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !token || !userData) return;

    setLoading(true);
    setError(null);

    try {
      const {
        question1,
        question2,
        question3,
        question4,
        question5,
        question6,
        question7,
        question8,
        question9,
        question10,
        question11,
        question12,
      } = userData;

      const bodyObj = {
        question1: question1 ?? 3,
        question2: question2 ?? 3,
        question3: question3 ?? 3,
        question4: question4 ?? 3,
        question5: question5 ?? 3,
        question6: question6 ?? 3,
        question7: question7 ?? 3,
        question8: question8 ?? 3,
        question9: question9 ?? 3,
        question10: question10 ?? 3,
        question11: question11 ?? 3,
        question12: question12 ?? 3,
      };

      const resp = await fetch(
        `https://api.yalecrush.com/v1/user/answers/${email}`,
        {
          method: "PUT",
          headers: {
            Authorization: token || "",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bodyObj),
        },
      );

      if (!resp.ok) {
        const errorData = await resp.json();
        throw new Error(errorData.message || "Failed to update answers");
      }

      console.log("Answers updated successfully (no page refresh or alert)");
      // Not refreshing the page, not sending a notification or alert
    } catch (err: any) {
      setError(err.message || "Error updating answers");
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
    if (!selectedFile || !email || !token) return;
    setUploading(true);
    setUploadError(null);

    try {
      const presignedResp = await fetch(
        `https://api.yalecrush.com/v1/user/picture/${email}`,
        {
          method: "GET",
          headers: {
            Authorization: token || "",
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

      console.log("Profile picture uploaded successfully");
      setSelectedFile(null);
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

            <form onSubmit={handleUserInfoSubmit} className="space-y-4 mb-8">
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
                <select
                  id="residential_college"
                  name="residential_college"
                  value={userData.residential_college || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-2 py-1"
                >
                  <option value="">Select a Residential College</option>
                  <option value="Benjamin Franklin">Benjamin Franklin</option>
                  <option value="Berkeley">Berkeley</option>
                  <option value="Branford">Branford</option>
                  <option value="Davenport">Davenport</option>
                  <option value="Ezra Stiles">Ezra Stiles</option>
                  <option value="Grace Hopper">Grace Hopper</option>
                  <option value="Jonathan Edwards">Jonathan Edwards</option>
                  <option value="Morse">Morse</option>
                  <option value="Pauli Murray">Pauli Murray</option>
                  <option value="Pierson">Pierson</option>
                  <option value="Saybrook">Saybrook</option>
                  <option value="Silliman">Silliman</option>
                  <option value="Timothy Dwight">Timothy Dwight</option>
                  <option value="Trumbull">Trumbull</option>
                </select>
              </div>

              <div>
                <label
                  className="block font-semibold mb-1"
                  htmlFor="graduating_year"
                >
                  Graduating Year
                </label>
                <input
                  id="graduating_year"
                  name="graduating_year"
                  type="text"
                  value={userData.graduating_year || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-2 py-1"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1" htmlFor="gender">
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={userData.gender || 0}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-2 py-1"
                >
                  <option value="0">Select a Gender</option>
                  <option value="16">Cis-Female</option>
                  <option value="8">Trans-Female</option>
                  <option value="4">Cis-Male</option>
                  <option value="2">Trans-Male</option>
                  <option value="1">Non-binary</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1" htmlFor="instagram">
                  Instagram
                </label>
                <input
                  id="instagram"
                  name="instagram"
                  type="text"
                  value={userData.instagram}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-2 py-1"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1" htmlFor="snapchat">
                  Snapchat
                </label>
                <input
                  id="snapchat"
                  name="snapchat"
                  type="text"
                  value={userData.snapchat}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-2 py-1"
                />
              </div>

              <div>
                <label
                  className="block font-semibold mb-1"
                  htmlFor="phone_number"
                >
                  Phone Number
                </label>
                <input
                  id="phone_number"
                  name="phone_number"
                  type="text"
                  value={userData.phone_number}
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

              {[1, 2, 3, 4, 5].map((i) => {
                const fieldName = `interest_${i}` as keyof UserData;
                return (
                  <div key={i}>
                    <label
                      className="block font-semibold mb-1"
                      htmlFor={fieldName}
                    >
                      Interest {i}
                    </label>
                    <select
                      id={fieldName}
                      name={fieldName}
                      value={
                        typeof userData[fieldName] === "string"
                          ? (userData[fieldName] as string)
                          : ""
                      }
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="">Select an Interest</option>
                      {allInterests.map((interestItem) => (
                        <option key={interestItem} value={interestItem}>
                          {interestItem}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              })}

              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Update Basic Info
              </button>
            </form>

            <form onSubmit={handleAnswersSubmit} className="space-y-4 mb-8">
              <h2 className="text-xl font-semibold">Questions (1-5 scale)</h2>

              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((qNum) => {
                const fieldName = `question${qNum}` as keyof UserData;
                const val = userData[fieldName] ?? 1;

                return (
                  <div key={qNum}>
                    <label
                      className="block font-semibold mb-1"
                      htmlFor={fieldName}
                    >
                      Question {qNum}
                    </label>
                    <input
                      id={fieldName}
                      name={fieldName}
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      value={val}
                      onChange={handleChange}
                    />
                    <p>Current value: {val}</p>
                  </div>
                );
              })}

              <button
                type="submit"
                className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
              >
                Update Answers
              </button>
            </form>

            <div>
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
