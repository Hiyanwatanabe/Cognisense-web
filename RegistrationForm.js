// src/components/RegistrationForm.js
import React, { useState } from 'react';
import { db, auth } from '../firebase/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const RegistrationForm = ({ onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    dob: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitRegistration = async () => {
    const { name, username, dob, email, password, confirmPassword } = formData;
    if (!name || !username || !dob || !email || !password || !confirmPassword) {
      alert("Please fill out all fields.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await addDoc(collection(db, "users"), {
        uid: userCred.user.uid,
        name,
        username,
        dob,
        email,
        password,
        createdAt: new Date()
      });
      localStorage.setItem("currentUser", email);
      alert("Registration successful!");
      onRegisterSuccess(email);
      navigate('/game');  // Redirect to game
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Registration failed. See console for details.");
    }
  };

  return (
    <div className="registration-form container">
      <h2>Full Registration</h2>
      <div className="form-group">
        <label style={{ textAlign: 'left', display: 'block' }}>Full Name</label>
        <input type="text" id="name" name="name" placeholder="Enter your full name" onChange={handleChange} />
      </div>
      <div className="form-group">
        <label htmlFor="username" style={{ textAlign: 'left', display: 'block' }}>Username</label>
        <input type="text" id="username" name="username" placeholder="Choose a username" onChange={handleChange} />
      </div>
      <div className="form-group">
        <label htmlFor="dob" style={{ textAlign: 'left', display: 'block' }}>Year of Birth</label>
        <input type="number" id="dob" name="dob" min="1900" max="2099" placeholder="e.g., 2000" onChange={handleChange} />
      </div>
      <div className="form-group">
        <label htmlFor="email" style={{ textAlign: 'left', display: 'block' }}>Email</label>
        <input type="email" id="email" name="email" placeholder="yourname@example.com" onChange={handleChange} />
      </div>
      <div className="form-group">
        <label htmlFor="password" style={{ textAlign: 'left', display: 'block' }}>Password</label>
        <input type="password" id="passwordReg" name="password" placeholder="Enter a password" onChange={handleChange} />
      </div>
      <div className="form-group">
        <label htmlFor="confirmPassword" style={{ textAlign: 'left', display: 'block' }}>Confirm Password</label>
        <input type="password" id="confirm-password" name="confirmPassword" placeholder="Re-enter your password" onChange={handleChange} />
      </div>
      <button type="button" onClick={submitRegistration}>Register</button>
      <p style={{ marginTop: '20px' }}>
        Already have an account?{' '}
        <a href="/login" style={{ color: '#f0a500' }}>Sign In</a>
      </p>
    </div>
  );
};

export default RegistrationForm;