var express = require('express');
var bodyParser=require('body-parser');
var User=require('../models/user');
var passport = require('passport');
var authenticate=require('../authenticate');

var router = express.Router();
router.use(bodyParser.json());
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', function(req, res, next) {
  User.register(new User({username: req.body.username}), req.body.password, (err, user)=>{
    if(err){
      res.statusCode=500;
      res.setHeader('Content-Type','application/json')
      res.json({err:err})
    }
    else{
      if(req.body.firstname)
        user.firstname=req.body.firstname
      if(req.body.lastname)
        user.firstname=req.body.lastname
      user.save((err, user)=>{
        if(err){
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err: err});
          return ;
        }
        else{
          passport.authenticate('local')(req,res ,()=>{
            res.statusCode=200;
            res.setHeader('Content-Type','application/json')
            res.json({success: true,status: 'registration successful'})
          })
        }
      })
    }
  })
})

router.post('/login', passport.authenticate('local'), (req, res) =>{

  var token=authenticate.getToken({_id: req.user._id});
  res.statusCode=200;
  res.setHeader('Content-Type','application/json');
  res.json({success: true,token: token, status: 'you aree logged in'});
})

router.get('/logout',(req,res)=>{
  if(req.session){
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else{
    var err=new Error('you are not logged in');
    err.status=403;
    next(err);
  }
});

module.exports = router;
