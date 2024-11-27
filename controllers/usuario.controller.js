// src/controllers/usuario.controller.js
import { QueryTypes, where } from "sequelize";
import { sequelize } from "../config/db.js";
import Usuario from "../models/usuario.model.js";
import { transporter } from "../config/nodemailer.js";
import bcrypt from "bcrypt";

class UsuarioController {
  // Obtener todos los usuarios
  static async getAllUsuarios(req, res) {
    console.log(req.query.search);

    if (req.query.search) {
      return UsuarioController.getUsuarioBySearch(req, res);
    }

    try {
      const usuarios = await Usuario.GetAllUsuarios();

      res.json(usuarios);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener usuarios", error });
    }
  }

  // Obtener un usuario por su documento
  static async getUsuarioByDocumento(req, res) {
    const { documento } = req.params;
    console.log(documento);

    try {
      const usuario = await Usuario.getByDocument(documento);

      if (!usuario) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      const { contraseña, ...usuarioSinContraseña } = usuario.toJSON();
      res.json(usuarioSinContraseña);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener el usuario" });
      console.log(error);
    }
  }

  // Crear un nuevo usuario
  static async postUsuario(req, res) {
    const {
      NombreCompleto,
      correo,
      telefono,
      direccion,
      rol,
      usuario,
      contraseña,
    } = req.body;

    try {
      const contraseñaEncriptada = await bcrypt.hash(contraseña, 10); //Encriptacion de la contraseña
      await sequelize.query("CALL InsertarUsuario( ?, ?, ?, ?, ?, ?, ?)", {
        replacements: [
          NombreCompleto,
          correo,
          telefono,
          direccion,
          rol,
          usuario,
          contraseñaEncriptada,
        ],
        type: QueryTypes.RAW,
      });
      res.status(201).json({ message: "Usuario creado exitosamente" });
    } catch (error) {
      console.error("Error al crear el usuario:", error);
      res.status(500).json({ message: "Error al crear el usuario", error });
    }
  }

  // Actualizar un usuario
  static async putUsuario(req, res) {
    const documento = req.params.documento;
    const { resRol, ...usuarioUpdate } = req.body;

    try {
      if (resRol === "Administrador") {
        const updatedUsuario = await Usuario.updateUsuario(
          documento,
          usuarioUpdate
        );
        if (!updatedUsuario) {
          return res.status(404).json({ message: "Usuario no encontrado" });
        }
      } else
        return res
          .status(401)
          .json({ message: "No tiene permisos para realizar esta acción" });

      res.status(200).json({ message: "Usuario actualizado correctamente" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al actualizar el usuario: " + error.message });
    }
  }
  static async putPassword(req, res) {
    const token = req.params.token;
    const { password, resRol, correo } = req.body;

    try {
      const usuario = await Usuario.getByCorreo(correo);

      if (!usuario) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      if (usuario.token === "" || usuario.token !== token) {
        return res.status(401).json({ message: "Token inválido" });
      }

      await Usuario.updatePassword(correo, password);
      res.status(200).json({ message: "Contraseña actualizada correctamente" });
    } catch (error) {
      res.status(500).json({
        message: "Error al actualizar la contraseña: " + error.message,
      });
    }
  }
  // Eliminar un usuario
  static async deleteUsuario(req, res) {
    const { documento } = req.params;
    try {
      await Usuario.deleteUsuario(documento);
      res.status(200).json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al eliminar el usuario: " + error.message });
    }
  }

  static async getUsuarioByNombre(req, res) {
    const { nombreCompleto } = req.query;
    try {
      const usuarios = await Usuario.searchByName(nombreCompleto);
      if (!usuarios) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      res.json([usuarios]);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener el usuario" });
      console.log(error);
    }
  }
  static async setPostToken(req, res) {
    const { correo } = req.body;
    const token = req.params.token;
    console.log(correo, token);

    try {
      const usuario = await Usuario.getByCorreo(correo);
      if (!usuario) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      await Usuario.updateToken(correo, token);
      await transporter.sendMail({
        from: "Panaderia - <panaderiaajms@gmail.com>",
        to: correo,
        subject: "Recuperación de contraseña",
        html: `<a href="https://frontend-five-topaz-76.vercel.app/Recuperar/${token}">Click aquí para recuperar tu contraseña</a>`,
      });
      res.status(200).json({ message: "Token actualizado correctamente" });
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar el token" });
      console.log(error);
    }
  }
  static async getUsuarioBySearch(req, res) {
    const { search } = req.query;

    try {
      const usuarios = await Usuario.bySearch(search);
      if (!usuarios) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      await transporter.sendMail({
        from: "Panaderia - pan@abuela.com",
        to: correo,
        subject: "Recuperación de contraseña",
        html: `<a href="https://frontend-five-topaz-76.vercel.app/Recuperar/${token}">Click aquí para recuperar tu contraseña</a>`,
      });
      res
        .status(200)
        .json({ message: "Token actualizado correctamente, revisa tú correo" });
      return res.json(usuarios);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener el usuario" });
      console.log(error);
    }
  }
}

export default UsuarioController;

/*
class UsuarioController {
    static async GetAllUsuarios(req, res) {
 const getAllUsuarios = async (req, res) => {
    try {
        const usuarios = await sequelize.query('CALL GetAllUsuarios()', { type: QueryTypes.RAW });
        res.json(usuarios);
    } catch (error) {
        res.json( {message: error.message})
    }
}
    }
    static async GetUsuarioByDocumento(req, res) {
 const getUsuarioByDocumento = async (req,res) => {
    try {
        const usuario = await sequelize.query('CALL GetUsuarioByDocumento(:documento)', {
            replacements: { documento },
            type: QueryTypes.RAW
        })
        res.json(usuario)
    } catch (error) {
        res.json( {message: error.message})
    }
}
    }
 
    static async postUsuario(req, res) {
 const postUsuario = async (req, res) => {
    try {
        await rutas.create(req, body)
        res.json({
            "message": "Registro creado correctamente"
        })
    } catch (error) {
        res.json( {message: error.message})
    }
}
    }
    static async putUsuario(req, res) {
 const putUsuario = async (req, res) => {
    try {
        await rutas.update(req, body,{
            where: { documento: req.params.id}
        })
        res.json({
        "message": "Registro creado correctamente"
        })
    } catch (error) {
        res.json( {message: error.message})
    }
}
    }
    static async deleteUsuario(req, res) {
 const deleteUsuario = async (req, res) => {
    try {
        await rutas.destroy({
            where: { documento: req.params.documento}
        })
        res.json({
            "message": "Registro creado correctamente"
            })
    } catch (error) {
        res.json( {message: error.message})
    }
}
    }
}

export default UsuarioController;
*/
