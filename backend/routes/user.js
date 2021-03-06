const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const router = express.Router();

router.post('/signup', (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save()
        .then((result) => {
          res.status(201).json({
            message: 'User is created!',
            result: result
          });
        })
        .catch(err => {
          res.status(500).json({
            error: err
          });
        });
    });

});

router.post('/login', (req, res, next) => {
  let fetchedUser;
  User.find({email: req.body.email})
    .then(user => {
      console.log(user);
      if(!user) {
        return res.status(401).json({
          message: 'Auth failed!'
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user[0].password);
    })
    .then(result => {
      console.log(result);
      if(!result) {
        return res.status(401).json({
          message: 'Auth failed!'
        });
      }
      const token = jwt.sign(
        {email: fetchedUser.email, userId: fetchedUser._id},
        'stackhack_theme_1_task_manager',
        {expiresIn: '1h'}
      );
      res.status(200).json({
        token: token
      });
    })
    .catch(err => {
      console.log(err);
      return res.status(401).json({
        message: 'Auth failed!'
      });
    });
});




module.exports = router;
