// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import WelcomePage from './pages/WelcomePage';
import EEGSetupPage from './pages/EEGSetupPage';
import RegistrationForm from './components/RegistrationForm';
import LoginForm from './components/LoginForm';
import DashboardPage from './pages/DashboardPage';
import GameContainer from './components/GameContainer';
import HighCognitiveLoad from './pages/Highcognitive';
import './App.css';


function App() {
  const [currentUser, setCurrentUser] = useState(null);

  const handleLoginSuccess = (username) => {
    setCurrentUser(username);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <Router>
      <Header currentUser={currentUser} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<WelcomePage/>}/>
        <Route path="/eeg-setup" element={<EEGSetupPage/>} />
        <Route path="/register" element={<RegistrationForm onRegisterSuccess={handleLoginSuccess}/>}/>
        <Route path="/login" element={<LoginForm onLoginSuccess={handleLoginSuccess}/>}/>
        <Route path="/dashboard" element={<DashboardPage currentUser={currentUser}/>}/>
        <Route path="/game" element={<GameContainer currentUser={currentUser}/>}/>
        <Route path="/Highcognitive" element={<HighCognitiveLoad/>} />
      </Routes>
    </Router>
  );
}

export default App;
