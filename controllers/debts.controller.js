var Debt = require('../models/debt.model');
var mongoose = require('mongoose');
var multer = require('multer');
var fs = require('fs');
var xlstojson = require("xls-to-json-lc");
var xlsxtojson = require("xlsx-to-json-lc");
var numeralize = require('numeralize-ru');

var debtController = {};

var getFilter = function(query) {

    var result = {
        имя: new RegExp(query.имя, "i"),
        фамилия: new RegExp(query.фамилия, "i")
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
    if(req.isAuthenticated()) { 
        res.render('debt-grid', {title: 'Реестр задолженностей', user: req.user});
     }
    res.redirect('login');
    
};

debtController.debtCreate = function(req, res) {

    var debt = new Debt(
        {
            имя: req.body.имя,
            фамилия: req.body.фамилия,
            задолженность: req.body.задолженность
        }
    );

    debt.save(function (err) {
        if (err) res.json(err.errors);
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

    var upload = multer({
        storage: multer.diskStorage({
            destination: function (req, file, cb) { cb(null, './uploads/') },
            filename: function (req, file, cb) {
                var datetimestamp = Date.now();
                cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
            }
        })
    }).single('file');
    
    upload(req, res, function(err) {

        var message = {};

        if(!req.file) {
            message.text = 'Ошибка! Файл не был выбран';
            message.status = 'bad';
            debtController._renderGrid(req, res, message);
            return;
        }

        var readableStreamInput = fs.createReadStream(req.file.path);
        exceltojson = debtController._selectExcelParser(req);
        
        if(typeof exceltojson == 'undefined') {
            message.text = 'Ошибка! Вы выбрали файл с неверным расширением. Выберите файл с расширением ".xls" или ".xlsx"';
            message.status = 'bad';
            fs.unlinkSync(readableStreamInput.path);
            debtController._renderGrid(req, res, message);
            return;
        }

        exceltojson({ input: req.file.path, output: null,lowerCaseHeaders: true }, function(err, data) {

            if (!data[0].hasOwnProperty('имя') || !data[0].hasOwnProperty('фамилия') || !data[0].hasOwnProperty('задолженность')) {
                    
                message.text = 'Ошибка чтения файла. Невозможно прочитать заголовки записей. Проверьте правильность заполнения согласно примера, доступного по ссылке ниже'
                message.status = 'bad';
                fs.unlinkSync(readableStreamInput.path);
                debtController._renderGrid(req, res, message);

            } else debtController._composeDebt(data, function(errCount) {
                
                if (errCount == 0) {
                    message.text = 'Вы успешно добавили ' + data.length 
                        +  numeralize.pluralize(data.length, ' запись', ' записи', ' записей');
                    message.status = 'good';
                } else {
                    var total = data.length - errCount;
                    message.text = 'Были добавлены не все записи . '  
                        + 'Вы успешно добавили ' + total
                        + numeralize.pluralize(total, ' запись', ' записи', ' записей') + ' из ' + data.length
                        + '. Проверьте правильность заполнения согласно примера, доступного по ссылке ниже';
                    message.status = 'bad'
                }
                fs.unlinkSync(readableStreamInput.path);
                debtController._renderGrid(req, res, message);
            })

        });

    });

}

debtController._renderGrid = function(req, res, message) {
    res.render('debt-grid', {
        title: 'Реестр задолженностей',
        user: req.user,
        message: message.text,
        messageStatus: message.status
    });
}

debtController._selectExcelParser = function(req) {

    if (req.file.originalname.match(/\.xls$/)) {
        return xlstojson;
    }
    if (req.file.originalname.match(/\.xlsx$/)) {
        return xlsxtojson;
    }

    return; 
}

debtController._composeDebt = function(data, callback) {
   
    var wrongLineCount = 0;
    Object.keys(data).forEach(current_key => {
        
        if (data[current_key]['имя'].trim() == "" || data[current_key]['фамилия'].trim() == "" || data[current_key]['задолженность'].trim() == "") {
            wrongLineCount ++; // count wrong entries
        } else {
            var debt = new Debt({
                имя: data[current_key]['имя'],
                фамилия: data[current_key]['фамилия'],
                задолженность: data[current_key]['задолженность'],
                _id: new mongoose.Types.ObjectId()
            });

            debt.save(function (err) {
                if (err) console.log(err);
            })
        }
    });

    callback(wrongLineCount);
};

module.exports = debtController;
