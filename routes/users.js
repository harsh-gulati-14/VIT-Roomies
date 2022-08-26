var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.TWILIO_SENDGRID_API_KEY)

// Authentication 
router.get('/auth/fail', async (req, res, next) => {
    res.render('error', { title: "Error" });
});

router.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/users/auth/fail' }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    });


router.get('/logout', async (req, res) => {
    if (req.user) {
        var user = await User.findOne({ _id: req.user._id });
        user.flag = false;
        await user.save();
        req.logout();
    }
    res.redirect('/');
});



// Adding Room Details
router.post('/register', async (req, res) => {
    try {
        if (!req.user) {
            res.redirect('/');
        }
        else {
            if (req.user.isVerified == true) {
                res.redirect('/');
            }
            else {
                var user = await User.findOne({ _id: req.user._id });
                user.gender = req.body.gender;
                user.phoneNum = req.body.phoneNum;
                user.regNum = req.body.regNum;
                await user.save();

                res.redirect('/');
            }
        }
    }
    catch (err) {
        res.redirect('/');
    }
})


router.post('/roomdetails', async (req, res) => {
    try {
        if (!req.user) {
            res.redirect('/');
        }
        else {
            if (req.user.isVerified == true) {
                res.redirect('/');
            }
            else {
                var user = await User.findOne({ _id: req.user._id });
                user.roomno = req.body.roomno;
                user.block = req.body.block;
                user.isVerified = true;
                await user.save();

                var room = await Room.findOne({ roomno: req.body.roomno, block: req.body.block });
                if (room) {
                    var member = room.members;
                    member.push(user._id);
                    room.members = member;
                    room.filled = room.filled + 1;

                    await room.save();

                    var mates = [];
                    for (let mem of room.members) {
                        var u = await User.findOne({ _id: mem });
                        if (u.email != req.user.email)
                            mates.push(u.email);
                    }
                    const msg = {
                        to: mates,
                        from: 'help.vitroomies1@gmail.com',
                        subject: 'Updates on Your Hostel Room!',
                        html: `<h1>Hello, User!</h1>
                  <h2>A new user has been added in your Room `+ req.body.block + `-` + req.body.roomno + `.</h2>
                  <h2>Visit https://vit-roomies.herokuapp.com to welcome `+ user.name + `.</h2>
                  <h4>Thank You</h4><h4>VIT-Roomies Team</h4>`
                    }
                    sgMail
                        .send(msg)
                        .then(() => {
                            console.log('Email sent');
                            res.redirect('/');
                        })
                        .catch((error) => {
                            res.redirect('/');
                        })
                }
                else {
                    var new_room = new Room({ roomno: req.body.roomno, block: req.body.block, filled: 1, members: [user._id] });
                    await new_room.save();
                    res.redirect('/');
                }
            }
        }
    }
    catch (err) {
        res.redirect('/');
    }
})


router.get('/updateflag', async (req, res) => {
    try {
        if (req.user) {
            var user = await User.findOne({ _id: req.user._id });
            user.flag = true;
            await user.save();
        }
        res.status(200).json({ "message": "updated" });
    }
    catch (err) {
        res.redirect('/');
    }
})

router.get('/leaveroom', async (req, res) => {
    try {
        var user = await User.findOne({ _id: req.user._id });
        var room = await Room.findOne({ roomno: req.user.roomno, block: req.user.block })

        var temp = []
        for (let mem of room.members) {
            if (mem.toString() != user._id.toString()) {
                temp.push(mem);
            }
        }
        if (temp.length > 0) {
            room.members = temp;
            room.filled = room.filled - 1;
            await room.save();
        }
        else {
            await Room.deleteOne({ roomno: req.user.roomno, block: req.user.block });
        }

        user.isVerified = false;
        user.roomno = "";
        user.block = "";
        user.flag = false;
        await user.save();
        res.redirect('/');
    }
    catch (err) {
        res.redirect('/');
    }
})

module.exports = router;