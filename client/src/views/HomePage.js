import React from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";


function Home() {
  const navigate = useNavigate();

  // Fetch 

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const CreateOpening =() =>{
    navigate("/create");
  }

  return (
    <div>
      <h1>Home Page</h1>
      <button onClick={CreateOpening}>Create Opening</button>
      <button onClick={logout}>Logout</button>

      

    </div>
  );
}
export default Home;
