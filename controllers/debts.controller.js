var Debt = require('../models/debt.model');
var csv = require('fast-csv');
var mongoose = require('mongoose');
var multer = require('multer');
var fs = require('fs');
var numeralize = require('numeralize-ru');

var debtController = {};

var getFilter = function(query) {

    var result = {
        Имя: new RegExp(query.Имя, "i"),
        Фамилия: new RegExp(query.Фамилия, "i")
    };

    return result;

};

debtController.allDebts = function(req, res, next) {

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

debtController.grid = function(req, res, next) {

    req.session.returnTo = 'debts';
    if(req.isAuthenticated()){ 
        res.render('debt-grid', {title: 'Реестр задолженностей', user: req.user});
     }
    res.redirect('login');
    
};

debtController.debtCreate = function(req, res) {

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

debtController.debtUpdate = function(req, res) {

    Debt.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true}, function (err, debt) {
        if (err) return err;
        res.json(debt)
    });

};

debtController.debtDelete = function(req, res) {

    Debt.findByIdAndRemove(req.params.id, function (err) {
        if (err) return err;
        res.send('Запись удалена');
    })

};

debtController.bulkUpload = function(req, res) {

    var storage = multer.diskStorage({
       
        destination: function (req, file, cb) {
            cb(null, './uploads/')
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
        }

    });
    
    var upload = multer({storage: storage}).single('file');
    upload(req, res, function(err){
        var readableStreamInput = fs.createReadStream(req.file.path);
        if(!req.file){
            err = 'Ошибка! Файл не был выбран';
        }

        if (!req.file.originalname.match(/\.csv$/)) {
            err = 'Ошибка! Вы выбрали файл с неверным расширением. Выберите файл с расширением ".csv"';
        }

        if(err){

            fs.unlinkSync(readableStreamInput.path);
            res.render('debt-grid', {
                title: 'Реестр задолженностей',
                user: req.user,
                message: err,
                messageStatus: 'bad'
            });
            return;

        }

        var debts = [];

        csv
        .fromStream(readableStreamInput, {headers: true, ignoreEmpty: true})
        .on("data", function(data){
            var rowData = {};

            Object.keys(data).forEach(current_key => {
                rowData[current_key] = data[current_key]
            });
            data['_id'] = new mongoose.Types.ObjectId();  
            debts.push(rowData);

        })
        
        .on("end", function(){

            var message = ' ';
            fs.unlinkSync(readableStreamInput.path);
            var errorCount = 0;
                
            Debt.create(debts, function(err, documents, next) {
                
                if (err) {
                    errorCount = Object.keys(err.errors).length;
                };    

                if (debts.length > 0 && errorCount == 0) {
                    message = 'Вы успешно добавили '
                        + debts.length 
                        + ' '
                        +  numeralize.pluralize(debts.length, 'запись', 'записей', 'записей');
                    messageStatus = 'good'
                } else {
                    var total = debts.length - errorCount;
                    message = 'Произошла ошибка чтения файла. Не все записи были добавлены. '
                        + 'Вы успешно добавили '
                        + total
                        + ' '
                        +  numeralize.pluralize(total, 'запись', 'записей', 'записей')
                        + ' из ' + debts.length + '. Проверьте правильность заполнения согласно примера, доступного по ссылке ниже';
                    messageStatus = 'bad'
                }
                
                res.render('debt-grid', {
                    title: 'Реестр задолженностей',
                    user: req.user,
                    message: message,
                    messageStatus: messageStatus
                });
        
            return;

            });
        });

    });

}

module.exports = debtController;
