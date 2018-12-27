var Debt = require('../models/debt.model');

var getFilter = function(query) {
    var result = {
        Имя: new RegExp(query.Имя, "i"),
        Фамилия: new RegExp(query.Фамилия, "i"),
    };
    return result;
};

exports.allDebts = function(req, res, next) {
    Debt.find(getFilter(req.query), function(err, debts) {
        if(err) {
            res.send('Что-то пошло не так ' + err);
            next();
        }    
        res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.header('Pragma', 'no-cache');
        res.header('Expires', 0);
        res.json(debts);
    });
};

exports.grid = function(req, res, next) {
    req.session.returnTo = 'debts';
    if(req.isAuthenticated()){ 
        res.render('debt-grid', {title: 'Реестр задолженностей', user: req.user});
    }
    res.redirect('login');
};

exports.debtCreate = function (req, res) {
    let debt = new Debt(
        {
            Имя: req.body.Имя,
            Фамилия: req.body.Фамилия,
            Задолженность: req.body.Задолженность
        }
    );
    debt.save(function (err) {
        if (err) return err;
        res.json(debt)
    })
};

exports.debtUpdate = function (req, res) {
    Debt.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true}, function (err, debt) {
        if (err) return err;
        res.json(debt)
    });
};

exports.debtDelete = function (req, res) {
    Debt.findByIdAndRemove(req.params.id, function (err) {
        if (err) return err;
        res.send('Запись удалена');
    })
};