
exports.getTemplateFile = function(req, res) {
    
    var jsonArr = [{
        'имя': 'Алексей',
        'фамилия': 'Алексеев',
        'задолженность': 1000
    }, {
        'имя': 'Иван',
        'фамилия': 'Иванов',
        'задолженность': 520
    }];

    res.xls('Template.xlsx', jsonArr);
}