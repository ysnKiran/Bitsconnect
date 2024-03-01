import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Upload from '../components/Upload';
import '../views/profile.css';
import { BsChevronLeft } from "react-icons/bs";


const Profile = () => {
  const [editMode, setEditMode] = useState(false);
  const [userData, setUserData] = useState([]);
  const [tempUserData, setTempUserData] = useState({});
  const [newResumeUrl, setNewResumeUrl] = useState('');
  const [Save_active, setDisable] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [fileName, setFileName] = useState('');
  const [showUploadSuccess, setShowUploadSuccess] = useState(false); // State variable to control display of upload success message
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (email) {
      const id = localStorage.getItem("idToken");
      axios
        .get("http://localhost:3001/getUserByID/", {
          headers: {
            authorization: `${id}`,
          },
        })
        .then((response) => {
          setUserData(response.data);
          setTempUserData(response.data);
        })
        .catch((error) => {
          if (error.response.status === 401) {
            localStorage.clear();
            navigate("/");
          }
          console.error("Error fetching projects:", error);
        });
    } else {
      logout();
    }
  }, []);

  const handleEdit = () => {
    setTempUserData(userData);
    setEditMode(true);
    setFileName(''); // Reset the file name when entering edit mode
    setShowUploadSuccess(false); // Hide the upload success message when entering edit mode
  };

  const handleCancel = () => {
    setTempUserData(userData);
    setEditMode(false);
    setShowUploadSuccess(false); // Clear the upload success message when canceling
  };

  const handleSave = () => {
    setDisable(true);
    const id = localStorage.getItem("idToken");
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
        console.log(response.data);
        tempUserData.resume_link = newResumeUrl;
        setUserData(tempUserData);
        setEditMode(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    setDisable(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    setFileName(file.name);
    setFileUploaded(true);
    setShowUploadSuccess(true); // Show upload success message when file is uploaded
  };

  const goBack = () => {
    navigate("/home");
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
   <div className='bg' style={{backgroundColor: '#000' }}>
    <div className="col-auto"  style={{ paddingRight: '900px', backgroundColor: '#fff' }}>
    <button className="btn btn-link" onClick={goBack}>
      <BsChevronLeft size={24} />
    </button>
  </div>
  
    <div className="profile-container">
    
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
    <div className="file-input-container">
      <label htmlFor="resume" className="choose-file-button">Choose File</label>
      <input
        type="file"
        id="resume"
        accept="application/pdf"
        className="file-input"
        onChange={handleResumeUpload}
      />
      <textarea className="file-name-textarea" value={fileName} readOnly />
    </div>
  ) : (
    <button className="resume-button" onClick={() => window.open(userData.resume_link, '_blank')}>
      Resume
    </button>
  )}
  {showUploadSuccess && <p>File uploaded successfully!</p>} {/* Display upload success message */}
</div>
      {editMode ? (
        <div>
          <button onClick={handleSave} disabled={Save_active}>Save</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      ) : (
        <button className="edit" onClick={handleEdit}>Edit</button>
      )}
    </div>
    </div>
  );
};

export default Profile;
