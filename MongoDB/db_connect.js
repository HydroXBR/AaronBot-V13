const { connect } = require("mongoose");

module.exports = () => {
    connect('mongodb+srv://psy1518:<aaron5209#>@cluster0.w4fuw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log("Banco de dados foi conectado com sucesso!")
    }).catch(() => {
        console.error("Ocorreu um erro ao tentar conectar ao banco de dados.")
    });
}
