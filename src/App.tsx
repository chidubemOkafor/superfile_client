import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProcessFile from "./pages/ProcessFile";
import Auth from "./pages/Auth";
import { useThemeStore } from "./stores/useThemeStore";
import './App.css'

function App() {
  const { theme } = useThemeStore();

  return (
    <Router>
      <div className={`min-h-screen relative ${theme === "dark" ? "bg-[#0f172a]" : "bg-white"}`}>
        {/* film grain overlay */}
        <div className="bg-grain"></div>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/process-file" element={<ProcessFile />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </div>
    </Router>
  );
}


export default App;
