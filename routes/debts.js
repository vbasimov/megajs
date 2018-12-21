var express = require('express');
var router = express.Router();

const debtController = require('../controllers/debts.controller');

router.get('/', debtController.grid);
router.post('/api', debtController.allDebts);
router.post('/create', debtController.debtCreate);
router.put('/:id/update', debtController.debtUpdate);
router.delete('/:id/delete', debtController.debtDelete);

module.exports = router;