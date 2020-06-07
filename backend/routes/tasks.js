const express = require('express');

const Task = require('../models/task');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();


router.post('',
  checkAuth, (req, res, next) => {
  const task = new Task(req.body);
  task.save().then((result) => {
    res.status(201).json({
      message: 'Task added successfully!',
      taskId: result._id
    });
  });
  console.log(task);

});

router.get('', (req, res, next) => {

  Task.find()
    .then((results) => {
      res.status(200).json({
        message: 'Tasks fetched successfully!',
        data: results
      });
    });

});

router.get('/:id', ( req, res, next) => {
  Task.findOne({_id: req.params.id})
    .then(result => {
      res.send(200).json({
        message: 'Task fetched successfully',
        data: result
      });
    });
});

router.delete('/:id', checkAuth, (req, res, next) => {
  console.log(req.params.id);
 Task.deleteOne({_id: req.params.id})
  .then((result) => {
    res.status(200).json({
      message: 'Task deleted successfully!'
    });
  });

});

router.put('/:id', checkAuth, (req, res, next) => {
  const task = req.body;
  Task.updateOne({_id: req.params.id}, task)
    .then((result) => {
      res.status(200).json({
        message: 'Task updated successfully!'
      });
    });
});

module.exports = router;
