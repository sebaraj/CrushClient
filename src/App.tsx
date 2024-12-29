import { Routes, Route } from "react-router-dom";
import StartPage from "./components/StartPage";
import HomePage from "./components/HomePage";
import SignUpPage from "./components/SignUpPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<StartPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/signup" element={<SignUpPage />} />
    </Routes>
  );
}

export default App;
