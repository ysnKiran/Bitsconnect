import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faBell } from "@fortawesome/free-solid-svg-icons"; // Add faBell for the notification icon
import { useNavigate, useLocation } from "react-router-dom";
import "../views/styles.css";
import "../views/global.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/home") {
      const projectsSection = document.getElementById("projects-section");
      if (projectsSection) {
        projectsSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);
  
  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const Profile = () => {
    navigate("/profile");
  };

  const handleViewProjectsClick = () => {
    navigate("/home");
    setTimeout(() => {
      const projectsSection = document.getElementById("projects-section");
      if (projectsSection) {
        projectsSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 1000); // Adjust delay as needed
  };

  return (
    <nav
      id="navbar"
      className="navbar navbar-expand-lg navbar-dark"
      style={{ backgroundColor: "#130525" }}
    >
      <div className="container-fluid">
        <a className="navbar-brand" href="#" onClick={() => navigate("/home")}>
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
            <li className="nav-item dropdown">
              <button
                className="nav-link btn btn-primary dropdown-toggle mx-2"
                id="findTalentDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Find Talent
              </button>
              <ul
                className="dropdown-menu"
                aria-labelledby="findTalentDropdown"
              >
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => navigate("/create")}
                  >
                    Post a new project
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => navigate("/applications")}
                  >
                    Applications received
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => navigate("/my-projects")}
                  >
                    My Projects
                  </button>
                </li>
              </ul>
            </li>
            <li className="nav-item dropdown">
              <button
                className="nav-link btn btn-primary dropdown-toggle mx-2"
                id="findWorkDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Find Work
              </button>
              <ul className="dropdown-menu" aria-labelledby="findWorkDropdown">
                <li>
                  <button
                    className="dropdown-item"
                    onClick={handleViewProjectsClick}
                  >
                    View Projects
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => navigate("/applied-projects")}
                  >
                    Applied projects
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => navigate("/selected-projects")}
                  >
                    Selected projects
                  </button>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <button
                className="nav-link btn btn-primary mx-2"
                onClick={() => navigate("/messages")}
              >
                Messages
              </button>
            </li>
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
                className="nav-link btn btn-primary mx-2 rounded-circle profile-button"
                onClick={Profile}
              >
                <FontAwesomeIcon
                  icon={faUser}
                  style={{ width: "25px", height: "25px" }}
                />
              </button>
            </li>
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

export default Navbar;
