import React from 'react';
import { useNavigate } from 'react-router-dom';
import electrodeImg from '../images/electrode.png';

const EEGSetupPage = () => {
  const navigate = useNavigate();

  const handleNext = () => {
    // Assuming the next page is the registration page
    navigate('/register');
  };

  return (
    <div className="login-form container">
      <h2>EEG Setup Instructions</h2>
      <p>To measure cognitive load, place the EEG pads on your head as follows:</p>
      <ul>
        <li><strong>Frontal Lobe (Red - Fp1, Fp2): </strong>Front of the head</li>
        <li><strong>Ear Lobes (Yellow - A1, A2): </strong>On the sides of the head</li>
        <li><strong>Parietal Lobe (Blue - P3, Pz, P4): </strong>Upper back of the head</li>
        <li><strong>Occipital Lobe (Brown - O1, O2): </strong>Lower back of the head</li>
      </ul>
      <img
        src={electrodeImg}
        alt="EEG placement diagram"
        style={{ width: '100%', maxWidth: '600px' }}
      />
      <button className="next-btn" onClick={handleNext}>Next</button>
    </div>
  );
};

export default EEGSetupPage;