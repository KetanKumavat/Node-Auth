const router = require('express').Router();
const User = require('../model/User');
const verify = require('./privateRoute');

router.get('/', verify , (req, res) => {
   res.send(req.user);
   User.findById(req.user._id);
});

module.exports = router;
