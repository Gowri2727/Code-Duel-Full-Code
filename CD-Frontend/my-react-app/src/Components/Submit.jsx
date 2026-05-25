import React, { useState } from 'react';
import axios from 'axios';
import '../Styles/Form.css';
import { useAppContext } from '../App';

const Submit = () => {
  const [gmail, setGmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const { signupData, setPage,setCurrentUser } = useAppContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      const completeData = {
        ...signupData, 
        email: gmail,
        password: password
      };
      const response = await axios.post('http://localhost:5002/api/submit-credentials', completeData);
    console.log('Submit successful:', response.data);
const loginRes = await axios.post('http://localhost:5002/api/login', {
  email: gmail,
  password: password
});
setCurrentUser(loginRes.data.user);
// setPage('home');  
setPage('login');  // ✅ Redirects to login after account creation

    } catch (err) {
      console.error('Submit error:', err);
    if (err.response?.data?.error) {
      alert(err.response.data.error);
    } else {
      alert('Failed to create account');
    }
    }
  };

  return (
    <div className="form-container">
      <h2>Submit Your Credentials</h2>
      <form onSubmit={handleSubmit}>
        <label>Gmail:</label>
        <input type="email" value={gmail} onChange={(e) => setGmail(e.target.value)} required />

        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <label>Confirm Password:</label>
        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Submit;