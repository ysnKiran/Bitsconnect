import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faBell } from "@fortawesome/free-solid-svg-icons"; // Add faBell for the notification icon
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useLocation } from "react-router-dom";
import "../views/styles.css";
import "../views/global.css";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/dashboard") {
      const projectsSection = document.getElementById("projects-section");
      if (projectsSection) {
        projectsSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);
  
  const logout = () => {
    localStorage.clear();
    navigate("/admin-login");
  };


  return (
    <nav
      id="navbar"
      className="navbar navbar-expand-lg navbar-dark"
      style={{ backgroundColor: "#130525" }}
    >
      <div className="container-fluid">
        <a className="navbar-brand" href="#" onClick={() => navigate("/dashboard")}>
          <span
            style={{
              fontFamily: "Space Quest",
              fontStyle: "normal",
              fontWeight: 400,
              fontSize: "36px",
              lineHeight: "43px",
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              marginLeft: "20px", // Adjust margin-left as needed
            }}
          >
            BITSCONNECT...
          </span>
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            
            {/*
            <li className="nav-item">
              <button
                className="nav-link btn btn-primary mx-2 rounded-circle profile-button"
                onClick={Notifications}
              >
                <FontAwesomeIcon
                  icon={faBell}
                  style={{ width: "25px", height: "25px" }}
                />
              </button>
              </li>
             */}
            
            <li className="nav-item">
              <button
                className="nav-link btn btn-primary mx-2"
                onClick={logout}
              >
                Logout
              </button>
            </li>
            
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
