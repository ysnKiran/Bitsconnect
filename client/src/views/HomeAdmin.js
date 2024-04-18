import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import "../views/HomePage.css";
import "../views/nav.css";
import Navbar from "./AdminNavbar.js";
import "../views/global.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import { BsSliders } from "react-icons/bs";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";

const HomeAdmin = () => {
  const navigate = useNavigate();
  const id = localStorage.getItem("idToken");
  const [reports, setReports] = useState([]);

  const [loading, setLoading] = useState(true); // State for loading projects

  const goBack = () => {
    navigate("/home");
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };
  useEffect(() => {
    displayDetails();
  }, []);

  const displayDetails = () => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/reviews`, {
        headers: {
          authorization: `${id}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setReports(response.data);
        setLoading(false); // Turn off loading spinner when projects are fetched
      })
      .catch((error) => {
        setLoading(false); // Turn off loading spinner in case of error
        if (error.response.status === 401) {
          console.log("Unauth");
          localStorage.clear();
          navigate("/");
        }
        console.error("Error fetching projects:", error);
      });
  };

  const DonzoReport = (prj_id) => {
    // For Reporting ki dekhliya bhai
    
    axios
      .put(
        `${process.env.REACT_APP_BACKEND_URL}/reviews/${prj_id}/complete`,
        {
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          mode: "cors",
        }
      )
      .then((response) => {
        displayDetails();
        console.log("Donzo");
      })
      .catch((error) => {
        console.error("Error sending user data to backend:", error);
        toast.error('Error', {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: "dark",
          });
      });
    
  };

  return (
    <div>
      <Navbar />
      <div className="apply-form3">
        <h1 className="with-margin1">Your Pending Applications</h1>

        <div className="size2">
          {loading ? ( // Render spinner while loading is true
            <div className="spinner-container">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="project-container3">
              <ul className="project-list3">
                {reports.length > 0 ? (
                  reports.map((prj) => (
                    <div key={prj._id} className="project-item4">
                      <div className="project-item-content3">
                        <h5 style={{ fontSize: "1.2rem" }}>{prj.report}</h5>
                        <p style={{ fontSize: "1.2rem" }}>
                          <b>By</b>:{prj.user_name}
                          
                        </p>
                      </div>
                      <div className="project-actions">
                        {/* Add Donzo button */}
                        <button
                          className="apply-btn1"
                          onClick={() => DonzoReport(prj._id)}
                        >
                          Donzo
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>
                    Yayyy! No more naggers :)
                  </p>
                )}
              </ul>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default HomeAdmin;
