import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import Connect from "./config/db.js";

import customerRoutes from "./routes/customers-routes.js";
import deviceRoutes from "./routes/device-routes.js";
// import workOrdersRoutes from "./routes/workOrders.js";

// ... el resto de tu código

// Crear una instancia de la aplicación Express
const app = express();

// x-powered-by disable
app.disable("x-powered-by");

// Configurar dotenv
dotenv.config();

// Configurar CORS
app.use(cors());

// json middleware
app.use(express.json());

// Conectar a la base de datos
Connect();

// Usar rutas
app.use("/api/customers", customerRoutes);
app.use("/api/devices", deviceRoutes);
// app.use("/api/workOrders", workOrdersRoutes);

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
