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

const Applications = () => {
  const navigate = useNavigate();
  const id = localStorage.getItem("idToken");
  const [loadingProjects, setLoadingProjects] = useState(true); // State for loading projects
  const [loadingApplications, setLoadingApplications] = useState(false); // State for loading applications
  const [loadingSelectedApplications, setLoadingSelectedApplications] = useState(false); // State for loading selected applications
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelProId] = useState();
  const [selectedProjectTitle, setSelPro] = useState();
  const [proposals, setProposals] = useState([]);
  const [selectedProposals, setSelectedProposals] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/myProjects`, {
        headers: {
          authorization: `${id}`,
        },
      })
      .then((response) => {
        setProjects(response.data);
        if(response.data.length>0)
        {
          console.log("1:",response.data[0]);
          getApplications(response.data[0]._id);
        }
        setLoadingProjects(false); // Turn off loading spinner when projects are fetched
      })
      .catch((error) => {
        setLoadingProjects(false); // Turn off loading spinner in case of error
        if (error.response.status === 401) {
          console.log("Unauth");
          localStorage.clear();
          navigate("/");
        }
        console.error("Error fetching projects:", error);
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

  const goBack = () => {
    navigate("/home");
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const getApplications = (projectId) => {
    setLoadingApplications(true); // Turn on loading spinner for applications
    const user_id = localStorage.getItem("idToken");

    axios
      .get(
        `${process.env.REACT_APP_BACKEND_URL}/getApplicationsByProject/${projectId}`,
        {
          headers: {
            authorization: `${user_id}`,
          },
        }
      )
      .then((response) => {
        setProposals(response.data);
        setLoadingApplications(false); // Turn off loading spinner when applications are fetched
      })
      .catch((error) => {
        setLoadingApplications(false); // Turn off loading spinner in case of error
        if (error.response.status === 401) {
          console.log("Unauth");
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
        console.error("Error fetching Applications:", error);
        toast.error('Error Fetching Applications', {
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

    axios
      .get(
        `${process.env.REACT_APP_BACKEND_URL}/getSelectedApplicationsByProject/${projectId}`,
        {
          headers: {
            authorization: `${user_id}`,
          },
        }
      )
      .then((response) => {
        setSelectedProposals(response.data);
        setLoadingSelectedApplications(false); // Turn off loading spinner when selected applications are fetched
      })
      .catch((error) => {
        setLoadingSelectedApplications(false); // Turn off loading spinner in case of error
        if (error.response.status === 401) {
          console.log("Unauth");
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
        console.error("Error fetching Selected Applications:", error);
        toast.error('Error Fetching Selected Applications', {
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

  const SelectUser = (user_id) => {
    setLoadingSelectedApplications(true); // Turn on loading spinner for selected applications
    const id = localStorage.getItem("idToken");

    if (id) {
      axios
        .post(
          `${process.env.REACT_APP_BACKEND_URL}/applyUser`,
          { user_id, project_id: selectedProjectId },
          {
            headers: {
              authorization: `${id}`,
            },
          }
        )
        .then((response) => {
          getApplications(selectedProjectId);
          toast.success('Successfully Selected Application', {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            theme: "dark",
            });
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          toast.error('Retry', {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            theme: "dark",
            });
          setLoadingSelectedApplications(false); // Turn off loading spinner in case of error
        });
    } else {
      console.error("idToken is null or undefined");
      setLoadingSelectedApplications(false); // Turn off loading spinner in case of error
    }
  };

  const DeleteUser = (user_id) => {
    setLoadingApplications(true); // Turn on loading spinner for selected applications
    const id = localStorage.getItem("idToken");

    if (id) {
      axios
        .post(
          `${process.env.REACT_APP_BACKEND_URL}/rejectUser`,
          { user_id, project_id: selectedProjectId },
          {
            headers: {
              authorization: `${id}`,
            },
          }
        )
        .then((response) => {
          getApplications(selectedProjectId);
          toast.success('Successfully Rejected Application', {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            theme: "dark",
            });
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          toast.error('Retry', {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            theme: "dark",
            });
            setLoadingApplications(false); // Turn off loading spinner in case of error
        });
    } else {
      console.error("idToken is null or undefined");
      setLoadingApplications(false); // Turn off loading spinner in case of error
    }
  };

  return (
    <div>
      <Navbar />
      <div className="apply-form3">
        <div className="d-flex justify-content-between align-items-left mb-3">
          <button className="btn btn-link" onClick={goBack}>
            <BsChevronLeft size={24} />
          </button>
          {/* <button className="btn btn-danger" onClick={logout}>Logout</button> */}
        </div>
        <h1 className="with-margin1">Applications Page</h1>

        {loadingProjects ? (
          <div className="spinner-border" style={{ width: '3rem', height: '3rem' }} role="status">
            <span className="visually-hidden">Loading Projects...</span>
          </div>
        ) : projects.length > 0 ? (
          <div className="select-container">
            <div>
              <select className="form-select mt-3 custom-select" onChange={(e) => getApplications(e.target.value)}>
                {projects.map((prj) => (
                  <option value={prj._id} key={prj._id} title={prj.title}>
                    {prj.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <h2>{selectedProjectTitle}</h2>
              <div className="sel">
                <h3>Selected Proposals</h3>
                {loadingSelectedApplications ? (
                  <div className="spinner-border" style={{ width: '3rem', height: '3rem' }} role="status">
                    <span className="visually-hidden">Loading Selected Applications...</span>
                  </div>
                ) : selectedProposals.length > 0 ? (
                  <div>
                    {selectedProposals.map((selProp) => (
                      <div key={selProp._id} className="card mb-2">
                        <div className="card-body">
                          <p>Name: {selProp.name}</p>
                          <p>Email: {selProp.email}</p>
                          <p>Graduation Year: {selProp.batch_year}</p>
                          <p><button className="" onClick={() => window.open(selProp.resume_link, '_blank')}>Resume</button></p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="c">No Selected Applications Found</p>
                )}
              </div>
              <div className="sel">
                <h3>Active Applications</h3>
                {loadingApplications ? (
                  <div className="spinner-border" style={{ width: '3rem', height: '3rem' }} role="status">
                    <span className="visually-hidden">Loading Applications...</span>
                  </div>
                ) : proposals.length > 0 ? (
                  <div>
                    {proposals.map((propo) => (
                      <div key={propo._id} className="card mb-2">
                        <div className="card-body">
                          <p>Name: {propo.name} </p>
                          <p>Email: {propo.email}</p>
                          <p>Graduation Year: {propo.batch_year}</p>
                          <p><button className="" onClick={() => window.open(propo.resume_link, '_blank')}>Resume</button></p>
                          <button className="btn btn-success" onClick={() => SelectUser(propo._id)}>Select</button>
                          <button className="btn btn-error" onClick={() => DeleteUser(propo._id)}>Reject</button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="c">No Applications Found</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <p>No projects found</p>
        )}
      </div>
    </div>
  );
};

export default Applications;
