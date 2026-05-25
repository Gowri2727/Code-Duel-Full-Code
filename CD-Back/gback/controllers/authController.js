
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

let transporter;
let tempSignupData = {};

// Handle initial signup - store basic info temporarily
exports.signup = async (req, res) => {
  try {
    const { fullName, college, rollNo, location, year, language } = req.body;
    
    // Store temporarily (in a real app, use session or pass via state)
    tempSignupData = { fullName, college, rollNo, location, year, language };
    
    console.log("Signup data received:", req.body);
    res.status(200).json({ message: "Basic info saved. Please provide email and password." });
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Handle credentials submission - create complete user account
exports.submitCredentials = async (req, res) => {
  try {
    const { email, password, fullName, college, rollNo, location, year, language } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists with this email" });
    }
    
    // Combine temp data with credentials (use passed data or temp storage)
    const userData = {
      fullName: fullName || tempSignupData.fullName,
      college: college || tempSignupData.college,
      rollNo: rollNo || tempSignupData.rollNo,
      location: location || tempSignupData.location,
      year: year || tempSignupData.year,
      language: language || tempSignupData.language,
      email,
      password
    };
    
    const newUser = new User(userData);
    await newUser.save();
    
    // Clear temp data
    tempSignupData = {};
    
    res.status(201).json({ message: "Account created successfully!" });
  } catch (err) {
    console.error("Submit credentials error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    // Return user data along with success message
    const userData = {
      fullName: user.fullName,
      college: user.college,
      rollNo: user.rollNo,
      location: user.location,
      year: user.year,
      language: user.language,
      email: user.email
    };

    res.status(200).json({ 
      message: "Login successful!", 
      user: userData 
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.someHandler = (req, res) => {
  res.send('Working');
};