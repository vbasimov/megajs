var express = require('express');
var router = express.Router();

var auth = require('../controllers/auth.controller.js');
var template = require('../public/javascripts/template.js');

router.get('/', auth.home);

router.get('/register', auth.register);

router.post('/register', auth.doRegister);

router.get('/login', auth.login);

router.post('/login', auth.doLogin);

router.get('/logout', auth.logout);

router.get('/template', template.getTemplateFile);

module.exports = router;