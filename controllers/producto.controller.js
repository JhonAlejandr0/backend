// src/controllers/producto.controller.js
import { QueryTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import Producto from "../models/productos.model.js";
import fs from "fs";
import { log } from "console";
class ProductoController {
  // Obtener todos los productos

  static async getAllProductos(req, res) {
    const { nombreProducto } = req.query;
    console.log(nombreProducto, !nombreProducto);

    if (nombreProducto !== undefined) {
      try {
        const productos = await Producto.searchByName(nombreProducto);
        console.log(productos);
        res.json(productos);
      } catch (error) {
        res.status(500).json({ message: "Error al obtener productos", error });
      }
    } else {
      try {
        const productosPorNombre = await Producto.GetAllProductos(
          nombreProducto
        );
        res.json(productosPorNombre);
      } catch (error) {
        res
          .status(500)
          .json({ message: "Error al buscar productos por nombre", error });
      }
    }
  }

  // Obtener un producto por ID
  static async getProductoById(req, res) {
    const { idProductos } = req.params;

    try {
      const producto = await Producto.getProductoById(idProductos);

      if (!producto) {
        // Si no se encuentra el producto
        return res.status(404).json({ message: "Producto no encontrado" });
      }
      res.json(producto);
    } catch (error) {
      222;
      res.status(500).json({ message: "Error al obtener el producto", error });
    }
  }

  // Crear un nuevo producto
  static async postProducto(req, res) {
    try {
      const foto_URL = req.file.originalname;

      const saveImage = async (file) => {
        const newPath = file.destination + "/" + file.originalname;
        fs.renameSync(file.path, newPath);
      };
      await saveImage(req.file);
      const {
        nombreProducto,
        descripcionProducto,
        stockProducto,
        precioProducto,
        categoria,
        idEmpleadoFK,
      } = req.query;

      await Producto.create({
        nombreProducto,
        descripcionProducto,
        stockProducto,
        precioProducto,
        categoria,
        foto_URL,
        idEmpleadoFK,
      });
      res.status(201).json({ message: "Producto creado exitosamente" });
    } catch (error) {
      res.status(500).json({ message: "Error al crear el producto", error });
    }
  }

  // Actualizar un producto
  static async putProducto(req, res) {
    const { idProducto, imagenProducto, ...producto } = req.body;
    console.log(idProducto, producto);

    try {
      if (req.file) {
        const foto_URL = req.file.originalname;
        console.log(foto_URL);
        const saveImage = async (file) => {
          const newPath = file.destination + "/" + file.originalname;
          fs.renameSync(file.path, newPath);
        };
        await saveImage(req.file);
        producto.foto_URL = foto_URL;
      }
      const actualizarProducto = await Producto.updateProducto(
        idProducto,
        producto
      );
      if (!actualizarProducto) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }
      res.status(200).json({
        message: "Producto actualizado correctamente",
        actualizarProducto,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al actualizar el producto: " + error.message });
    }
  }

  // Eliminar un producto
  static async deleteProducto(req, res) {
    const { idProductos } = req.params;
    try {
      await Producto.deleteProducto(idProductos);
      res.status(200).json({ message: "Producto eliminado correctamente" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al eliminar el producto: " + error.message });
    }
  }
  static async getProductosByCategoria(req, res) {
    const { categoria } = req.params; // Accede directamente al parámetro

    try {
      const productos = await Producto.getByCategoria(categoria);
      if (!productos) {
        return res.status(404).json({ message: "No se encontraron productos" });
      }
      res.json(productos); // Accede al primer elemento del array retornado
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al obtener productos por categoría", error });
    }
  }

  //Obtener por nombre
  static async getProductoPorNombre(req, res) {
    const { nombreProducto } = req.query;
    try {
      if (!nombreProducto) {
        return res
          .status(400)
          .json({ message: "El nombre del producto es requerido" });
      }
      await Producto.searchByName(nombreProducto);
      if (!nombreProducto) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }
      res.json(nombreProducto);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al obtener el producto por nombre", error });
    }
  }
  /*
    //Carrito
    static async getAllProductos(req, res) {
        try {
            const productos = await sequelize.query('CALL GetAllProductos()', { type: QueryTypes.RAW });
            res.json(productos);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener productos', error });
        }
    }
        */
}

export default ProductoController;
