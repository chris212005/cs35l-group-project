const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
},
  day: { 
    type: String, 
    required: true 
},
  start: { 
    type: String, 
    required: true 
},
  end: { 
    type: String, 
    required: true 
},
});

const scheduleSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", unique: true },
    schedule: [classSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("schedules", scheduleSchema);