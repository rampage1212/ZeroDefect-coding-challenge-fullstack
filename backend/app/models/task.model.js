const mongoose = require("mongoose");

const User = mongoose.model(
  "Task",
  new mongoose.Schema({
    title: String,
    description: String,
    content: String,
    taskimage: String,
  })
);

module.exports = User;
