import React from "react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BsChevronLeft } from "react-icons/bs";
import '../views/styles.css';
import Navbar from "./NavbarHandlers.js";
import '../views/global.css';
import {ToastContainer, toast} from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Upload from '../components/Upload';



const Create = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [pay, setPay] = useState("");
  const [duration, setDuration] = useState("");
  const [desc, setDesc] = useState("");
  const [skills, setSkills] = useState([]);
  const [deadline, setDeadline] = useState(""); // State for deadline
  const [jobDescription, setJD] = useState("");
  const [Save_active,setDisable] =useState(false);

  const handleUpload = (url) => {
    setJD(url);
  };

  const handleSkillChange = (index, value) => {
    const newSkills = [...skills];
    newSkills[index] = value;
    setSkills(newSkills);
  };

  const handleAddSkill = () => {
    setSkills([...skills, ""]);
  };

  const handleRemoveSkill = (index) => {
    const newSkills = [...skills];
    newSkills.splice(index, 1);
    setSkills(newSkills);
  };

  const handleDeadlineChange = (e) => {
    setDeadline(e.target.value);
    console.log("Dead date: ",e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Filter out empty skills
    if (!title) {
      alert("Please add title");
      return;
    }
    const filteredSkills = skills.filter((skill) => skill.trim() !== "");
    const id = localStorage.getItem("idToken");

    // Handle form submission here
    //console.log({ title, pay, duration, desc, skills: filteredSkills });
    if (id) {
      axios
        .post(
          `${process.env.REACT_APP_BACKEND_URL}/newProject`,
          { title, pay, duration, description: desc, skills: filteredSkills, deadline, jobDescription},
          {
            headers: {
              authorization: `${id}`,
            },
          }
        )
        .then((response) => {
          console.log(response.data); // Logging the response data to console
          toast.success('Project Posted Successfully', {
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
          if(error.response.status===401)
                {
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
          console.error("Error fetching data:", error);
          
          toast.error('Error Fetching Data', {
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
    } else {
      console.error("idToken is null or undefined");
    }
    

    setPay("");
    setDuration("");
    setDesc("");
    setSkills([]);
  };

  const goBack = () => {
    setPay("");
    setDuration("");
    setDesc("");
    setSkills([]);
    navigate("/home");
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

return (
 
        
  <div>
  <Navbar/>
  <div className="apply-form3">
      <div className="row justify-content-between align-items-center mb-3">
        <div className="col-auto">
          <button className="btn btn-link" onClick={goBack}>
            <BsChevronLeft size={24} />
          </button>
        </div>
      </div>
      <div>
        <div className="mb-3">
          <label className="form-label">Title:</label>
          <input
            type="text"
            className="form-control title-textarea"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Description:</label>
          <textarea
            className="form-control desc-textarea"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          ></textarea>
        </div>
        <div className="mb-3">
          <label className="form-label">Job Description:</label>
        
          <Upload handleUpload={handleUpload} saveBtn_State={setDisable}/>
          
        </div>
        
        <div className="mb-3">
  <div className="d-flex">
    <div className="me-3">
      <label className="form-label">Pay:</label>
      <input
        type="number"
        className="form-control pay-textarea"
        value={pay}
        onChange={(e) => setPay(e.target.value)}
      />
    </div>
    <div>
      <label className="form-label">Duration (In weeks):</label>
      <input
        type="number"
        className="form-control duration-textarea"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
      />
    </div>
  </div>
</div>
          <div className="mb-3">
            <label className="form-label"> Application Deadline:</label>
            <input
              type="date"
              className="form-control"
              value={deadline}
              onChange={handleDeadlineChange}
              min={new Date().toISOString().split("T")[0]} 
              required
            />
          </div>

        <div className="mb-3">
        <label className="form-label skills-textarea">Skills:</label>
        {skills.map((skill, index) => (
          <div key={index} className="d-flex align-items-center mb-2">
            <input
              type="text"
              className="form-control me-2"
              value={skill}
              onChange={(e) => handleSkillChange(index, e.target.value)}
            />
            <button
              type="button"
              className="btn1"
              onClick={() => handleRemoveSkill(index)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      
      <div className="mb-3">
        <button
          type="button"
          className="btn1"
          onClick={handleAddSkill}
        >
          Add Skill
        </button>
        

        <button type="submit" className="btn2" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  </div>
  </div>
    
  );
};

export default Create;
