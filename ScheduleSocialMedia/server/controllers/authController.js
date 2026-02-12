const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./../models/user');

router.post('/signup', async (req, res) => {
    try{
        //1. If the user already exists send an error message
        const user = await User.findOne({email: req.body.email});

        if(user){
            return res.status(400).send({
                message: 'User already exists.',
                success: false
            });
        }

        //2. If the user does not exist, encrypt the password (check the password is not empty first)

        if(!req.body.password || req.body.password.length < 8) {
            return res.send({
                message: 'Password must be at least 8 characters.',
                success: false
            });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        req.body.password = hashedPassword;

        //3. Create the new user, save in DB
        const newUser = new User(req.body);
        await newUser.save();

        res.status(201).send({
            message: 'User created successfully!',
            success: true
        })

    }catch(error){
        res.send({
            message: error.message,
            success: false
        });
    }
})

router.post('/login', async (req, res) => {
    try{
        //1. Check if the user exists
        const user = await User.findOne({email: req.body.email}).select('+password');
        if(!user){
            return res.status(400).send({
                message: 'User does not exist.',
                success: false
            })
        }

        //2. Check if the password is correct
        const isValid = await bcrypt.compare(req.body.password, user.password);
        if(!isValid){
            return res.status(400).send({
                message: 'Incorrect password.',
                success: false
            })
        }

        //3. If the user exists and password is correct, assign a JWT
        const token = jwt.sign({userId: user._id}, process.env.SECRET_KEY, {expiresIn: "1d"});

        res.send({
            message: 'User logged in successfully!',
            success: true,
            token: token
        });
    }catch(error){
        res.status(400).send({
            message: error.message,
            success: false
        })
    }
})

module.exports = router;

