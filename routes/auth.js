const router = require('express').Router();
const User = require('../model/User');
const { registerValidation, loginValidation } = require('../validate');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {

    // Validate data before sending the data
    const {error} = registerValidation(req.body);
    if (error) {
      // Return validation error to the client
      return res.status(400).send(error.details[0].message);
    }

    // Check if the user is already in the database
    const emailExists = await User.findOne({email: req.body.email});
    if (emailExists) {
      return res.status(400).send("Email Already Exists");
    }

    //hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create new user
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    try {
        const savedUser = await user.save();
        res.send({user: user._id, name: user.name, email: user.email});
    } catch (error) {
        res.send(error);
    }
});

router.post('/login', async (req, res) => {
    const { error } = loginValidation(req.body);
    if (error) {
      // Return validation error to the client
      return res.status(400).send(error.details[0].message);
    }
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {

      const validPass = await bcrypt.compare(
        req.body.password,
        userExists.password
      );
      if (!validPass) {
        return res.status(400).send("Invalid Password");
      } else {
        // Create and assign a token
        const token = jwt.sign({_id: userExists._id}, process.env.TOKEN_SECRET);
        res.header('auth-token', token).send(token);
        return res.status(400).send("User Exists! Logged In")
      }
    } else {
      return res.status(400).send("User Does Not Exist! Kindly Register");
    }
});


module.exports = router;