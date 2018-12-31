var mongoose = require('mongoose');
var Schema = mongoose.Schema;

let debtSchema = new Schema({
    Имя: {
        type: String,
        required: true,
        max:100
    },
    Фамилия: {
        type: String,
        required: true,
        max:100
    },
    Задолженность: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('Debt', debtSchema)