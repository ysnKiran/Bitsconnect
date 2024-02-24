import React,{useState} from 'react';
import { useParams,useNavigate } from 'react-router-dom';

const Apply = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [desc,setDesc] =useState('');

    // fetch project details using id... so that details can be confirmed
    const goBack = ()=>{
        
        navigate('/home');
      };
  
      const logout = () => {
        localStorage.clear();
        navigate("/");
      };

      const handleSubmit =(e)=>{
        e.preventDefault();
        // Filter out empty skills
        if(!desc)
        {
          alert('Please add SOP');
          return;
        }

        console.log('Submit button clicked');
        // Add user id to applied_users in Project Table
        // Add project_id(id) and proposal(desc) to User Table
        alert('Successfully applied for project ID') 
        navigate('/home');
      }

  return (
    <div>
    <button onClick={goBack}>Back Button</button>
    <button onClick={logout}>Logout</button>
    <form onSubmit={handleSubmit}>
      
      <h1> Are you sure you want to apply for Project Id: {id}</h1>
      <div>
        <label>SOP: Your Proposal to help your candidature :</label>
        <textarea value={desc} onChange={(e) => setDesc(e.target.value)}></textarea>
      </div>
      <button type="submit">Submit</button>
    </form>
    </div>
  )
}

export default Apply
