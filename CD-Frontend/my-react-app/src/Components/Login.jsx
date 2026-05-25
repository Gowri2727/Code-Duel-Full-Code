import React, { useState } from 'react';
import '../Styles/Form.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAppContext } from '../App';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setPage, setCurrentUser } = useAppContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5002/api/login', { email, password });
      console.log("Login success", res.data);
      
      if (res.data.user) {
        setCurrentUser(res.data.user);
      } else {
        setCurrentUser({ email });
      }
      
      setPage('home');
    } catch (err) {
      console.error("Login error:", err);
      if (err.response && err.response.data && err.response.data.error) {
        alert(err.response.data.error);
      } else {
        alert('Login failed');
      }
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <button type="submit">Login</button>
      </form>
      <p style={{ marginTop: '15px', textAlign: 'center' }}> Don't have an account?{' '}
        <span 
          onClick={() => setPage('signup')} 
          style={{ color: 'blue', textDecoration: 'none', cursor: 'pointer' }}
        > 
          Sign up here
        </span>
      </p>
    </div>
  );
};

export default Login;
