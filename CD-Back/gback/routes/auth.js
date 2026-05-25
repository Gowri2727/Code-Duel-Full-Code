const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { signup, login,submitCredentials } = require('../controllers/authController');

router.get('/profile/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email }).select('-password');
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});


router.put('/profile/update/:email', async (req, res) => {
  try {
    await User.findOneAndUpdate({ email: req.params.email }, req.body, { new: true });
    res.json({ message: "Profile updated successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
});

router.post('/signup', signup);
router.post('/submit-credentials', submitCredentials);
router.post('/login', login);
module.exports = router;