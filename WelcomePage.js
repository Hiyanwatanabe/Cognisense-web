import React from 'react';
import { useNavigate } from 'react-router-dom';

const WelcomePage = () => {
  const navigate = useNavigate();

  const handleNext = () => {
    // Navigate to the EEG Setup page
    navigate('/eeg-setup');
  };

  return (
    <div className="login-form container">
      <h2>Welcome to Cognisense</h2>
      <p>
        You are about to embark on a journey to test your cognitive load as an interplanetary explorer!
        These tasks will challenge your memory, reaction times, and mental flexibility. Sensors will
        measure your brain activity in real time.
      </p>
      <p>
        Are you ready to see how well you can perform under pressure? Click "Next" to begin!
      </p>
      <button className="next-btn" onClick={handleNext}>Next</button>
    </div>
  );
};

export default WelcomePage;