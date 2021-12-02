const {Schema, model} = require("mongoose");

const schema = Schema({
    _id: { type: String, required: true },
    money: { type: Number, default: 0 },
    papel_parede: { type: Number, default: 1 },
    papeis_conta: { type: Number, default: 1 },
    profissao: { type: String, default: undefined },
    especialidade: { type: String, default: undefined },
    objetos: { type: Array, default: [] },
    carros:{ type: Array, default: [] },
    latest_daily: { type: String, default: undefined },
    latest_work: { type: String, default: undefined },
    level: { type: Number, default: 1 },
    xp: { type: Number, default: 0 },
    gemas: { type: Number, default: 0 }
})

module.exports = model('Economia', schema)