// BackButton.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

const goBack = ({ onClick }) => {
  return (
    <button className="goBack" onClick={onClick}>
      <FontAwesomeIcon icon={faChevronLeft} />
    </button>
  );
};

export default goBack;
