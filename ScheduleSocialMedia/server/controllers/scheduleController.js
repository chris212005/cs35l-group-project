const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const Schedule = require("../models/schedule");


// Save / Update Schedule
router.post("/save-schedule", authMiddleware, async (req, res) => {
  try {
    const { schedule } = req.body;

    // check if user already has schedule
    let existingSchedule = await Schedule.findOne({ userId: req.userId });

    if (existingSchedule) {
      // update existing
      existingSchedule.schedule = schedule;
      await existingSchedule.save();

      return res.send({
        message: "Schedule updated successfully",
        success: true,
        data: existingSchedule
      });
    }

    // create new schedule
    const newSchedule = new Schedule({
      userId: req.userId,
      schedule: schedule
    });

    await newSchedule.save();

    res.status(201).send({
      message: "Schedule saved successfully",
      success: true,
      data: newSchedule
    });

  } catch (error) {
    res.status(400).send({
      message: error.message,
      success: false
    });
  }
});


// Get Logged User Schedule
router.get("/get-user-schedule", authMiddleware, async (req, res) => {
  try {
    const schedule = await Schedule.findOne({ userId: req.userId });

    res.send({
      message: "Schedule fetched successfully",
      success: true,
      data: schedule
    });

  } catch (error) {
    res.status(400).send({
      message: error.message,
      success: false
    });
  }
});


// Delete Schedule
router.delete("/delete-schedule", authMiddleware, async (req, res) => {
  try {

    await Schedule.findOneAndDelete({ userId: req.userId });

    res.send({
      message: "Schedule deleted successfully",
      success: true
    });

  } catch (error) {
    res.status(400).send({
      message: error.message,
      success: false
    });
  }
});

module.exports = router;

// Get schedule of another user
router.get("/get-user-schedule/:userId", authMiddleware, async (req, res) => {
  try {

    const schedule = await Schedule.findOne({ userId: req.params.userId });

    res.send({
      message: "User schedule fetched successfully",
      success: true,
      data: schedule
    });

  } catch (error) {
    res.status(400).send({
      message: error.message,
      success: false
    });
  }
});