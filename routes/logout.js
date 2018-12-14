var express = require('express');
var passport = require('passport');
var router = express.Router();

router.get('/', function(req, res) {
  if (req.session) {
    // delete session object
    req.session.destroy(function(err) {
      if(err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});

module.exports = router;
