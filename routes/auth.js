const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../model/User');
const { registerValidation, loginValidation } = require('../validation');



router.post('/register', async (req, res) => {

    // Validate data
    const {error} = registerValidation(req.body);
    if(error) 
        return res.status(400).send(error.details[0].message);

    // Check existing
    const emailExist  = await User.findOne({email:req.body.email});
    if(emailExist)
        return res.status(400).send('Email already exists');

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword,
    });

    try{
        const savedUser = await user.save();
        res.send({name:user.name});
    }catch(err){
        res.status(400).send(err);
    }
});

router.post('/login', async (req, res) => {
    // Validate data
    const {error} = loginValidation(req.body);
    if(error) 
        return res.status(400).send(error.details[0].message);

    // Check existance
    const user  = await User.findOne({email:req.body.email});
    if(!user)
        return res.status(400).send('User doesnt exist');
    
    // Check Password
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass)
        return res.status(400).send('Invalid Password');

    // Create and assign a token
    const token = jwt.sign(
        {_id: user._id},
        process.env.TOKEN_SECRET
    );

    res.header('auth-token', token).send(token);

});


module.exports = router;