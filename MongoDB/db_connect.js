const { connect } = require("mongoose");

module.exports = () => {
    connect('LINK', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log("Banco de dados foi conectado com sucesso!")
    }).catch(() => {
        console.error("Ocorreu um erro ao tentar conectar ao banco de dados.")
    });
}