var Debt = require('../models/debt.model');
// const async = require('async');
const { wrap: async } = require('co');

exports.allDebts = function(req, res) {
    // MyModel.find(query, fields, { skip: 10, limit: 5 }, function(err, results) { ... });
    //res.render('debtlist', { title: 'Реестр задолженностей',});

    Debt.find({}, function(err, debts) {
        if(err) {
            res.send('something wrong');
            next();
        }
        //res.send(debts)
        //  res.json(debts);
        //console.log(typeof(debts));
        res.render('debtlist', {debts: debts})
    });
};

exports.debtCreate = function (req, res) {
    let debt = new Debt(
        {
            name: req.body.name,
            size: req.body.size,
            date: new Date(req.body.date)
        }
    );

    debt.save(function (err) {
        if (err) {
            console.log(err);
        }
        res.send('Запись долга успешно создана')
    })
};

exports.debtDetails = function (req, res) {
    Debt.findById(req.params.id, function (err, debt) {
        if (err) return err;
        res.send(debt);
    })
};

exports.debtUpdate = function (req, res) {
    Product.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, product) {
        if (err) return err;
        res.send('Запись долга обновлена');
    });
};

exports.debtDelete = function (req, res) {
    Product.findByIdAndRemove(req.params.id, function (err) {
        if (err) return err;
        res.send('запись долга удалена');
    })
};