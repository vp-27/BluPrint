// src/components/Popup.jsx
import React from 'react';
// import './Popup.css';

const Popup = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="popup-close" onClick={onClose}>X</button>
        <h2 className="popup-title">Welcome to BluPrint, your room organizer!</h2>
        <p className="popup-description">Here's how to get started:</p>
        <ul className="popup-instructions">
          <li>Select or create a room from the sidebar.</li>
          <li>Use the toolbar to add boxes and customize your layout.</li>
          <li>Double click on a box to add items inside it.</li>
          <li>Drag and drop items to move them around.</li>
          <li>Export your design as a CSV file for future reference.</li>
          <li>Import a CSV file to continue from where you left off.</li>
        </ul>
        <button className="popup-got-it" onClick={onClose}>Got it!</button>
      </div>
    </div>
  );
};

export default Popup;
