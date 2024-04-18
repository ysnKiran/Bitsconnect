import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BsChevronLeft } from "react-icons/bs";
import Navbar from "./NavbarHandlers.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Report = () => {
  const [report, setReport] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const id = localStorage.getItem("idToken");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    if (!report) {
      toast.error("Please enter a valid report", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "dark",
      });
      return; // Don't proceed further if the report is empty
    }

    setSubmitting(true); // Set submitting to true when form is being submitted

    axios
      .post(
        `${process.env.REACT_APP_BACKEND_URL}/newReview`,
        { report },
        {
          headers: {
            authorization: `${id}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        toast.success("Report Filed", {
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
        if (error.response && error.response.status === 401) {
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
        } else {
          console.error("Error fetching data:", error);
          toast.error("Something went wrong", {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            theme: "dark",
          });
        }
      })
      .finally(() => {
        setSubmitting(false); // Set submitting to false when form submission is completed
      });
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
          <div className="col-auto">
            <button className="btn btn-link" onClick={goBack}>
              <BsChevronLeft size={24} />
            </button>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="apply-form2"
          style={{ marginTop: "0" }}
        >
          <div>
            <label className="form-label2" style={{ marginLeft: "1rem" }}>
              Report:
            </label>
            <textarea
              value={report}
              onChange={(e) => setReport(e.target.value)}
              className="form-control2"
            ></textarea>
          </div>
          {submitting ? ( // Render loading spinner if submitting state is true
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          ) : (
            <button type="submit" className="btn2">
              Report
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Report;
