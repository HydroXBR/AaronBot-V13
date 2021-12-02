const {Schema, model} = require("mongoose");

const schema = Schema({
    _id: { type: String, required: true },
    channelSuggestions: { type: String, default: "" },
    ticketRole: { type: String, default: false },
    advs: { type: Array, default: [] },
})

module.exports = model('Gerency', schema)