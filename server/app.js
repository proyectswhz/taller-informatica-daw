import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import Connect from "./config/db.js";

import customerRoutes from "./routes/customers-routes.js";
import deviceRoutes from "./routes/device-routes.js";
import workOrdersRoutes from "./routes/workOrders-routes.js";

// ... el resto de tu código

// Crear una instancia de la aplicación Express
const app = express();

// x-powered-by disable
app.disable("x-powered-by");

// Configurar dotenv
dotenv.config();

// Lista de orígenes permitidos (Local y producción en Vercel)
const dominiosPermitidos = [
  "http://localhost:3000",
  "http://localhost:5500",
  "http://127.0.0.1:5500",
  "https://taller-informatica-daw-client.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Permitir solicitudes sin origen (como Postman, Thunder Client o peticiones servidor-servidor)
      if (!origin) return callback(null, true);

      if (
        dominiosPermitidos.indexOf(origin) !== -1 ||
        process.env.NODE_ENV !== "production"
      ) {
        callback(null, true);
      } else {
        callback(new Error("Bloqueado por la política CORS de producción"));
      }
    },
    credentials: true,
  }),
);

app.use(express.json());

// json middleware
app.use(express.json());

// Conectar a la base de datos
Connect();

// Usar rutas
app.use("/api/customers", customerRoutes);
app.use("/api/devices", deviceRoutes);
app.use("/api/workOrders", workOrdersRoutes);

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
