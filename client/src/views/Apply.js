import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BsChevronLeft } from "react-icons/bs";
import "../views/apply.css";
import Navbar from "./NavbarHandlers.js";
import "../views/global.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Apply = () => {
  const { prj_id, title } = useParams();
  const navigate = useNavigate();
  const [proposal, setProposal] = useState("");
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false); // State for tracking form submission
  const id = localStorage.getItem("idToken");

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/project/${prj_id}`, {
        headers: {
          authorization: `${id}`,
        },
      })
      .then((response) => {
        console.log("Project details: ", response.data);
        setProject(response.data);
        setLoading(false);
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
        setLoading(false);
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

  const goBack = () => {
    navigate("/home");
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!proposal) {
      alert("Please add SOP");
      return;
    }

    console.log("Submit button clicked");
    const id = localStorage.getItem("idToken");

    if (id) {
      setSubmitting(true); // Set submitting to true when form is being submitted
      axios
        .post(
          `${process.env.REACT_APP_BACKEND_URL}/apply`,
          { project_id: prj_id, proposal },
          {
            headers: {
              authorization: `${id}`,
            },
          }
        )
        .then((response) => {
          console.log(response.data);
          toast.success("Applied Successfully", {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            theme: "dark",
          });
          navigate("/home");
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
          toast.error("Already Applied", {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            theme: "dark",
          });
          navigate("/home");
        })
        .finally(() => {
          setSubmitting(false); // Set submitting to false when form submission is completed
        });
    } else {
      console.error("idToken is null or undefined");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="apply-form3">
        <div className="d-flex justify-content-between align-items-left mb-3">
          <div className="col-auto">
            <button className="btn btn-link" onClick={goBack}>
              <BsChevronLeft size={24} />
            </button>
          </div>
        </div>
        <div className="apply-details" style={{ marginBottom: "0" }}>
          {project !== null ? (
            <div>
              <h1>Apply for the Project {title}</h1>
              <br />
              <div>
                <p
                  style={{
                    fontSize: "1.5rem",
                    marginLeft: "0",
                    marginBottom: "1rem",
                  }}
                >
                  {project.description}
                </p>

                <p style={{ fontSize: "1.5rem", marginLeft: "0" }}>
                  Pay: <b>Rs {project.pay}</b>&nbsp; Duration:{" "}
                  <b>{project.duration} weeks</b>
                </p>
                <div className="skills">
                  {project.skills.map((skill, index) => (
                    <p
                      key={index}
                      className="badge"
                      style={{
                        backgroundColor: "#F5F2F7",
                        borderRadius: "30px",
                        color: "#64556D",
                        fontSize: "1.5rem",
                        fontWeight: "lighter",
                        display: "inline-block",
                        marginRight: "0.5rem",
                        marginLeft: "0",
                      }}
                    >
                      {skill}
                    </p>
                  ))}
                </div>
                <h2>
                  <button
                    className="btn"
                    onClick={() =>
                      window.open(project.jobDescription, "_blank")
                    }
                  >
                    Job Description
                  </button>
                </h2>
              </div>
            </div>
          ) : (
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          )}
        </div>
        <form
          onSubmit={handleSubmit}
          className="apply-form2"
          style={{ marginTop: "0" }}
        >
          <div>
            <label className="form-label2">
              SOP: Your Proposal to help your candidature:
            </label>
            <textarea
              value={proposal}
              onChange={(e) => setProposal(e.target.value)}
              className="form-control2"
            ></textarea>
          </div>
          {submitting ? ( // Render loading spinner if submitting state is true
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          ) : (
            <button type="submit" className="btn2">
              Submit
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Apply;
