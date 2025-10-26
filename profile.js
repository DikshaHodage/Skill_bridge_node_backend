const express = require('express');
const router = express.Router();
const auth = require('./middleware/auth');
const User = require('./User');

// @route    GET /api/profile
// @desc     Get user profile
// @access   Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST /api/profile
// @desc     Update user profile
// @access   Private
router.post('/', auth, async (req, res) => {
  const { phone, country, bio, profilePicture } = req.body;

  // Build profile object
  const profileFields = {};
  if (phone) profileFields.phone = phone;
  if (country) profileFields.country = country;
  if (bio) profileFields.bio = bio;
  if (profilePicture) profileFields.profilePicture = profilePicture;

  try {
    let user = await User.findById(req.user.id);
    if (user) {
      // Update
      user = await User.findOneAndUpdate(
        { _id: req.user.id },
        { $set: profileFields },
        { new: true }
      ).select('-password');
      return res.json(user);
    }
    res.status(404).json({ msg: 'User not found' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


module.exports = router;
