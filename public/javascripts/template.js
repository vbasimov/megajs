var json2csv = require('json2csv').parse;

exports.getTemplateFile = function(req, res) {
    
    var fields = [{
        'Имя': 'Алексей',
        'Фамилия': 'Алексеев',
        'Задолженность': '1000'
        }, {
        'Имя': 'Иван',
        'Фамилия': 'Иванов',
        'Задолженность': '520'
    }];
    
    var csv = json2csv(fields);
    
    res.set("Content-Disposition", "attachment;filename=Template.csv");
    res.set("Content-Type", "application/octet-stream");
    
    res.send(csv);
};