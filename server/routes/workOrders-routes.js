import express from "express";

import {
  obtenerOrdenesTrabajo,
  crearOrdenTrabajo,
  obtenerOrdenTrabajoPorId,
  actualizarEstadoOrdenTrabajo,
  eliminarOrdenTrabajo,
} from "../controllers/workOrder-controller.js";

const router = express.Router();

router.get("/", obtenerOrdenesTrabajo);
router.get("/:id", obtenerOrdenTrabajoPorId);
router.post("/", crearOrdenTrabajo);
router.put("/:id", actualizarEstadoOrdenTrabajo);
router.delete("/:id", eliminarOrdenTrabajo);

export default router;
