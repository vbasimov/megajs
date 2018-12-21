$(function() {
  
    $("#jsGrid").jsGrid({

        height: "auto",
        width: "100%",
        filtering: false,
        //inserting: true,
        //editing: true,
        //sorting: true,
        paging: true,
        autoload: true,
        pageSize: 4,
        pageButtonCount: 5,
        deleteConfirm: "Do you really want to delete client?",
        controller: {
            loadData: function(filter) {
                
                return $.ajax({
                    type: "GET",
                    url: "/debts/api",
                    data: filter
                });

            },
           /* insertItem: function(item) {
                return $.ajax({
                    type: "POST",
                    url: "/debts",
                    data: item
                });
            },
            updateItem: function(item) {
                return $.ajax({
                    type: "PUT",
                    url: "/debts",
                    data: item
                });
            },*/
            deleteItem: function(item) {
                return $.ajax({
                    type: "DELETE",
                    url: "/debts/" + item["_id"] + "/delete",
                    data: item
                });
            }
        },
        fields: [
            { name: "name", optionName: "Имя", type: "text", width: 150, sorting: true},
            { name: "_id", type: "text", width: 50 },
            { name: "date", type: "date", width: 200 },
            { type: "control" }
        ]
    });
    
});
