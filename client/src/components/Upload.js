import React, { useState } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import app from '../firebase';
import axios from 'axios';

const Upload = ({ handleUpload ,saveBtn_State}) => {
  const [pdf, setPdf] = useState(undefined);
  const [pdfPerc, setPdfPerc] = useState(0);

  const uploadFile = async (file) => {
    saveBtn_State(true);
    const storage = getStorage();
    const folder = 'pdf/';
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, folder + fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setPdfPerc(Math.round(progress));
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
          default:
            break;
        }
      },
      (error) => {
        console.error('Error uploading file:', error);
        saveBtn_State(false);
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('Download URL:', downloadURL);
          handleUpload(downloadURL); // Pass the download URL to the parent component
          saveBtn_State(false);
        });
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await uploadFile(pdf);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div className="upload">
      <form onSubmit={handleSubmit}>
        <label htmlFor="pdf">Upload Resume:</label> {pdfPerc > 0 && pdfPerc < 100 && 'Uploading: ' + pdfPerc + '%'}
        <br />
        <input
          type="file"
          id="pdf"
          accept="application/pdf"
          onChange={(e) => setPdf(e.target.files[0])}
        />
        <br />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default Upload;
