import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../contexts/AuthContext";

interface AuthResponse {
  email: string;
  active: boolean;
}

const StartPage: React.FC = () => {
  const navigate = useNavigate();
  const { setAuthInfo } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleLoginSuccess = async (tokenResponse: any) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("https://api.yalecrush.com/v1/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: tokenResponse.credential }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            `Server responded with status ${response.status}`,
        );
      }

      const data: AuthResponse = await response.json();
      const { active, email } = data;
      console.log(data);
      setAuthInfo(
        tokenResponse.credential,
        email,
        // extractEmailFromToken(tokenResponse.credential),
      );

      if (!active) {
        navigate("/signup");
      } else {
        navigate("/user");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginError = () => {
    setError("Google authentication failed. Please try again.");
  };

  // const extractEmailFromToken = (idToken: string): string => {
  // // TODO: parse token to get email
  // console.log(idToken);
  // return "bryan.sebaraj@yale.edu";
  // };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-6 text-center">
      <h1 className="text-3xl font-bold text-gray-800">Welcome to YaleCrush</h1>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {loading ? (
        <p className="text-lg text-gray-600 mt-4">Loading...</p>
      ) : (
        <div className="mt-6 space-y-4">
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={handleLoginError}
          />
        </div>
      )}
    </div>
  );
};

export default StartPage;
