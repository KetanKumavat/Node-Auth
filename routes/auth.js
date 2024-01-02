const router = require('express').Router();
const User = require('../model/User');
const { registerValidation, loginValidation } = require('../validate');

router.post('/register', async (req, res) => {

    // Validate data before sending the data
    const {error} = registerValidation(req.body);
    if (error) {
      // Return validation error to the client
      return res.status(400).send(error.details[0].message);
    }
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    });
    try {
        const savedUser = await user.save();
        res.send(savedUser);
    } catch (error) {
        res.send(error);
    }
});

module.exports = router;