// Importar dependencias y módulos
const bcrypt = require("bcrypt")
const Pagination = require("mongoose-pagination")
const fs = require("fs")
const path = require("path")

// Importar modelos
const User = require("../models/user")

// Importar servicios
const jwt = require("../services/jwt")

// Registrar de usuarios
const register = (req, res) => {
    // Recoger datos de la petición
    let params = req.body

    // Comprobar que me llegan bien (+ validación)
    if (!params.name || !params.email || !params.password) {
        return res.status(400).json({
            status: "error",
            message: "Faltan datos por enviar",
        })
    }
    //trasformar el texto en minúscula
    params.email = params.email.toLowerCase()
    params.name = params.name.toLowerCase()

    // Control usuarios duplicados
    User.find({
        $or: [{ email: params.email }],
    }).exec(async (error, users) => {
        if (error) {
            return res.status(500).json({
                status: "error",
                message: "Error en la consulta de usuarios",
            })
        }

        if (users && users.length >= 1) {
            return res.status(200).send({
                status: "success",
                message: "El usuario ya existe",
            })
        }

        // Cifrar la contraseña
        let pwd = await bcrypt.hash(params.password, 10)
        params.password = pwd
        // Crear objeto de usuario
        let NewUser = new User(params)

        // Guardar usuario en la Base de Datos
        NewUser.save((error, userStored) => {
            if (error || !userStored)
                return res.status(500).send({
                    status: "error",
                    message: "Error al guardar el usuario",
                })

            // Eliminar password de la petición
            userStored.toObject()
            delete userStored.password

            // Devolver resultado
            return res.status(200).json({
                status: "success",
                message: "Usuario registrado correctamente",
                user: userStored,
            })
        })
    })
} //fin del register

// Login de usuarios
const login = (req, res) => {
    // Recoger datos de la petición
    let params = req.body

    // verificar que me llegan email y password
    if (!params.email || !params.password) {
        return res.status(400).send({
            status: "error",
            message: "Faltan datos por enviar",
        })
    }

    //trasformar el texto en minúscula
    params.email = params.email.toLowerCase()

    // Buscar en la Base de Datos si existe
    User.findOne({ email: params.email })
        //.select({ password: 0 })
        .exec((error, user) => {
            if (error || !user)
                return res
                    .status(404)
                    .send({ status: "error", message: "No existe el usuario" })

            // Comprobar contraseña
            const pwd = bcrypt.compareSync(params.password, user.password)

            if (!pwd) {
                return res.status(400).send({
                    status: "error",
                    message: "No te has identificado correctamente",
                })
            }

            // Conseguir Token
            const token = jwt.createToken(user)

            // Devolver Datos del usuario
            return res.status(200).send({
                status: "success",
                message: "Te has identificado correctamente",
                user: {
                    id: user._id,
                    name: user.name,
                    nick: user.nick,
                },
                token,
            })
        })
} //fin del login

// perfil de usuario
const profile = (req, res) => {
    // Recibir el parámetro del id de usuario por la url
    const id = req.params.id

    // Consulta para sacar los datos del usuario
    User.findById(id)
        .select({ password: 0 })
        .exec(async (error, userProfile) => {
            if (error || !userProfile) {
                return res.status(404).send({
                    status: "error",
                    message: "El usuario no existe o hay un error",
                })
            }

            // Devolver el resultado
            return res.status(200).send({
                status: "success",
                user: userProfile,
            })
        })
} // fin de perfil de usuario

// Listar Usuarios
const list = (req, res) => {
    // Controlar en que pagina estamos
    let page = 1
    if (req.params.page) {
        page = req.params.page
    }
    page = parseInt(page)

    // Consulta con mongoose paginate
    let itemsPerPage = 5

    User.find()
        .select("-password -email -__v")
        .sort("_id")
        .paginate(page, itemsPerPage, async (error, users, total) => {
            if (error || !users) {
                return res.status(404).send({
                    status: "error",
                    message: "No hay usuarios disponibles",
                    error,
                })
            }            
            // Devolver el resultado (posteriormente info follow)
            return res.status(200).send({
                status: "success",
                users,
                page,
                itemsPerPage,
                total,
                pages: Math.ceil(total / itemsPerPage),                
            })
        })
}//fin list

module.exports = {
    register,
    login,
    profile,
    list,
}

/**
 * Importar dependencias y módulos
 * @param {bcrypt} hashing de passwords
 *
 * @param {Pagination} contenedor de página
 *
 * @param {fs} permite interactuar con los archivos del sistema.
 *
 * @param {path} path nos permite poder manejar las rutas tanto
 * relativas como absolutas de nuestra PC y de nuestro proyecto
 *
 */

/**
 * Importar Modelo
 * @param {User} Modelo de user
 */

/**
 * Importar servicios
 * @param {jwt} servicio Json Web Token
 */

/**
 * funciones
 * @returns {register} devuelve el nuevo usuario registrado en la Basa de Datos.
 * @returns {login} devuelve el usuario que hace login y genera un Json Web Token.
 * @returns {profile} devuelve el perfil de un usuario, según el paramentó que se le da por la URL.
 * @returns {list} devuelve la lista de todos los usuarios registrados en la Basa de Datos.
 */
