var express = require('express');
const { token } = require('morgan');
const router = express.Router();
const bankService = require('../services/bank.service');
const jwt = require('jsonwebtoken');

const jwtSecret = "secretkey#$&";
const authMiddleware = (req, res, next) => {
  try {
    console.log(req.headers);
    const token = req.headers.authorization.split(" ")[1];
    const user = jwt.verify(token, jwtSecret);
    req.user = user;
    next();
  } catch {
    res.status(401).send({ message: "Invalid token" });

  }
}
/* GET home page. */
router.get('/', function (req, res) {
  // const user = new User({

  //   acno: 1000,
  //   name: "ajay",
  //   balance: 1000,
  //   username: "userone",
  //   password: "testuser",
  //   history: [

  //   ]


  // })
  // user.save();


});

router.get('/users',authMiddleware, function (req, res) {
  bankService.getUsers()
  .then(users => {
    res.send(users);
  })

});

router.post('/login', function (req, res, next) {


  bankService.authenticateUser(req.body.username, req.body.password)
    .then(user => {
      if (user) {
        const token = jwt.sign({
          exp: Math.floor(Date.now() / 1000) + (60 * 60 * 5),
          username: req.body.username,
          _id:user._id
        }, jwtSecret);

        // const decoded = jwt.verify(token, jwtSecret);


        res.send({
          message: "logged in successful",
          token: token,

        });
      }
      else {
        res.status(422).send({
          message: "Invalid credentials"
        });
      }

    });


  
});
router.post('/deposit', authMiddleware, function (req, res) {
  bankService.deposit(req.user._id, req.body.amount)
  .then(message => {
    res.send(message);
  });

})
router.post('/withdraw', authMiddleware, function (req, res) {
  bankService.withdraw(req.user._id, req.body.amount)
    .then(message => {
      res.send(message);
    });

})



router.get('/history', authMiddleware, function (req, res) {

  bankService.getUser(req.user._id)
  .then(user => {
    res.send(user.history);
  });
  

});
router.get('/profile', authMiddleware, function (req, res) {

  bankService.getUser(req.user._id)
  .then(user => {
    res.send(user);
  });
 

});

router.patch("/profile",authMiddleware,function(req,res){
  bankService.updateUser(req.user._id, req.body)
  .then(user => {
    res.send({message:"Profile Updated Successfully"});
  });

})
router.patch("/enquiry/:id",function(req,res){
  
    res.send(req.params.id);
  });

module.exports = router;
