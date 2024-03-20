import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import '../views/HomePage.css';
import '../views/nav.css';
import Navbar from "./NavbarHandlers.js";
import '../views/global.css';
import {ToastContainer, toast} from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";


function Home() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true); // State to manage loading state
  const id = localStorage.getItem("idToken");

  useEffect(() => {
    // Fetch projects when the component mounts
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/projects`, {
        headers: {
          authorization: `${id}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        // Set the fetched projects to state
        setProjects(response.data);
        setLoading(false); // Set loading to false when data is fetched
      })
      .catch((error) => {
        if(error.response.status===401)
                {
                    console.log("Unauth")
                    toast.error('Logged Out', {
                      position: "top-center",
                      autoClose: 1000,
                      hideProgressBar: true,
                      closeOnClick: true,
                      pauseOnHover: false,
                      draggable: false,
                      progress: undefined,
                      theme: "dark",
                      });
                    localStorage.clear();
                    navigate("/");
                }
        console.error("Error fetching projects:", error);
        setLoading(false); // Set loading to false even if there's an error
        toast.error('Error Fetching Projects', {
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
  }, []);

  const scrollToProjects = () => {
    document.getElementById("projects-section").scrollIntoView({ behavior: "smooth" });
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const CreateOpening = () => {
    navigate("/create");
  };

  const apply = (id, title) => {
    console.log("Title clicked: ", title);
    // navigate to Apply page with Id as params
    navigate(`/apply/${id}/${title}`);
  };

  const ViewApplications = () => {
    console.log("View Applications clicked");
    navigate("/applications");
  };

  const ViewAppliedProjects = () => {
    console.log("View Applied Projects clicked");
    navigate("/applied-projects");
  };

  const ViewSelectedProjects = () => {
    console.log("View Selected Projects clicked");
    navigate("/selected-projects");
  };

  const Profile = () => {
    console.log("View Profile");
    navigate("/profile");
  };

  return (
    <div>
      <Navbar
        CreateOpening={CreateOpening}
        ViewApplications={ViewApplications}
        ViewAppliedProjects={ViewAppliedProjects}
        ViewSelectedProjects={ViewSelectedProjects}
        Profile={Profile}
        logout={logout}
      />
      <div className="hero-container">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-heading" as="h1" style={{ fontFamily: 'ClashDisplay-Variable'}}>
          <span style={{ fontWeight: 400 }}>UNLOCKING</span> 
          <span style={{ display: 'block' ,fontWeight: 600, }}>OPPORTUNITIES</span> 
          <span style={{fontWeight: 400 }}>BUILDING</span> 
          <span style={{ fontWeight: 600 }}> FUTURES</span>
       </div>
       {!loading && (
        <button onClick={scrollToProjects} className="view-projects-button">
          View Projects
        </button>
      )}
        </div>
      </div>

      {loading ? (
        <div className="text-center mt-4">
          <div className="spinner-border" style={{width: '3rem', height: '3rem'}} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="container mt-4 text-center" id="projects-section" style={{ margin: 'auto', maxWidth: '1200px' }}>
          <div className="projects-heading-container" style={{ padding: '40px' }}>
            <h1 style={{ fontWeight: 600, fontFamily: 'ClashDisplay-Variable', fontSize: '60px' }}>PROJECTS</h1>
          </div>
          <div className="project-container"> 
            <ul className="project-list">
              {projects.length > 0 ? (
                projects.map((prj) => (
                  <li key={prj._id} className="project-item">
                    <div className="project-item-content">
                      <h3>{prj.title}</h3>
                      <p>{prj.description}</p>
                      <p>
                        <b>Pay</b>: {prj.pay} &nbsp; <b>Duration</b>: {prj.duration} weeks
                      </p>
                      {prj.skills.length > 0 ? (
                        <div className="skills">
                          <ul className="list-inline">
                            {prj.skills.map((skill, index) => (
                              <li key={index} className="badge me-1" style={{ backgroundColor: '#F5F2F7', borderRadius: '160px', color:'#64556D', fontSize:'2rem', fontWeight:'lighter'}}>{skill}</li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <p>No specific skill requirement</p>
                      )}
                      <p>Owner: <b>{prj.alumni_name}</b> Id: {prj.alumni_email}</p>
                    </div>
                    <div className="apply-btn-container">
                      <button className="apply-btn1" onClick={() => apply(prj._id, prj.title)}>Apply</button>
                    </div>
                  </li>
                ))
              ) : (
                <div className="alert alert-warning" role="alert">No Projects Available</div>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
