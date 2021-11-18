const { Schema, model } = require('mongoose')


const UsuarioSchema = Schema({ // Simula una Clase, del que luego crearemos instancias
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})


module.exports = model('Usuario', UsuarioSchema)