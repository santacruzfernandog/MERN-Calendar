const express = require('express');
const { dbConnection } = require('./database/config');
const cors = require('cors')
require('dotenv').config() // Para poder utilizar las variables de entorno (npm i dotenv) .env


// Crear el servidor de express
const app = express();

// Base de datos
dbConnection();

// CORS
app.use( cors() )


// Consigurar directorio publico y mostrarlo
app.use( express.static('public') )


// Lectura y parseo del body
app.use( express.json() )


// Rutas (routes)
// Auth: crear, login, renew
app.use('/api/auth', require('./routes/auth'))

// CRUD: eventos
app.use('/api/events', require('./routes/events'))



// Escuchar peticiones
app.listen( process.env.PORT , () => {
    console.log(`Servidor corriendo en puerto ${process.env.PORT}`)
})