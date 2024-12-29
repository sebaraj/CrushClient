import React from "react";

const SignUpPage: React.FC = () => {
  return (
    <div style={styles.container}>
      <h1>Sign Up Page</h1>
      <p>
        Please provide additional information to complete your registration.
      </p>
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
    backgroundColor: "#ffe0e0",
  },
};

export default SignUpPage;
