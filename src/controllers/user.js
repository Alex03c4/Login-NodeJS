// Importar dependencias y módulos
const bcrypt = require("bcrypt");
const Pagination = require("mongoose-pagination");
const fs = require("fs");
const path = require("path");

// Importar modelos
const User = require("../models/user");

// Registrar de usuarios
const register = (req, res) => {
  // Recoger datos de la petición
  let params = req.body;

  // Comprobar que me llegan bien (+ validación)
  if (!params.name || !params.email || !params.password) {
    return res.status(400).json({
      status: "error",
      message: "Faltan datos por enviar",
    });
  }
  //trasformar el texto en minúscula 
  params.email = params.email.toLowerCase();
  params.name = params.name.toLowerCase();

  // Control usuarios duplicados
  User.find({
    $or: [{ email: params.email }],
  }).exec(async (error, users) => {
    if (error) {
      return res.status(500).json({
        status: "error",
        message: "Error en la consulta de usuarios",
      });
    }

    if (users && users.length >= 1) {
      return res.status(200).send({
        status: "success",
        message: "El usuario ya existe",
      });
    }

    // Cifrar la contraseña
    let pwd = await bcrypt.hash(params.password, 10);
    params.password = pwd;
    // Crear objeto de usuario
    let NewUser = new User(params);

    // Guardar usuario en la Base de Datos
    NewUser.save((error, userStored) => {
      if (error || !userStored)
        return res
          .status(500)
          .send({ status: "error", message: "Error al guardar el usuario" });

      // Eliminar password de la petición
      userStored.toObject();
      delete userStored.password;

      // Devolver resultado
      return res.status(200).json({
        status: "success",
        message: "Usuario registrado correctamente",
        user: userStored,
      });
    });
  });
}; //fin del register

module.exports = {
  register,
};

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
 * funciones
 * @return {register} devuelve el nuevo usuario registrado en la Basa de Datos
 */
