import React, { useEffect, useState } from "react";
import { auth, provider } from "../components/config";
import { signInWithPopup } from "firebase/auth";
import Home from "./HomePage";


function SignIn() {
  const [value, setValue] = useState("");

  const handleClick = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        // Get user's name and email
        const { displayName, email } = user;

        // Get ID token
        user.getIdToken().then((idToken) => {
          console.log(idToken);
          // Send name, email, and ID token to backend
          sendUserDataToBackend(displayName, email, idToken);
        });

        setValue(email);
        localStorage.setItem("email", email);
      })
      .catch((error) => {
        console.error("Sign-in failed:", error);
      });
  };

  const sendUserDataToBackend = (name, email, idToken) => {
    // Make HTTP request to your backend API to send user data
    // Include the ID token in the request headers
    fetch("http://localhost:3001/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`, // Include the ID token in the Authorization header
      },
      body: JSON.stringify({ name, email }),
      mode: "cors",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to send user data to backend");
        }
        console.log("User data sent to backend successfully");
      })
      .catch((error) => {
        console.error("Error sending user data to backend:", error);
      });
  };

  useEffect(() => {
    setValue(localStorage.getItem("email"));
  }, []);

  return (
    <>
      {value ? (
        <Home />
      ) : (
        // Adding login Page specific styles
        <div>
        
        <button onClick={handleClick}>Sign in With Google</button>
        </div>
      )}
    </>
  );
}

export default SignIn;
