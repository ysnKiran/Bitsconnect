import React from 'react'
import { useNavigate } from 'react-router-dom';

const ViewMyAppliedProjects = () => {
    // View all my applied projects
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
      <h1>Your Applied Projects</h1>
    </div>
  )
}

export default ViewMyAppliedProjects
