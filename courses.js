const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Assuming you have an auth middleware
const User = require('../models/User'); // Assuming your user model is in 'models/User.js'

// @route   GET /api/courses/wishlist
// @desc    Get user's wishlisted courses
// @access  Private
router.get('/wishlist', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('wishlistedCourses');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user.wishlistedCourses);
    } catch (err) {
        console.error(err.message);
        // UPDATED LINE: Sends JSON on error
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   POST /api/courses/wishlist
// @desc    Add or remove a course from the user's wishlist
// @access  Private
router.post('/wishlist', auth, async (req, res) => {
    const { courseId } = req.body;

    if (!courseId) {
        return res.status(400).json({ msg: 'Course ID is required.' });
    }

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const courseIndex = user.wishlistedCourses.indexOf(courseId);

        if (courseIndex > -1) {
            // Course is already in the wishlist, so remove it
            user.wishlistedCourses.splice(courseIndex, 1);
        } else {
            // Course is not in the wishlist, so add it
            user.wishlistedCourses.push(courseId);
        }

        await user.save();
        res.json({ wishlistedCourses: user.wishlistedCourses });

    } catch (err) {
    console.error(err.message);
    // This line correctly sends JSON, preventing the error
    res.status(500).json({ msg: 'Server Error' });
}
});

module.exports = router;