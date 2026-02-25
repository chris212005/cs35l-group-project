const router = require('express').Router();
const authMiddleware = require('../middlewares/authMiddleware');
const Schedule = require('./../models/schedule');

/**
 * SAVE / UPDATE Schedule
 */
router.post('/save-schedule', authMiddleware, async (req, res) => {
    try {
        const userId = req.userId; // Get the user ID from the auth middleware  
        const { schedule } = req.body;

        if (!Array.isArray(schedule)) {
            return res.status(400).send({
                message: "Schedule must be an array of classes",
                success: false
            });
        }

        const updatedSchedule = await Schedule.findOneAndUpdate(
            { userId },
            { schedule },
            { new: true, upsert: true }
        );

        res.status(200).send({
            message: "Schedule saved successfully",
            success: true,
            data: updatedSchedule
        });

    } catch (error) {
        res.status(400).send({
            message: error.message,
            success: false
        });
    }
});


/**
 * GET Current User Schedule
 */
router.get('/get-my-schedule', authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;

        const schedule = await Schedule.findOne({ userId });

        res.status(200).send({
            message: "Schedule fetched successfully",
            success: true,
            data: schedule ? schedule.schedule : []
        });

    } catch (error) {
        res.status(400).send({
            message: error.message,
            success: false
        });
    }
});

module.exports = router;