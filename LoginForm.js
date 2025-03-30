// src/components/LoginForm.js
import React, { useState } from 'react';
import { db } from '../firebase/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
// ✅ Import Firebase Auth functions
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebase'; // Import initialized auth

const LoginForm = ({ onLoginSuccess }) => {
  const [credentials, setCredentials] = useState({
    email: '', // changed from username to email
    password: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const submitLogin = async () => {
    const { email, password } = credentials;
    if (!email || !password) {
      alert("Please fill out all fields.");
      return;
    }
    try {
      // ✅ Use Firebase Auth to log in
      const userCred = await signInWithEmailAndPassword(auth, email, password); // ✅
      const username = userCred.user.email; // ✅ Use email as username (or displayName if set)
      localStorage.setItem("currentUser", username); // ✅ Store in localStorage
      onLoginSuccess(username); // ✅ Pass to parent
      alert("Login successful!");
      navigate('/game'); // ✅ Redirect to game (or wherever)
    } catch (error) {
      console.error("Login error:", error.message); // ✅
      alert("Login failed: " + error.message); // ✅
    }
  };

  return (
    <div className="login-form container">
      <h2>Login</h2>
      <div>
        <label htmlFor="usernameLogin"style={{ textAlign: 'left', display: 'block' }}>Username</label>
        <input type="text" id="usernameLogin" name="email" placeholder="Enter your username" onChange={handleChange} />
      </div>
      <div>
        <label htmlFor="passwordLogin" style={{ textAlign: 'left', display: 'block' }}>Password</label>
        <input type="password" id="passwordLogin" name="password" placeholder="Enter your password" onChange={handleChange} />
      </div>
      <button type="button" onClick={submitLogin}>Login</button>
    </div>
  );
};

export default LoginForm;
