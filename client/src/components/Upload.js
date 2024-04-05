import React, { useState, useEffect } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "../firebase";
import axios from "axios";

const Upload = ({ handleUpload, saveBtn_State }) => {
  const [pdf, setPdf] = useState(undefined);
  const [pdfPerc, setPdfPerc] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [uploading, setUploading] = useState(false); // Track upload status

  useEffect(() => {
    // Clear success message after 3 seconds
    const timer = setTimeout(() => {
      setSuccessMessage("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [successMessage]);

  const uploadFile = async (file) => {
    saveBtn_State(true);
    setUploading(true); // Set uploading status to true
    const storage = getStorage();
    const folder = "pdf/";
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, folder + fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Reset error message
    setErrorMessage("");

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setPdfPerc(Math.round(progress));
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
          default:
            break;
        }
      },
      (error) => {
        console.error("Error uploading file:", error);
        setErrorMessage("Error uploading file");
        saveBtn_State(false);
        setUploading(false); // Reset uploading status
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            console.log("Download URL:", downloadURL);
            handleUpload(downloadURL); // Pass the download URL to the parent component
            setSuccessMessage("File uploaded successfully!");
            saveBtn_State(false);
            setUploading(false); // Reset uploading status
          })
          .catch((error) => {
            console.error("Error getting download URL:", error);
            setErrorMessage("Error getting download URL");
            saveBtn_State(false);
            setUploading(false); // Reset uploading status
          });
      }
    );
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 500 * 1024) {
      setErrorMessage("File size exceeds maximum allowed size (500KB)");
      return;
    }
    setPdf(file);
    if (file) {
      uploadFile(file);
    }
  };

  return (
    <div className="upload">
      <input
        type="file"
        id="pdf"
        accept="application/pdf"
        onChange={handleFileChange}
        disabled={uploading} // Disable file input when uploading
      />
      {pdfPerc > 0 && pdfPerc < 100 && "Uploading: " + pdfPerc + "%"}
      <br />
      {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
      {successMessage && <div style={{ color: "green" }}>{successMessage}</div>}
    </div>
  );
};

export default Upload;
