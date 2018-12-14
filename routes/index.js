var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('Inside the homepage callback function')
  console.log(req.sessionID)
  res.render('index', { title: 'Реестр задолженностей' });
});

module.exports = router;
