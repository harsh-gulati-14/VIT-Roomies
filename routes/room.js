var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');
var path = require('path');
var vCardsJS = require('vcards-js');

// room details
router.post('/edit', async (req, res) => {
    try {
        if (!req.user) {
            res.redirect('/');
        }
        else {
            var user_roomno = req.user.roomno;
            var user_block = req.user.block;
            var room = await Room.findOne({ roomno: user_roomno, block: user_block });
            room.whatsapp = req.body.link;
            await room.save();
            res.redirect('/');
        }
    }
    catch (err) {
        res.redirect('/error');
    }
});


router.get('/download', async (req, res) => {
    try {
        var vCard = vCardsJS();
        var room = await Room.findOne({ roomno: req.user.roomno, block: req.user.block });
        var users = []
        for (let mem of room.members) {
            var user = await User.findOne({ _id: mem });
            users.push(user);
        }
        var vCardString;
        for (let part of users) {
            vCard.firstName = part.name + " " + part.block + "-" + part.roomno;
            vCard.organization = 'Room Partner';
            vCard.workPhone = part.phoneNum;
            vCard.getFormattedString();
            vCardString += '\n' + vCard.getFormattedString();
        }
        res.set('Content-Type', 'text/vcard; name="Room Partners.vcf"');
        res.set('Content-Disposition', 'inline; filename="Room Partners.vcf"');

        //send the response
        res.send(vCardString);
    }
    catch (err) {
        res.redirect('/error');
    }
});
// search friends
router.get('/friends', async (req, res) => {
    try {
        if (!req.user) {
            res.redirect('/');
        }
        else {
            res.render('findyourfriend', { title: "Find Your Friends!" });
        }
    }
    catch (err) {
        res.redirect('/error');
    }
})

router.get('/search/:q', async (req, res) => {
    try {
        var q = req.params.q;
        try {
            const users = await User.find({ regNum: RegExp(q, 'i'), isVerified: true }, {}).select('regNum name');
            res.status(200).json(users);
        }
        catch (e) {
            const users = [];
            res.status(200).json(users);
        }
    }
    catch (err) {
        res.status(500).json({});
    }
});

router.get('/getdetails/:id', async (req, res) => {
    try {
        var q = req.params.id;
        const user = await User.findOne({ _id: mongoose.Types.ObjectId(q), isVerified: true }).select('roomno block');
        res.status(200).json(user);
    }
    catch (err) {
        res.status(500).json({});
    }
});

// Adding Room essentials
router.get('/essentials', async (req, res) => {
    try {
        if (!req.user) {
            res.redirect('/');
        }
        else {
            res.render('essentials', { title: "Room Essentials" });
        }
    }
    catch (err) {
        res.redirect('/error');
    }
})

module.exports = router;