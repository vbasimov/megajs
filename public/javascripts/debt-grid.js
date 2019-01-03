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
            { name: 'имя', type: 'text', width: 100},
            { name: 'фамилия', type: 'text', width: 100},
            { name: 'задолженность', type: 'number', align: 'center', filtering: false},
            { type: 'control' }
        ]
    });
});

$(document).on('click', '.browse', function(){
    var file = $(this).parent().parent().parent().find('.file');
    file.trigger('click');
  });

$(document).on('change', '.file', function(){
    $(this).parent().find('.form-control').val($(this).val().replace(/C:\\fakepath\\/i, ''));
    if(typeof (message) !== 'undefined'){
        message = {};
    }
    this.form.submit();
});
 
function hideSuccessMessage() {
    var x = document.getElementById("alert-ok");
      x.style.display = "none";
}

function hideErrMessage() {
    var x = document.getElementById("alert-err");
      x.style.display = "none";
}