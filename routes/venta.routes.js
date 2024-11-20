import VentaController from "../controllers/venta.controller.js";

// Rutas para ventas
router.get("/api/venta", VentaController.getAllVentas); // Obtener todas las ventas
router.get("/api/venta/:idVentas", VentaController.getVentaById); // Obtener una venta por ID
router.post("/api/venta", VentaController.postVenta); // Crear una nueva venta
router.put("/api/venta/:idVentas", VentaController.putVenta); // Actualizar una venta
router.delete("/api/venta/:idVentas", VentaController.deleteVenta); // Eliminar una venta

export default router;
