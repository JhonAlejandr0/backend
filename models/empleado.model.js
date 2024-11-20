// src/models/empleado.model.js
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";

class Empleado extends Model {
  static associate(models) {
    // Define associations here
    this.belongsTo(models.Usuario, {
      foreignKey: "docum_entoFK",
      as: "usuario",
    });
  }
  // Create a new employee
  static async createEmpleado(data) {
    return await this.create(data);
  }

  // Update an existing employee
  static async updateEmpleado(id, data) {
    return await this.update(data, {
      where: { idEmpleado: id },
    });
  }

  // Delete an employee
  static async deleteEmpleado(id) {
    return await this.destroy({
      where: { idEmpleado: id },
    });
  }

  // Find an employee by ID
  static async findEmpleadoById(id) {
    return await this.findByPk(id);
  }
  // Find all employees
  static async findAllEmpleados() {
    return await this.findAll();
  }
}

// Definición del modelo Empleado en Sequelize
Empleado.init(
  {
    idEmpleado: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    fechaContratacionEmpleado: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    puestoEmpleado: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    docum_entoFK: {
      type: DataTypes.INTEGER,
      references: {
        model: "usuarios",
        key: "docum_ento",
      },
    },
  },
  {
    sequelize,
    tableName: "empleado",
    timestamps: false,
    underscored: false,
  }
);

export { Empleado };
