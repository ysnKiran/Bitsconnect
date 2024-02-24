import React from 'react'
import { useNavigate } from 'react-router-dom';

const Applications = () => {
    // Should have a select bar for projects posted
    // Based on selected project - Show applications

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
      <h1>Applications Page</h1>
    </div>
  )
}

export default Applications
