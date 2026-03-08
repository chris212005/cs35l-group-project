const router = require('express').Router();
const User = require('./../models/user');
const authMiddleware = require('./../middlewares/authMiddleware');

//GET Details of current logged-in user
router.get('/get-logged-user', authMiddleware, async (req, res) => {
    try{
        const user = await User.findOne({_id: req.userId});

        res.send({
            message: 'User fetched successfully!',
            success: true,
            data: user
        });
    }catch(error){
        res.status(400).send({
            message: error.message,
            success: false
        })
    }
})

router.get('/get-all-users', authMiddleware, async (req, res) => {
    try{
        const userid = req.userId;
        const allUsers = await User.find({_id: {$ne: userid}});

        res.send({
            message: 'All users fetched successfully!',
            success: true,
            data: allUsers
        });
    }catch(error){
        res.status(400).send({
            message: error.message,
            success: false
        })
    }
})


// Update logged-in user's profile (bio, profilePic)
router.put('/update-profile', authMiddleware, async (req, res) => {
    try{
        const { profilePic, bio } = req.body;
        console.log('update-profile called by userId=', req.userId);
        console.log('payload keys=', Object.keys(req.body));

        const user = await User.findById(req.userId);
        if(!user) {
            return res.status(404).send({ message: 'User not found', success: false });
        }

        if (typeof profilePic !== 'undefined') {
            user.profilePic = profilePic;
            console.log('setting profilePic, length=', String(profilePic || '').length);
        }
        if (typeof bio !== 'undefined') {
            user.bio = bio;
            console.log('setting bio=', bio && bio.substring(0,80));
        }

        await user.save();
        console.log('profile saved for user._id=', user._id);

        res.send({ message: 'Profile updated', success: true, data: user });
    }catch(error){
        res.status(400).send({ message: error.message, success: false });
    }
})

module.exports = router;