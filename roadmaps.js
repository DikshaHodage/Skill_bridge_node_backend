const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// @route   GET /api/roadmaps/my-roadmaps
// @desc    Get user's saved roadmaps
// @access  Private
router.get('/my-roadmaps', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('savedRoadmaps');
        res.json(user.savedRoadmaps);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   POST /api/roadmaps/my-roadmaps
// @desc    Add or remove a roadmap from the user's list
// @access  Private
router.post('/my-roadmaps', auth, async (req, res) => {
    const { roadmapId } = req.body;
    if (!roadmapId) {
        return res.status(400).json({ msg: 'Roadmap ID is required.' });
    }
    try {
        const user = await User.findById(req.user.id);
        const roadmapIndex = user.savedRoadmaps.indexOf(roadmapId);

        if (roadmapIndex > -1) {
            user.savedRoadmaps.splice(roadmapIndex, 1); // Remove it
        } else {
            user.savedRoadmaps.push(roadmapId); // Add it
        }
        await user.save();
        res.json({ savedRoadmaps: user.savedRoadmaps });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

module.exports = router;