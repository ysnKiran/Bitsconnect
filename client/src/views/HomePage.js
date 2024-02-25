import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Home() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const id = localStorage.getItem("idToken");

  useEffect(() => {
    // Fetch projects when the component mounts
    axios
      .get("http://localhost:3001/projects", {
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

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const CreateOpening = () => {
    navigate("/create");
  };

  const apply = (id,title) => {
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

  return (
    <div>
      <h1>Home Page</h1>
      <button onClick={CreateOpening}>Create Opening</button>
      <button onClick={ViewApplications}>Owned Project's Applications</button>
      <button onClick={ViewAppliedProjects}>Applied Projects</button>
      <button onClick={ViewSelectedProjects}>Projects Selected For</button>
      <button onClick={logout}>Logout</button>

      <div>
        {projects.length > 0
          ? projects.map((prj) => (
              <div key={prj._id}>
                <h3>{prj.title}</h3>
                <p>{prj.description}</p>
                <p>
                  <b>Pay</b>: {prj.pay} &nbsp; <b>Duration</b>: {prj.duration}
                </p>

                {prj.skills.length > 0
                  ? prj.skills.map((skill, index) => (
                      <p key={index}>{skill} </p>
                    ))
                  : "No specific skill-requirement"}
                <button onClick={() => apply(prj._id,prj.title)}>Apply!</button>
              </div>
            ))
          : "No Projects Available"}
      </div>
    </div>
  );
}
export default Home;
