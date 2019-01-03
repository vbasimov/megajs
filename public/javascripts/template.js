
exports.getTemplateFile = function(req, res) {
    
    var jsonArr = [{
        'Имя': 'Алексей',
        'Фамилия': 'Алексеев',
        'Задолженность': 1000
    }, {
        'Имя': 'Иван',
        'Фамилия': 'Иванов',
        'Задолженность': 520
    }];

    res.xls('Template.xlsx', jsonArr);
}