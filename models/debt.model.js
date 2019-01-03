var mongoose = require('mongoose');
var Schema = mongoose.Schema;

let debtSchema = new Schema({
    имя: {
        type: String,
        required: true,
        max:100
    },
    фамилия: {
        type: String,
        required: true,
        max:100
    },
    задолженность: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('Debt', debtSchema)