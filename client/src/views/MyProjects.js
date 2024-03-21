import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { BsChevronLeft } from "react-icons/bs";
import '../views/applications.css';
import Navbar from "./NavbarHandlers.js";
import '../views/global.css';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const MyProjects = () => {
  const navigate = useNavigate();
  const id = localStorage.getItem("idToken");
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [projects, setProjects] = useState([]);
  
  useEffect(() => {
    getProjects();
  }, []);

  const getProjects = () => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/myProjects`, {
        headers: { authorization: `${id}` },
      })
      .then((response) => {
        setProjects(response.data);
        setLoadingProjects(false);
      })
      .catch((error) => {
        setLoadingProjects(false);
        if (error.response.status === 401) {
          localStorage.clear();
          navigate("/");
        }
        console.error("Error fetching projects:", error);
        toast.error('Error Fetching Projects', { position: "top-center", autoClose: 1000, hideProgressBar: true, closeOnClick: true, pauseOnHover: false, draggable: false, progress: undefined, theme: "dark" });
      });
  };

  const editProject = (projectId) => {
    setProjects(prevProjects => prevProjects.map(project => {
      if (project._id === projectId) {
        // Create a copy of the project to use for editing
        return { ...project, editing: !project.editing, originalProject: { ...project } };
      }
      return project;
    }));
  };
  
  const cancelEdit = (projectId) => {
    setProjects(prevProjects => prevProjects.map(project => {
      if (project._id === projectId) {
        // Revert changes by restoring the original project details
        return { ...project.originalProject, editing: false };
      }
      return project;
    }));
  };
  

  const saveChanges = (projectId) => {
    const updatedProject = projects.find(project => project._id === projectId);
    
    axios.put(`${process.env.REACT_APP_BACKEND_URL}/updateProject/${projectId}`, updatedProject, {
      headers: { authorization: `${id}` }
    })
    .then((response) => {
      // If update is successful, reset the editing state of the project
      setProjects(prevProjects => prevProjects.map(project => {
        if (project._id === projectId) {
          return { ...project, editing: false };
        }
        return project;
      }));
      toast.success('Project Updated Successfully', { position: "top-center", autoClose: 1000, hideProgressBar: true, closeOnClick: true, pauseOnHover: false, draggable: false, progress: undefined, theme: "dark" });
    })
    .catch(error => {
      console.error('Error updating project:', error);
      toast.error('Failed to update project', { position: "top-center", autoClose: 1000, hideProgressBar: true, closeOnClick: true, pauseOnHover: false, draggable: false, progress: undefined, theme: "dark" });
    });
  };
  

  const deleteProject = (projectId) => {
    axios
      .delete(`${process.env.REACT_APP_BACKEND_URL}/deleteProject/${projectId}`,
        { headers: { authorization: `${id}` } })
      .then((response) => {
        getProjects();
        toast.success('Successfully Deleted Project', { position: "top-center", autoClose: 1000, hideProgressBar: true, closeOnClick: true, pauseOnHover: false, draggable: false, progress: undefined, theme: "dark" });
      })
      .catch((error) => {
        toast.error('Oh ohhh. Sorry! ', { position: "top-center", autoClose: 1000, hideProgressBar: true, closeOnClick: true, pauseOnHover: false, draggable: false, progress: undefined, theme: "dark" });
      });
  };

  const handleTitleChange = (e, projectId) => {
    const newProjects = projects.map(project => {
      if (project._id === projectId) {
        return { ...project, title: e.target.value };
      }
      return project;
    });
    setProjects(newProjects);
  };

  const handleDescriptionChange = (e, projectId) => {
    const newProjects = projects.map(project => {
      if (project._id === projectId) {
        return { ...project, description: e.target.value };
      }
      return project;
    });
    setProjects(newProjects);
  };

  const handlePayChange = (e, projectId) => {
    const newProjects = projects.map(project => {
      if (project._id === projectId) {
        return { ...project, pay: e.target.value };
      }
      return project;
    });
    setProjects(newProjects);
  };

  const handleDurationChange = (e, projectId) => {
    const newProjects = projects.map(project => {
      if (project._id === projectId) {
        return { ...project, duration: e.target.value };
      }
      return project;
    });
    setProjects(newProjects);
  };

  const handleDeadlineChange = (e, projectId) => {
    const newProjects = projects.map(project => {
      if (project._id === projectId) {
        return { ...project, deadline: e.target.value };
      }
      return project;
    });
    setProjects(newProjects);
  };


  const goBack = () => {
    navigate("/home");
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div>
      <Navbar />
      <div className="apply-form3">
        <div className="d-flex justify-content-between align-items-left mb-3">
          <button className="btn btn-link" onClick={goBack}>
            <BsChevronLeft size={24} />
          </button>
        </div>
        <h1 className="with-margin1">My Projects</h1>
  
        {loadingProjects ? (
          <div className="text-center mt-4">
            <div className="spinner-border" style={{ width: '3rem', height: '3rem' }} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : projects.length > 0 ? (
          projects.map((project) => (
            <li key={project._id} className="project-item">
              <div className="project-item-content">
                {project.editing ? (
                  <>
                    <input type="text" value={project.title} onChange={(e) => handleTitleChange(e, project._id)} />
                    <textarea value={project.description} onChange={(e) => handleDescriptionChange(e, project._id)}></textarea>
                    <input type="text" value={project.pay} onChange={(e) => handlePayChange(e, project._id)} />
                    <input type="text" value={project.duration} onChange={(e) => handleDurationChange(e, project._id)} />
                    <input type="date" value={project.deadline} onChange={(e) => handleDeadlineChange(e, project._id)}
                        min={new Date().toISOString().split("T")[0]} />
                    {/* Render other editable fields */}
                  </>
                ) : (
                  <>
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <p><b>Pay</b>: {project.pay} &nbsp; <b>Duration</b>: {project.duration} weeks</p>
                    <p>Deadline: <b>{new Date(project.deadline).toLocaleDateString()}</b></p>
                    {/* Render other project details */}
                  </>
                )}
              </div>
              <div className="apply-btn-container">
                {project.editing ? (
                  <>
                    <button className="apply-btn1" onClick={() => saveChanges(project._id)}>Save</button>
                    <button className="apply-btn1" onClick={() => cancelEdit(project._id)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button className="apply-btn1" onClick={() => editProject(project._id)}>Edit</button>
                    <button className="apply-btn1" onClick={() => deleteProject(project._id)}>Delete</button>
                  </>
                )}
              </div>
            </li>
          ))
        ) : (
          <p>No projects found</p>
        )}
      </div>
    </div>
  );
  

  };

export default MyProjects;
