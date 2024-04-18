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
import './Login.css'; // Import your CSS file

const LoginAdmin = () => {

  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  
  const [loading, setLoading] = useState(true); // State for loading projects
  
  const handleSubmit= (e) =>{
    e.preventDefault();
    const username =e.target.username.value;
    const password =e.target.password.value;
    
    axios
      .post(
        `${process.env.REACT_APP_BACKEND_URL}/login`,
        {
          username,
          password
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          mode: "cors",
        }
      )
      .then((response) => {
        if (response.status === 200) {
          navigate("/dashboard"); // Use history.push to redirect
        }
        console.log("Admin In");
      })
      .catch((error) => {
        console.error("Error sending user data to backend:", error);
        toast.error('Incorrect Username or Password', {
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
    <div className="login-container">
      <h2>Login</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input type="text" id="username" name="username" placeholder="Enter your username" />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" placeholder="Enter your password" />
        </div>
        <button type="submit" className="login-button">Login</button>
      </form>
    </div>
  );

}

export default LoginAdmin
