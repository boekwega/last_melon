var express = require('express');
var router = express.Router();
var expressSession = require('express-session');

var users = require('../controllers/users_controller');
console.log("before / Route");
router.get('/', function(req, res) {
  console.log("/ Route");
  //    console.log(req);
  console.log(req.session);
  if (req.session.user) {
    console.log("/ Route if user");
    res.render('index', {
      username: req.session.username,
      msg: req.session.msg,
      color: req.session.color
    });
  }
  else {
    console.log("/ Route else user");
    req.session.msg = 'Access denied!';
    res.redirect('/login');
  }
});


router.get('/user', function(req, res) {
  console.log("/user Route");
  if (req.session.user) {
    res.render('user', { msg: req.session.msg });
  }
  else {
    req.session.msg = 'Access denied!';
    res.redirect('/login');
  }
});
router.get('/signup', function(req, res) {
  console.log("/signup Route");
  if (req.session.user) {
    res.redirect('/');
  }
  res.render('signup', { msg: req.session.msg });
});
router.get('/login', function(req, res) {
  console.log("/login Route");
  if (req.session.user) {
    res.redirect('/');
  }
  res.render('login', { msg: req.session.msg });
});
router.get('/logout', function(req, res) {
  console.log("/logout Route");
  req.session.destroy(function() {
    res.redirect('/login');
  });
});
router.post('/signup', users.signup);
router.post('/user/update', users.updateUser);
router.post('/user/delete', users.deleteUser);
router.post('/login', users.login);
router.get('/user/profile', users.getUserProfile);

var mongoose = require('mongoose');
var Quote = mongoose.model('Quote');
//we aren't giving users access to the post route,
// so we don't verify authentication in the post route.
router.post('/quotes', function(req, res, next) {
  var quote = new Quote(req.body);
  quote.save(function(err, quote) {
    if (err) { return next(err); }
    res.json(quote);
  });
});

router.get('/quotes', function(req, res, next) {
  console.log("/quotes route");
  if (req.session.user) {
    console.log("authenticated");
    Quote.find(function(err, quotes) {
      if (err) { return next(err); }
      console.log(quotes);
      res.json(quotes);
    });
  }
})

router.param('quote', function(req, res, next, id) {
  Quote.findById(id, function (err, quote){
    if (err) { return next(err); }
    if (!quote) { return next(new Error("can't find quote")); }
    req.quote = quote;
    return next();
  });
});

router.delete('/quotes/:quote', function(req, res) {
  console.log("in Delete");
  req.quote.remove();
  res.sendStatus(200);
});

module.exports = router;
