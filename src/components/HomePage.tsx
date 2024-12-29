import React from "react";

const HomePage: React.FC = () => {
  return (
    <div style={styles.container}>
      <h1>Home Page</h1>
      <p>Welcome back!</p>
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
    backgroundColor: "#e0ffe0",
  },
};

export default HomePage;
