var express = require('express');
var router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    if (req.user) {
      if (req.user.isVerified) {
        var room = await Room.findOne({ roomno: req.user.roomno, block: req.user.block });
        var users = []
        for (let mem of room.members) {
          var user = await User.findOne({ _id: mem });
          users.push(user);
        }
        var link = room.whatsapp;
        if (link == undefined) {
          if (req.user.flag == false) {
            if(req.user.gender == "M") {
              res.render('index', { title: 'VIT - Roomies', data: users, show: 1, leave: 1, bl : req.user.block });
            }
            else {
              res.render('index', { title: 'VIT - Roomies', data: users, show: 1, leave: 1, bl : req.user.block.slice(0, -1) });
            }
          }
          else {
            if(req.user.gender == "M") {
              res.render('index', { title: 'VIT - Roomies', data: users, leave: 1, bl : req.user.block });
            }
            else {
              res.render('index', { title: 'VIT - Roomies', data: users, leave: 1, bl : req.user.block.slice(0, -1) });
            }
          }
        }
        else {
          if (req.user.flag == false) {
            if(req.user.gender == "M") { 
              res.render('index', { title: 'VIT - Roomies', data: users, show: 1, leave: 1, wa: link, bl : req.user.block });
            }
            else {
              res.render('index', { title: 'VIT - Roomies', data: users, show: 1, leave: 1, wa: link, bl : req.user.block.slice(0, -1) });
            }
          }
            
          else {
            if(req.user.gender == "M") { 
              res.render('index', { title: 'VIT - Roomies', data: users, leave: 1, wa: link, bl : req.user.block });
            }
            else {
              res.render('index', { title: 'VIT - Roomies', data: users, leave: 1, wa: link, bl : req.user.block.slice(0, -1) });
            }
          }
        }
      }
      else {
        if (req.user.regNum != undefined) {
          if (req.user.gender == "M") {
            res.render('detailsM', { title: "Room Details", male: 1 });
          }
          else {
            res.render('detailsM', { title: "Room Details" });
          }
        }
        else {
          res.render('details', { title: 'User Details' });
        }
      }
    }
    else {
      res.redirect('/users/auth/google');
    }
  }
  catch (err) {
    res.redirect('/error');
  }
});


router.get('/maps', async (req, res, next) => {
  if (!req.user) {
    res.redirect('/');
  }
  else {
    if (req.user.gender == "M") {
      res.render('map', { title: "Explore VIT", male: 1 });
    }
    else {
      res.render('map', { title: "Explore VIT" });
    }
  }
});


router.get('/contact', async (req, res) => {
  try {
    res.render('contact', { layout: 'empty', title: "Contact Us" });
  }
  catch (err) {
    res.redirect('/error');
  }
})

router.get('/knowus', async (req, res) => {
  try {
    res.render('know', { title: "Know Us" });
  }
  catch (err) {
    res.redirect('/error');
  }
})

router.get('/error', async (req, res) => {
  res.render('error', { title: "Error" });
})



// router.get('/testing', async (req, res) => {
//   var uslen = await User.find({ gender : "F" });
//   for (let u of uslen) {
//     if(u.roomno == undefined || u.block == undefined) continue;
//     var user = await User.findOne({ _id: u._id });
//     var room = await Room.findOne({ roomno: u.roomno, block: u.block })
//     if(room == null) {
//       user.roomno = "";
//       user.block = "";
//       await user.save();
//       continue;
//     }

//     var temp = []
//     for (let mem of room.members) {
//       if (mem.toString() != user._id.toString()) {
//         temp.push(mem);
//       }
//     }
//     if (temp.length > 0) {
//       room.members = temp;
//       room.filled = room.filled - 1;
//       await room.save();
//     }
//     else {
//       await Room.deleteOne({ roomno: u.roomno, block: u.block });
//     }

//     user.isVerified = false;
//     user.roomno = "";
//     user.block = "";
//     user.flag = false;
//     await user.save();
//   }
//   res.status(200).json({"Msg" : "Ho gaya"});
// })

module.exports = router;
