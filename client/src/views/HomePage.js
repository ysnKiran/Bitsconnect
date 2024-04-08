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
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";

function Home() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [copyProjects, setCopy] = useState([]);
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [searchQuery, setSearchQuery] = useState(""); // State to manage search query
  const id = localStorage.getItem("idToken");

  // Filter
  const [payRanges, setPayRanges] = useState([
    { label: "Below Rs.5000", value: "below_5000" },
    { label: "Rs.5000 - Rs.10000", value: "5000_10000" },
    { label: "Rs.10000 - Rs.50000", value: "10000-50000" },
    { label: "Above Rs.50000", value: "above_50000" },
  ]);
  const [selectedPayRanges, setSelectedPayRanges] = useState([]);
  const [durationRanges, setDurationRanges] = useState([
    { label: "Below 2 weeks", value: "below_2" },
    { label: "2 - 4 weeks", value: "2_4" },
    { label: "4 - 8 weeks", value: "4_8" },
    { label: "Above 8 weeks", value: "above_8" },
  ]);
  const [selectedDurationRanges, setSelectedDurationRanges] = useState([]);
  const [skills, setSkills] = useState([]);

  // Range Master
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
    console.log(
      "Filter Criteria:",
      selectedPayRanges,
      selectedDurationRanges,
      selectedSkills
    );

    // Prepare filter options
    const filterOptions = {
      minPay: selectedPayRanges.includes("below_5000")
        ? 0
        : selectedPayRanges.includes("5000_10000")
        ? 5000
        : selectedPayRanges.includes("10000_50000")
        ? 10000
        : selectedPayRanges.includes("above_50000")
        ? 50000
        : 0,
      maxPay: selectedPayRanges.includes("above_50000")
        ? 10000000
        : selectedPayRanges.includes("10000_50000")
        ? 50000
        : selectedPayRanges.includes("5000_10000")
        ? 10000
        : selectedPayRanges.includes("below_5000")
        ? 5000
        : 10000000,
      minDuration: selectedDurationRanges.includes("below_2")
        ? 0
        : selectedDurationRanges.includes("2_4")
        ? 2
        : selectedDurationRanges.includes("4_8")
        ? 4
        : selectedDurationRanges.includes("above_8")
        ? 8
        : 0,
      maxDuration: selectedDurationRanges.includes("above_8")
        ? 10000000
        : selectedDurationRanges.includes("4_8")
        ? 8
        : selectedDurationRanges.includes("2_4")
        ? 4
        : selectedDurationRanges.includes("below_2")
        ? 2
        : 10000000,
      skills: selectedSkills,
    };

    console.log("Filter Options:", filterOptions);

    // Make a POST request to backend endpoint to filter projects
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/filter`, filterOptions, {
        headers: {
          authorization: `${id}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("Filter response", response.data);
        // Set the filtered projects to state
        setProjects(response.data);
        setCopy(response.data);
        setSearchQuery("");
      })
      .catch((error) => {
        console.error("Error filtering projects:", error);
        toast.error("Error Filtering Projects", {
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

  const handlePayRangeChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedPayRanges([...selectedPayRanges, value]);
    } else {
      setSelectedPayRanges(
        selectedPayRanges.filter((range) => range !== value)
      );
    }
  };

  const handleDurationRangeChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedDurationRanges([...selectedDurationRanges, value]);
    } else {
      setSelectedDurationRanges(
        selectedDurationRanges.filter((range) => range !== value)
      );
    }
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
                    onClick={() => {
                      setSearchQuery("");
                      setCopy(projects);
                    }}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                )}
              </div>
              {/*Inside your component's JSX*/}
              <button
                type="button"
                className="filter-btn"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
              >
                <BsSliders /> {/* Use the imported icon component */}
              </button>

              <div
                className="modal fade"
                id="exampleModal"
                tabIndex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
              >
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h1 className="modal-title fs-5" id="exampleModalLabel">
                        Filter
                      </h1>

                      <button
                        type="button"
                        className="modal-close-btn"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>
                    <div className="modal-body">
                      <label htmlFor="pay">Pay:</label>
                      {payRanges.map((range) => (
                        <div key={range.value} className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value={range.value}
                            id={range.value}
                            onChange={handlePayRangeChange}
                          />
                          <label
                            className="form-check-label"
                            htmlFor={range.value}
                          >
                            {range.label}
                          </label>
                        </div>
                      ))}
                      <br />
                      <label htmlFor="duration">Duration:</label>
                      {durationRanges.map((range) => (
                        <div key={range.value} className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value={range.value}
                            id={range.value}
                            onChange={handleDurationRangeChange}
                          />
                          <label
                            className="form-check-label"
                            htmlFor={range.value}
                          >
                            {range.label}
                          </label>
                        </div>
                      ))}
                      <br />
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
                        className="modal-save-btn"
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
          <div className="project-container">
            <ul className="project-list">
              {copyProjects.length > 0 ? (
                copyProjects.map((prj) => (
                  <li key={prj._id} className="project-item">
                    <div className="project-item-content">
                      <h3>{prj.title}</h3>
                      <p>{prj.description}</p>
                      <p>
                        Pay:<b> Rs.{prj.pay}</b> &nbsp; Duration:{" "}
                        <b>{prj.duration} weeks</b>
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
                                  fontSize: "1.5rem",
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
                      {/* <p>Owner: <b>{prj.alumni_name}</b> </p><p>Id: {prj.alumni_email}</p> */}
                      <p style={{ marginTop: "60px" }}>
                        Deadline:{" "}
                        <b>{new Date(prj.deadline).toLocaleDateString()}</b>
                      </p>
                    </div>
                    <div className="apply-btn-container">
                      <button
                        className="apply-btn1"
                        onClick={() => apply(prj._id, prj.title)}
                      >
                        Know more
                      </button>
                    </div>
                  </li>
                ))
              ) : (
                <div className="alert alert-warning mt-4" role="alert">
                  <strong>No Projects Available</strong>
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
