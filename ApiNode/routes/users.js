var express = require('express');
var router = express.Router();
var User = require('../modelos/user');
var passport = require('passport');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/',(req,res,next)=>
{
  console.log('entro');
  User.register(new User({username: req.body.username},req.body.password,(err,itm)=>
  {
    if(err)
    {
      console.log('err');
      res.statusCode = 500;
      res.setHeader('Content-Type','application/json');
      res.json({err:err});
      res.send();
    }
    else{
      console.log('no error');
      passport.authenticate('local')(req,res,()=>
      {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json({status:'Registration Sucessful',Success:true});
       
      });
    }
})).catch(req, res, err)
{
  res.json({err:err});
  res.send();
}



  
});

module.exports = router;
