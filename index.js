// Importar dependencias
require('dotenv').config({path:'./.env'});
const connection = require('./src/database/connection')
const express = require('express')
const cors = require('cors')

// conexión a la Base de Datos
connection()

//Crear servidor Node
const app = express()
const PORT = process.env.PORT || 3000

// Configurar Cors
app.use(cors())

// Convertir los datos del body a json
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Cargar conf rutas
const UserRoutes = require('./src/routes/user')


app.use("/api/user", UserRoutes)



// Poner servidor a escuchar peticiones http
app.listen(puerto, () => {
    console.log('Servidor de node corriendo en el puerto '+ PORT)
})
