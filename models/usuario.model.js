// Usuario.model.js
import { DataTypes, Model, ENUM, Op } from "sequelize";
import db from "../basedatos/db1.js";
import bcrypt from "bcrypt";
import { sequelize } from "../config/db.js";

class Usuario extends Model {
  // Método para crear un nuevo usuario
  static async createUsuario(usuario) {
    try {
      return await this.create(usuario);
    } catch (error) {
      console.error(`Unable to create usuario: ${error}`);
      throw error;
    }
  }

  // Método para obtener todos los usuarios
  static async GetAllUsuarios() {
    try {
      return await this.findAll({ attributes: { exclude: ["contraseña"] } });
    } catch (error) {
      console.error(`Unable to find all usuarios: ${error}`);
      throw error;
    }
  }

  // Método para obtener un usuario por su documento
  static async getUsuarioByDocumento(documento) {
    try {
      return await this.findOne({ where: { documento } });
    } catch (error) {
      console.error(`Unable to find usuario by document: ${error}`);
      throw error;
    }
  }

  // Método para actualizar un usuario
  static async updateUsuario(documento, updated_usuario) {
    try {
      const usuario = await this.findOne({ where: { documento } });
      if (!usuario) return null;

      updated_usuario.contraseña = usuario.dataValues.contraseña;

      return usuario.update(updated_usuario);
    } catch (error) {
      console.error(`Unable to update the usuario: ${error}`);
      throw error;
    }
  }

  static async updatePassword(correo, contraseña) {
    try {
      const contraseñaEncriptada = await bcrypt.hash(contraseña, 10);
      return await this.update(
        { contraseña: contraseñaEncriptada, token: "" },

        { where: { correo } }
      );
    } catch (error) {
      console.error(`Unable to update the password: ${error}`);
      throw error;
    }
  }

  static async getByCorreo(correo) {
    try {
      //devolver usuario completo
      return await this.findOne({ where: { correo } });
    } catch (error) {
      console.error(`Unable to find usuario by email: ${error}`);
      throw error;
    }
  }
  static async getByDocument(documento) {
    try {
      return await this.findOne({ where: { documento } });
    } catch (error) {
      console.error(`Unable to find usuario by document: ${error}`);
      throw error;
    }
  }
  static async searchByName(NombreCompleto) {
    console.log(NombreCompleto);
    try {
      return await this.findAll({
        where: {
          NombreCompleto: {
            [sequelize.Op.like]: `%${NombreCompleto}%`,
          },
        },
      });
    } catch (error) {
      console.error(`Unable to find usuario by name: ${error}`);
      throw error;
    }
  }
  static async updateToken(correo, token) {
    try {
      return await this.update({ token }, { where: { correo } });
    } catch (error) {
      console.error(`Unable to update the token: ${error}`);
      throw error;
    }
  }
  static async deleteUsuario(documento) {
    try {
      return await this.destroy({ where: { documento } });
    } catch (error) {
      console.error(`Unable to delete the usuario: ${error}`);
      throw error;
    }
  }
}

// Definición del modelo Usuario en Sequelize
Usuario.init(
  {
    documento: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
    },
    NombreCompleto: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    correo: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    telefono: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    direccion: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    usuario: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    contraseña: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    rol: {
      type: DataTypes.ENUM(
        "Cliente",
        "Administrador",
        "Domiciliario",
        "Empleado"
      ),
      allowNull: false,
    },

    token: {
      type: DataTypes.STRING(2000),
      defaultValue: "",
    },
  },
  {
    sequelize,
    tableName: "usuarios",
    timestamps: false,
    underscored: false,
  }
);
Usuario.associate = function (models) {
  Usuario.hasMany(models.Domiciliario, {
    foreignKey: "documentoFK",
    as: "domiciliarios",
  });
};
export default Usuario;
