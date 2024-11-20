import ProductoController from "../controllers/producto.controller.js";
import { Router } from "express";

const producto = Router();

producto.get(
  "/categoria/:categoria",
  ProductoController.getProductosByCategoria
);
producto.get("/", ProductoController.getAllProductos); // Obtener todos los productos
producto.get("/:idProductos", ProductoController.getProductoById); // Obtener un producto por ID
producto.post("/", ProductoController.postProducto); // Crear un nuevo producto
producto.post("/actualizar", ProductoController.putProducto); // Actualizar un producto
producto.delete("/:idProductos", ProductoController.deleteProducto); // Eliminar un producto

//Obtener por nombre
/*producto.get(
  "/",
  ProductoController.getProductoPorNombre
);*/

export default producto;
