import { useState } from "react";
import Home from "./pages/Home";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Dashboard from "./pages/Dashboard";

function App() {
  const [currentPage, setCurrentPage] = useState("home");

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <Home onNavigate={setCurrentPage} />;
      case "pricing":
        return <Pricing onNavigate={setCurrentPage} />;
      case "dashboard":
        return <Dashboard onNavigate={setCurrentPage} />;
      case "about":
        return <About onNavigate={setCurrentPage} />;
      case "contact":
        return <Contact onNavigate={setCurrentPage} />;
      case "privacy":
        return <PrivacyPolicy onNavigate={setCurrentPage} />;
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  return renderPage();
}

export default App;