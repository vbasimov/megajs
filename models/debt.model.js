var mongoose = require("mongoose");
var Schema = mongoose.Schema;

let debtSchema = new Schema({
    name: {
        type: String,
        required: true,
        max:100
    },
    size: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
})

module.exports = mongoose.model('Debt', debtSchema)