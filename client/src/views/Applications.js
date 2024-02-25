import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Applications = () => {
  // Should have a select bar for projects posted
  // Based on selected project - Show applications
  const id = localStorage.getItem("idToken");
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // Fetch projects when the component mounts
    axios
      .get("http://localhost:3001/myAppliedProjects", {
        headers: {
          authorization: `${id}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        // Set the fetched projects to state
        setProjects(response.data);
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
      });
  }, []);

  const navigate = useNavigate();
  const goBack = () => {
    navigate("/home");
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div>
      <button onClick={goBack}>Back Button</button>
      <button onClick={logout}>Logout</button>
      <h1>Applications Page</h1>
    </div>
  );
};

export default Applications;
