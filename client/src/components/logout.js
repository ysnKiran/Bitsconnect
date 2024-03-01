// LogoutButton.js
import React from 'react';

const logout = ({ onClick }) => {
  return (
    <button className="logout" onClick={onClick}>
      Logout
    </button>
  );
};

export default logout;
