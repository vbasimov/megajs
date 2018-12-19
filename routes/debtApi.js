var express = require('express');
var router = express.Router();

const debtController = require('../controllers/debtApi.controller');

router.get('/all', debtController.allDebts);
router.post('/create', debtController.debtCreate);
router.get('/:id', debtController.debtDetails);
router.put('/:id/update', debtController.debtUpdate);
router.delete('/:id/delete', debtController.debtDelete);

module.exports = router;