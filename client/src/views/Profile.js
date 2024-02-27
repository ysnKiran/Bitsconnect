import React,{useState,useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Upload from '../components/Upload';

const Profile = () => {
    const [editMode,setEditMode] =useState(false);
    const [userData, setUserData] = useState([]);
    const [tempUserData, setTempUserData] = useState({});
    const [newResumeUrl, setNewResumeUrl] = useState('');
      const navigate = useNavigate();

      useEffect(() => {
        const email = localStorage.getItem("email");
        if (email) {
            // logged in
            const id=localStorage.getItem("idToken");
            
            axios
            .get("http://localhost:3001/getUserByID/", {
              headers: {
                authorization: `${id}`,
              },
            })
            .then((response) => {
                
                console.log(response.data);
                // Set the fetched projects to state
                setUserData(response.data);
                setTempUserData(response.data);
            })
            .catch((error) => {
                if(error.response.status===401)
                {
                    console.log("Unauth")
                    localStorage.clear();
                    navigate("/");
                }
              console.error("Error fetching projects:", error);
            });
            
        }
        else
        {
            logout();
        }
      }, []);

      const handleEdit = () => {
        setTempUserData(userData); // Save current data before editing
        setEditMode(true);
      };

      const handleCancel = () => {
        setTempUserData(userData); // Restore original data
        setEditMode(false);
      };
      
      const handleSave = () => {
        console.log(tempUserData);
        const id=localStorage.getItem("idToken");
        axios
        .put(
          "http://localhost:3001/updateDetails",
          { name: tempUserData.name, resume_link: newResumeUrl },
          {
            headers: {
              authorization: `${id}`,
            },
          }
        )
        .then((response) => {
          console.log(response.data); // Logging the response data to console
          tempUserData.resume_link=newResumeUrl;
          setUserData(tempUserData); // Update user data with edited values
          setEditMode(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
        
      };

      const handleChange = (e) => {
        const { name, value } = e.target;
        setTempUserData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      };

      const handleUpload = (url) => {
        setNewResumeUrl(url);
      };

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
      <h2>Profile Page</h2>
      <div>
        <label>Name:</label>
        {editMode ? (
          <input
            type="text"
            name="name"
            value={tempUserData.name}
            onChange={handleChange}
          />
        ) : (
          <span>{userData.name}</span>
        )}
      </div>
      <div>
        <label>Email:</label>
        <span>{userData.email}</span>
        
      </div>
      <div>
        <label>Batch Year:</label>
        <span>{userData.batch_year}</span>
        </div>

      <div>
      
        {editMode ? (
            <span>
            <label>Upload Resume: </label>
            <Upload handleUpload={handleUpload}/>
          </span>
        ) : (
            <button onClick={() => window.open(userData.resume_link, '_blank')}>Resume</button>
        )}
      </div>
      {/* Add more fields here */}
      {editMode ? (
        <div>
          <button onClick={handleSave}>Save</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      ) : (
        <button onClick={handleEdit}>Edit</button>
      )}
    </div>
  )
}

export default Profile
