const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
  title: {type: String, required: true},
  notes: {type: String },
  label: {type: String , required: true},
  dueDate: {type: Date, required: true},
  dueDateString: {type: String},
  complete: {type: Boolean, default: false}
});

module.exports = mongoose.model('Task', taskSchema);
