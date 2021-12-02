const {Schema, model} = require("mongoose");

const schema = Schema({
    _id: { type: String, required: true },
    news: { type: Array, default: [] },
    tech: { type: Array, default: [] },
    users: { type: Array, default: [] },
    globalcommands: { type: Number, default: 0 }
})

module.exports = model('System', schema)