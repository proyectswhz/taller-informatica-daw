import express from "express";

import {
  obtenerDispositivosIdCliente,
  obtenerDispositivos,
  obtenerDispositivoPorId,
  crearDispositivo,
  actualizarDispositivo,
  eliminarDispositivo,
} from "../controllers/device-controller.js";

const router = express.Router();

router.get("/", obtenerDispositivos);
router.get("/customer/:id", obtenerDispositivosIdCliente);
router.get("/:id", obtenerDispositivoPorId);
router.post("/", crearDispositivo);
router.put("/:id", actualizarDispositivo);
router.delete("/:id", eliminarDispositivo);

export default router;
