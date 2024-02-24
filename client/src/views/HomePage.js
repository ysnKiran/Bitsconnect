import React,{useState} from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";



function Home() {
  const navigate = useNavigate();

  // Fetch 
  // Dummy data
  // Id is needed for display - Id should be unique projectID
  const [projects,setProjects] =useState([
        {
            id:1,
            title: 'Graphic Logo Maker Needed',
            desc: ' Our startup Ace-maker needs a competent graphic designer to make our logo',
            pay: 'Rs 10000/annum',
            duration: '1 week',
            skills: ['Graphic Designer','Abode']

        },
        {
            id:2,
            title: 'Marketer needed',
            desc: ' Want interns to a budding BITSian company, come invest into its future. PPO possibility.',
            pay: 'Unpaid opportunity',
            duration: 'As long as you want',
            skills: ['Good Communication','Witty']
        },
        {
          id:3,
          title: 'Assignment help needed',
          desc: 'Can\'t finish work. Need assignment help ',
          pay: 'Treat assured',
          duration: '1 month',
          skills: ['Good coder','Senior','Crux']
        }
    ])


  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const CreateOpening =() =>{
    navigate("/create");
  }

  const apply =(id)=>{
    console.log('Id clicked: ',id);
    // navigate to Apply page with Id as params 
    navigate(`/apply/${id}`);
  }

  

  const ViewApplications=()=>{
    console.log('View Applications clicked');
    navigate('/applications');
  }

  const ViewAppliedProjects=()=>{
    console.log('View Applied Projects clicked');
    navigate('/applied-projects');
  }

  const ViewSelectedProjects=()=>{
    console.log('View Selected Projects clicked');
    navigate('/selected-projects');
  }

  return (
    <div>
      <h1>Home Page</h1>
      <button onClick={CreateOpening}>Create Opening</button>
      <button onClick={ViewApplications}>Owned Project's Applications</button>
      <button onClick={ViewAppliedProjects}>Applied Projects</button>
      <button onClick={ViewSelectedProjects}>Projects Selected For</button>
      <button onClick={logout}>Logout</button>

      <div>
        {
          projects.length>0 ?
          projects.map((prj)=>(
            <div>
              <h3>{prj.title}</h3>
              <p>{prj.desc}</p>
              <p><b>Pay</b>: {prj.pay} &nbsp; <b>Duration</b>: {prj.duration}</p>
              
              {prj.skills.length>0 ?
                prj.skills.map((skill)=>(
                  <p>{skill} </p>
                ))
                :
                'No specific skill-requirement'}
                <button id={prj.id} onClick={()=>apply(prj.id)}>Apply!</button>
            </div>
          ))
          :
          ('No Projects Available')

        }
      </div>


    
    </div>
  );
}
export default Home;
