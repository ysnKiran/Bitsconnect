import React from 'react'
import { useNavigate } from 'react-router-dom';

const ViewMySelectedProjects = () => {
    // View all the projects that I got selected for
    const navigate = useNavigate();
    const goBack = ()=>{ 
        navigate('/home');
      };
  
      const logout = () => {
        localStorage.clear();
        navigate("/");
      };

  return (
    <div>
        <button onClick={goBack}>Back Button</button>
        <button onClick={logout}>Logout</button>
        <h1>Your Current Projects</h1>
    </div>
  )
}

export default ViewMySelectedProjects
