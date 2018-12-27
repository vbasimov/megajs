$(function() {
    $('#jsGrid').jsGrid({
        height: 'auto',
        width: '100%',

        filtering: true,
        inserting: true,
        editing: true,
        sorting: true,
        paging: true,
        autoload: true,

        pageSize: 10,
        pageButtonCount: 3,
        deleteConfirm: 'Вы действительно хотите удалить запись?',
        
        controller: {
            loadData: function(filter) {
                return $.ajax({
                    type: 'GET',
                    url: '/debts/api',
                    data: filter,
                });
            },
            insertItem: function(item) {
                return $.ajax({
                    type: 'POST',
                    url: '/debts/create',
                    data: item, 
                });
            },
            updateItem: function(item) {
                return $.ajax({
                    type: 'PUT',
                    url: '/debts/' + item['_id'] + '/update',
                    data: item
                });
            },
            deleteItem: function(item) {
                return $.ajax({
                    type: 'DELETE',
                    url: '/debts/' + item['_id'] + '/delete',
                    data: item
                });
            }
        },
        fields: [
            { name: 'Имя', type: 'text', width: 100},
            { name: 'Фамилия', type: 'text', width: 100},
            { name: 'Задолженность', type: 'number', align: 'center', filtering: false},
            { type: 'control' }
        ]
    });
});
