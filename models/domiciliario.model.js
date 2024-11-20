import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
const Domiciliario = sequelize.define(
  "Domiciliario",
  {
    idDomiciliario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    vehiculoDomiciliario: {
      type: DataTypes.ENUM("bicicleta", "moto"),
      allowNull: false,
    },
    fechaContratacionDomiciliario: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    documentoFK: {
      type: DataTypes.INTEGER,
      references: {
        model: "usuarios", // Name of the referenced table
        key: "documento",
      },
      onDelete: "CASCADE",
    },
    domiciliosRechazados: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  },
  {
    tableName: "domiciliario",
    timestamps: false,
  }
);

export default Domiciliario;
