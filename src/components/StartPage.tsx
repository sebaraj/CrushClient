import React, { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

interface AuthResponse {
  jwtToken: string;
  isNewUser: boolean;
}

const StartPage: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleLoginSuccess = async (tokenResponse: any) => {
    console.log("Login Success:", tokenResponse);
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("https://yalecrush.com/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: tokenResponse.code }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            `Server responded with status ${response.status}`,
        );
      }

      const data: AuthResponse = await response.json();

      localStorage.setItem("jwtToken", data.jwtToken);
      localStorage.setItem("isNewUser", JSON.stringify(data.isNewUser));

      if (data.isNewUser) {
        navigate("/signup");
      } else {
        navigate("/home");
      }
    } catch (err: any) {
      console.error("Error during authentication:", err);
      setError(err.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginError = () => {
    console.error("Login Failed");
    setError("Google authentication failed. Please try again.");
  };

  const login = useGoogleLogin({
    onSuccess: handleLoginSuccess,
    onError: handleLoginError,
    flow: "auth-code",
    scope: "openid profile email",
  });

  const signup = useGoogleLogin({
    onSuccess: handleLoginSuccess,
    onError: handleLoginError,
    flow: "auth-code",
    scope: "openid profile email",
  });

  return (
    <div style={styles.container}>
      <h1>Welcome to YaleCrush</h1>
      {error && <p style={styles.error}>{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={styles.buttonContainer}>
          <button style={styles.button} onClick={() => login()}>
            Log In with Google
          </button>
          <button style={styles.button} onClick={() => signup()}>
            Sign Up with Google
          </button>
        </div>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#f5f5f5",
    padding: "20px",
    textAlign: "center",
  },
  buttonContainer: {
    display: "flex",
    gap: "20px",
    marginTop: "20px",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#4285F4",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background-color 0.3s ease",
  },
  error: {
    color: "red",
    marginTop: "10px",
  },
};

export default StartPage;
