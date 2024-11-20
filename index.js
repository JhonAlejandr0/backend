import express from "express";
import cors from "cors";
import db from "./basedatos/db1.js";

import multer from "multer";
import producto from "./routes/producto.routes.js";
import usuario from "./routes/usuario.routes.js";
import cliente from "./routes/cliente.routes.js";
import domiciliario from "./routes/domiciliario.routes.js";
import admin from "./routes/admin.routes.js";
const app = express();
const uploads = multer({ dest: "../frontend/public/IMG" });
app.use(cors());
app.use(express.json());
app.use(uploads.single("imagenProducto"));
app.use("/api/usuario", usuario);
app.use("/api/producto", producto);
app.use("/api/cliente", cliente);
app.use("/api/domiciliario", domiciliario);
app.use("/api/admin", admin);

try {
  REACT_APP_API_PRODUCTO;
  await db.authenticate();
  console.log("conexion exitosa a la base de datos");
} catch (error) {
  console.log("El error de conexion es: " + error);
}

app.listen(8000, () => {
  console.log("Server UP running in http://localhost:8000/");
});
