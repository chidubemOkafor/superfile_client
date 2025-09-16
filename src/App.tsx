import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProcessFile from "./pages/ProcessFile";
import Auth from "./pages/Auth";
import { Toaster } from 'sonner'
import useHandleTheme from "./hooks/useHandleTheme";
import './App.css'

function App() {
  const { theme } = useHandleTheme();
  
  return (
    <Router>
      <Toaster />
      <div className={`min-h-screen relative ${theme === "dark" ? "bg-[#0f172a]" : "bg-white"}`}>
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
