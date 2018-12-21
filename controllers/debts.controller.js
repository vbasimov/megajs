var Debt = require('../models/debt.model');
// const async = require('async');
// const { wrap: async } = require('co');

var getClientFilter = function(query) {
    var result = {
        Name: new RegExp(query.Name, "i"),
    };

    return result;
};

exports.allDebts = function(req, res, next) {
    Debt.find({}, function(err, debts) {
        if(err) {
            res.send('something wrong');
            next();
        }    
        res.header("Cache-Control", "no-cache, no-store, must-revalidate");
        res.header("Pragma", "no-cache");
        res.header("Expires", 0);
        res.json(debts);
    });
};

exports.grid = function(req, res, next) {
    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", 0);
    res.render('debtlist', {title: 'Реестр задолженностей'})
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
    Debt.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, debt) {
        if (err) return err;
        res.send('Запись долга обновлена');
    });
};

exports.debtDelete = function (req, res) {
    Debt.findByIdAndRemove(req.params.id, function (err) {
        if (err) return err;
        res.send('запись долга удалена');
    })
};