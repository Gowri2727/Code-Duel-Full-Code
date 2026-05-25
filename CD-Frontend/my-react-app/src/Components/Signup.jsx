import React, { useState } from 'react';
import '../Styles/Signup.css'
import axios from 'axios';
import { useAppContext } from '../App';

const Signup = () => {
  const [form, setForm] = useState({
    fullName: '', college: '', rollNo: '', location: '', year: '', language: ''
  });

  const { setPage, setSignupData } = useAppContext();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting form:', form);
    try {
      const response = await axios.post('http://localhost:5002/api/signup', form);
      console.log('Response:', response);
      setSignupData(form);
      alert('Basic info saved. Please provide email and password.');
      setPage('submit');
    } catch (err) {
      console.error('Signup error:', err);
      alert('Signup failed');
    }
  };

  return (
    <div className="signup-container">
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <label>Full Name:</label>
        <input name="fullName" onChange={handleChange} required />

        <label>College:</label>
        <input name="college" onChange={handleChange} required />

        <label>Roll No:</label>
        <input name="rollNo" onChange={handleChange} required />

        <label>Location:</label>
        <input name="location" onChange={handleChange} required />

        <label>Year (Sem-wise):</label>
        <input name="year" onChange={handleChange} required />

        <label>Preferred Language:</label>
        <select name="language" onChange={handleChange} required>
          <option value="">Select</option>
          {/* <option value="Java">Java</option> */}
          <option value="Python">Python</option>
        </select>

        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default Signup;