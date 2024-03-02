import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { BsChevronLeft } from "react-icons/bs";
import '../views/applications.css';
import Navbar from "./NavbarHandlers.js";
import '../views/global.css';

const Applications = () => {
  const navigate = useNavigate();
  const id = localStorage.getItem("idToken");
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelProId] = useState();
  const [selectedProjectTitle, setSelPro] = useState();
  const [proposals, setProposals] = useState([]);
  const [selectedProposals, setSelectedProposals] = useState([]);

  useEffect(() => {
    axios
      .get("https://se-project-backend-fard.onrender.com/myProjects", {
        headers: {
          authorization: `${id}`,
        },
      })
      .then((response) => {
        setProjects(response.data);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          console.log("Unauth");
          localStorage.clear();
          navigate("/");
        }
        console.error("Error fetching projects:", error);
      });
  }, []);

  const goBack = () => {
    navigate("/home");
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const getApplications = (e) => {
    const project_id = e.currentTarget.value;
    setSelPro(e.currentTarget.title);
    setSelProId(project_id);
    const user_id = localStorage.getItem("idToken");

    axios
      .get(
        `https://se-project-backend-fard.onrender.com/getApplicationsByProject/${project_id}`,
        {
          headers: {
            authorization: `${user_id}`,
          },
        }
      )
      .then((response) => {
        setProposals(response.data);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          console.log("Unauth");
          localStorage.clear();
          navigate("/");
        }
        console.error("Error fetching projects:", error);
      });

    axios
      .get(
        `https://se-project-backend-fard.onrender.com/getSelectedApplicationsByProject/${project_id}`,
        {
          headers: {
            authorization: `${user_id}`,
          },
        }
      )
      .then((response) => {
        setSelectedProposals(response.data);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          console.log("Unauth");
          localStorage.clear();
          navigate("/");
        }
        console.error("Error fetching projects:", error);
      });
  };

  const SelectUser = (user_id) => {
    const id = localStorage.getItem("idToken");

    if (id) {
      axios
        .post(
          "https://se-project-backend-fard.onrender.com/applyUser",
          { user_id, project_id: selectedProjectId },
          {
            headers: {
              authorization: `${id}`,
            },
          }
        )
        .then((response) => {
          axios
            .get(
              `https://se-project-backend-fard.onrender.com/getApplicationsByProject/${selectedProjectId}`,
              {
                headers: {
                  authorization: `${id}`,
                },
              }
            )
            .then((response) => {
              setProposals(response.data);
            })
            .catch((error) => {
              console.error("Error fetching projects:", error);
            });

          axios
            .get(
              `https://se-project-backend-fard.onrender.com/getSelectedApplicationsByProject/${selectedProjectId}`,
              {
                headers: {
                  authorization: `${id}`,
                },
              }
            )
            .then((response) => {
              setSelectedProposals(response.data);
            })
            .catch((error) => {
              console.error("Error fetching projects:", error);
            });
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    } else {
      console.error("idToken is null or undefined");
    }
  };

  return (
    <div>
      <Navbar/>
    <div className="apply-form3">
      <div className="d-flex justify-content-between align-items-left mb-3">
        <button className="btn btn-link" onClick={goBack}>
          <BsChevronLeft size={24} />
        </button>
        {/* <button className="btn btn-danger" onClick={logout}>Logout</button> */}
      </div>
        <h1 className="with-margin1">Applications Page</h1>
      
      {projects.length > 0 ? (
        <div className="select-container">
          <div>
            <select className="form-select mt-3 custom-select" onClick={getApplications}>
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
              {selectedProposals.length > 0 ? (
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
              {proposals.length > 0 ? (
                <div>
                  {proposals.map((propo) => (
                    <div key={propo._id} className="card mb-2">
                      <div className="card-body">
                        <p>Name: {propo.name} </p>
                        <p>Email: {propo.email}</p>
                        <p>Graduation Year: {propo.batch_year}</p>
                        <p><button className="" onClick={() => window.open(propo.resume_link, '_blank')}>Resume</button></p>
                        <button className="btn btn-success" onClick={() => SelectUser(propo._id)}>Yes</button>
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
