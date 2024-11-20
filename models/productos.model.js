// src/models/producto.model.js
import { DataTypes, Model, Op } from "sequelize";
import { sequelize } from "../config/db.js";

class Producto extends Model {
  static async createProducto(producto) {
    try {
      return await this.create(producto);
    } catch (error) {
      console.error(`Unable to create producto: ${error}`);
      throw error;
    }
  }

  static async GetAllProductos() {
    try {
      return await this.findAll();
    } catch (error) {
      console.error(`Unable to find all productos: ${error}`);
      throw error;
    }
  }

  static async getProductoById(idProductos) {
    try {
      return await this.findOne({ where: { idProductos } });
    } catch (error) {
      console.error(`Unable to find producto by id: ${error}`);
      throw error;
    }
  }

  static async updateProducto(idProductos, updated_producto) {
    try {
      const producto = await this.findOne({ where: { idProductos } });
      if (!producto) return null;
      return producto.update(updated_producto);
    } catch (error) {
      console.error(`Unable to update the producto: ${error}`);
      throw error;
    }
  }
  static async searchByName(nombreProducto) {
    try {
      return await this.findAll({
        where: {
          nombreProducto: { [Op.like]: `%${nombreProducto}%` },
        },
      });
    } catch (error) {
      console.error(`Unable to find producto by name: ${error}`);
      throw error;
    }
  }
  static async getByCategoria(categoria) {
    try {
      return await this.findAll({
        where: {
          categoria,
        },
      });
    } catch (error) {
      console.error(`Unable to find producto by categoria: ${error}`);
      throw error;
    }
  }
  static async deleteProducto(idProductos) {
    try {
      const producto = await this.findOne({ where: { idProductos } });
      if (!producto) return null;
      return producto.destroy();
    } catch (error) {
      console.error(`Unable to delete producto: ${error}`);
      throw error;
    }
  }
}

Producto.init(
  {
    idProductos: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombreProducto: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
    },
    descripcionProducto: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    stockProducto: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    precioProducto: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    categoria: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    foto_URL: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "productos",
    timestamps: false,
    underscored: false,
  }
);

export default Producto;
