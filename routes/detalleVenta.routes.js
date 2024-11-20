import DetalleVentaController from "../controllers/detalleVenta.controller.js";

router.get("/api/detalle", DetalleVentaController.getAllDetallesVentas); // Obtener todos los productos
router.get(
  "/api/detalle/:idDetalleVenta",
  DetalleVentaController.getDetalleVentaById
); // Obtener un producto por ID
router.post("/api/detalle", DetalleVentaController.postDetalleVenta); // Crear un nuevo producto
router.put(
  "/api/detalle/:idDetalleVenta",
  DetalleVentaController.putDetalleVenta
); // Actualizar un producto
router.delete(
  "/api/detalle/:idDetalleVenta",
  DetalleVentaController.deleteDetalleVenta
); // Eliminar un producto
