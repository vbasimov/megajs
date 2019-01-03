var express = require('express');
var router = express.Router();
var json2xls = require('json2xls');
router.use(json2xls.middleware);

var template = require('../public/javascripts/template.js');

router.get('/template', template.getTemplateFile);

module.exports = router;