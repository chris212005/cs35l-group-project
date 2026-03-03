const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  id: { 
    type: String, 
    required: true 
},
  title: { 
    type: String, 
    required: true 
},
  days: { 
    type:[String], // since it is an array, this will create _id in the database
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
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", unique: true },
    schedule: [classSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("schedules", scheduleSchema);