var express = require("express");
var app = express();

app.get("/", function(req, res) {
    res.send ("<div>HOLA</div>");
});

app.get("*", function(req, res){
    res.send ("<h1>Attention! Wrong URL</h1>")
});

app.listen(3000, function(){
    console.log("server works fine on port 3000");
});
