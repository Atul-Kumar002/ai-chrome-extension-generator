import { useState } from "react";
import "../styles/navbar.css";

function Navbar({ onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavigation = (page) => {
    if (onNavigate) {
      onNavigate(page);
    }
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand" onClick={() => handleNavigation("home")}>
          <span className="navbar-logo">✨</span>
          <h2 className="navbar-title">Extensio.ai</h2>
        </div>
        
        <div className={`navbar-menu ${menuOpen ? "active" : ""}`}>
          <button className="nav-link" onClick={() => handleNavigation("home")}>Home</button>
          <button className="nav-link" onClick={() => handleNavigation("pricing")}>Pricing</button>
          <button className="nav-link" onClick={() => handleNavigation("dashboard")}>Dashboard</button>
          <button className="nav-link" onClick={() => handleNavigation("about")}>About Us</button>
          <button className="nav-link" onClick={() => handleNavigation("contact")}>Contact Us</button>
          <button className="nav-link" onClick={() => handleNavigation("privacy")}>Privacy Policy</button>
        </div>

        <button 
          className="hamburger-menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      <p className="navbar-subtitle">No-Code Chrome Extension Generator</p>
    </nav>
  );
}

export default Navbar;