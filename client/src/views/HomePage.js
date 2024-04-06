import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import "../views/HomePage.css";
import "../views/nav.css";
import Navbar from "./NavbarHandlers.js";
import "../views/global.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import { BsSliders } from "react-icons/bs";
import MultiRangeSlider, { ChangeResult } from "multi-range-slider-react";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";

function Home() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [copyProjects, setCopy] = useState([]);
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [searchQuery, setSearchQuery] = useState(""); // State to manage search query
  const id = localStorage.getItem("idToken");

  // Filter
  const [minPay, setMinPay] = useState(0);
  const [maxPay, setMaxPay] = useState(0);
  const [minDuration, setMinDuration] = useState(0);
  const [maxDuration, setMaxDuration] = useState(0);
  const [skills, setSkills] = useState([]);

  // Range Master

  const [mP, setmP] = useState(0);
  const [MP, setMP] = useState(0);
  const [mD, setmD] = useState(0);
  const [MD, setMD] = useState(0);
  const [selectedSkills, setSelSkills] = useState([]);

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
        console.log("Initial:", response.data);
        // Set Copy
        setCopy(response.data);
        console.log(response.data);
        setSearchQuery("");

        if (response.data.length > 0) {
          //Filter
          setMinPay(Math.min(...response.data.map((project) => project.pay)));
          setMaxPay(Math.max(...response.data.map((project) => project.pay)));
          setMinDuration(
            Math.min(...response.data.map((project) => project.duration))
          );
          setMaxDuration(
            Math.max(...response.data.map((project) => project.duration))
          );

          // Extract unique skills from the projects
          const allSkills = response.data.reduce((acc, project) => {
            project.skills.forEach((skill) => {
              if (!acc.includes(skill)) {
                acc.push(skill);
              }
            });
            return acc;
          }, []);

          // Map skills to options format
          const skillOptions = allSkills.map((skill) => ({
            value: skill,
            label: skill,
          }));
          setSkills(skillOptions);

          //Range Major
          setmP(minPay);
          setMP(Math.max(...response.data.map((project) => project.pay)));
          setmD(minDuration);
          setMD(Math.max(...response.data.map((project) => project.duration)));
        }

        setLoading(false); // Set loading to false when data is fetched
      })
      .catch((error) => {
        if (error.response.status === 401) {
          console.log("Unauth");
          toast.error("Logged Out", {
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
        toast.error("Error Fetching Projects", {
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

  // Search
  const handleChange = (target) => {
    console.log("Value entered, ", target);
    setSearchQuery(target);
    if (target === "") {
      // If search query is empty, reset to display all projects
      setCopy(projects);
    } else {
      // Otherwise, filter projects based on search query
      const filtered = projects.filter(
        (project) =>
          project.title.toLowerCase().includes(target.toLowerCase()) ||
          project.description.toLowerCase().includes(target.toLowerCase())
      );
      setCopy(filtered);
      console.log("Filtered: ", filtered);
    }
  };

  const StartFilter = () => {
    console.log(mP, MP, mD, MD, selectedSkills);

    axios
      .post(
        `${process.env.REACT_APP_BACKEND_URL}/filter`,
        {
          minPay: mP,
          maxPay: MP,
          minDuration: mD,
          maxDuration: MD,
          skills: selectedSkills,
        },
        {
          headers: {
            authorization: `${id}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data); // Logging the response data to console
        setProjects(response.data);
        console.log("Filtered:", response.data);

        // Set Copy
        setCopy(response.data);
        console.log(response.data);
        setSearchQuery("");
      })
      .catch((error) => {
        if (error.response.status === 401) {
          console.log("Unauth");
          toast.error("Logged Out", {
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
        console.error("Error fetching data:", error);

        toast.error("Error Fetching Data", {
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

  const scrollToProjects = () => {
    document
      .getElementById("projects-section")
      .scrollIntoView({ behavior: "smooth" });
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

  const handleSkillChange = (selectedOptions) => {
    // Updating the state variable with the selected skills
    setSelSkills(selectedOptions.map((option) => option.value));
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
          <div
            className="hero-heading"
            as="h1"
            style={{ fontFamily: "ClashDisplay-Variable" }}
          >
            <span style={{ fontWeight: 400 }}>UNLOCKING</span>
            <span style={{ display: "block", fontWeight: 600 }}>
              OPPORTUNITIES
            </span>
            <span style={{ fontWeight: 400 }}>BUILDING</span>
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
          <div
            className="spinner-border"
            style={{ width: "3rem", height: "3rem" }}
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div
          className="container mt-4 text-center"
          id="projects-section"
          style={{
            margin: "auto",
            maxWidth: "1200px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            className="projects-heading-container"
            style={{ padding: "40px" }}
          >
            <h1
              style={{
                fontWeight: 600,
                fontFamily: "ClashDisplay-Variable",
                fontSize: "60px",
              }}
            >
              PROJECTS
            </h1>

            {projects.length > 0 ? (
              <div>
                <div className="search-bar-container">
                  <div className="air3-input-group">
                    <span className="icon">
                      <FontAwesomeIcon icon={faSearch} />
                    </span>
                    <input
                      type="text"
                      placeholder="Search projects by title or description"
                      value={searchQuery}
                      onChange={(e) => handleChange(e.target.value)}
                    />
                    {searchQuery && (
                      <button
                        className="clear-btn6"
                        onClick={() => setSearchQuery("")}
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    )}
                  </div>

                  {/*Inside your component's JSX*/}
                  <button
                    type="button"
                    className="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                  >
                    <BsSliders /> {/* Use the imported icon component */}
                  </button>

                  <div
                    className="modal fade"
                    id="exampleModal"
                    tabindex="-1"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                  >
                    <div className="modal-dialog">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h1
                            className="modal-title fs-5"
                            id="exampleModalLabel"
                          >
                            Filter
                          </h1>
                          <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          >
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div className="modal-body">
                          <label htmlFor="pay">Pay:</label>
                          <div className="input-group mb-3">
                            {/* <span className="input-group-text" id="basic-addon1">{minPay}</span> */}
                            <MultiRangeSlider
                              min={minPay}
                              max={maxPay}
                              step={100}
                              minValue={mP}
                              maxValue={MP}
                              barInnerColor="#9e81ff"
                              style={{ width: "100%" }}
                              onInput={(e: ChangeResult) => {
                                setmP(e.minValue);
                                setMP(e.maxValue);
                              }}
                            ></MultiRangeSlider>

                            {/* <span className="input-group-text" id="basic-addon1">{maxPay}</span> */}
                          </div>

                          <hr />
                          <label htmlFor="duration">Duration:</label>
                          <div className="input-group mb-3">
                            {/* <span className="input-group-text" id="basic-addon1">{minDuration}</span> */}

                            <MultiRangeSlider
                              min={minDuration}
                              max={maxDuration}
                              step={5}
                              minValue={mD}
                              maxValue={MD}
                              style={{ width: "100%" }}
                              barInnerColor="#9e81ff"
                              onInput={(e: ChangeResult) => {
                                setmD(e.minValue);
                                setMD(e.maxValue);
                              }}
                            ></MultiRangeSlider>

                            {/* <span className="input-group-text" id="basic-addon1">{maxDuration}</span> */}
                          </div>

                          <hr />
                          <label htmlFor="skills">Skills:</label>
                          <Select
                            isMulti
                            name="skills"
                            options={skills}
                            onChange={handleSkillChange}
                          />
                        </div>
                        <div className="modal-footer">
                          <button
                            type="button"
                            className="btn btn-secondary"
                            data-bs-dismiss="modal"
                          >
                            Close
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={StartFilter}
                            data-bs-dismiss="modal"
                          >
                            Save changes
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div></div>
            )}
          </div>

          <div className="project-container">
            <ul className="project-list">
              {copyProjects.length > 0 ? (
                copyProjects.map((prj) => (
                  <li key={prj._id} className="project-item">
                    <div className="project-item-content">
                      <h3>{prj.title}</h3>
                      <p>{prj.description}</p>
                      <p>
                        <b>Pay</b>: {prj.pay} &nbsp; <b>Duration</b>:{" "}
                        {prj.duration} weeks
                      </p>
                      {prj.skills.length > 0 ? (
                        <div className="skills">
                          <ul className="list-inline">
                            {prj.skills.map((skill, index) => (
                              <li
                                key={index}
                                className="badge me-1"
                                style={{
                                  backgroundColor: "#F5F2F7",
                                  borderRadius: "160px",
                                  color: "#64556D",
                                  fontSize: "2rem",
                                  fontWeight: "lighter",
                                }}
                              >
                                {skill}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <p>No specific skill requirement</p>
                      )}
                      <p>
                        Owner: <b>{prj.alumni_name}</b> 
                      </p>
                      <p>
                      Id: {prj.alumni_email}
                      </p>
                      <p>
                        Deadline:{" "}
                        <b>{new Date(prj.deadline).toLocaleDateString()}</b>
                      </p>
                    </div>
                    <div className="apply-btn-container">
                      <button
                        className="apply-btn1"
                        onClick={() => apply(prj._id, prj.title)}
                      >
                        Apply
                      </button>
                    </div>
                  </li>
                ))
              ) : (
                <div className="alert alert-warning" role="alert">
                  No Projects Available
                </div>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
