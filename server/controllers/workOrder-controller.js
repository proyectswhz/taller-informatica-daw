import express from "express";

import WorkOrder from "../models/workOrder.js";
// Obtener todas las órdenes de trabajo
export const obtenerOrdenesTrabajo = async (req, res) => {
  try {
    const ordenes = await WorkOrder.find()
      .populate("customer")
      .populate("device");
    res.json(ordenes);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener las órdenes de trabajo", error });
  }
};
// obtener una orden de trabajo por su ID
export const obtenerOrdenTrabajoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const ordenTrabajo = await WorkOrder.findById(id)
      .populate("customer")
      .populate("device");
    if (!ordenTrabajo) {
      return res
        .status(404)
        .json({ message: "Orden de trabajo no encontrada" });
    }
    res.json(ordenTrabajo);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener la orden de trabajo", error });
  }
};

export const crearOrdenTrabajo = async (req, res) => {
  try {
    const {
      customer,
      device,
      issueDescription,
      status,
      estimatedCost,
      finalCost,
      technicianNotes,
    } = req.body;

    const nuevaOrden = new WorkOrder({
      customer,
      device,
      issueDescription,
      status,
      estimatedCost,
      finalCost,
      technicianNotes,
    });

    const ordenGuardada = await nuevaOrden.save();

    // Devolvemos la orden ya populada
    const ordenPopulada = await WorkOrder.findById(ordenGuardada._id)
      .populate("customer")
      .populate("device");

    res.status(201).json(ordenPopulada);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear la orden de trabajo", error });
  }
};

// Actualizar una orden de trabajo existente
export const actualizarEstadoOrdenTrabajo = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      customer,
      device,
      issueDescription,
      status,
      estimatedCost,
      finalCost,
      technicianNotes,
    } = req.body;

    const ordenActualizada = await WorkOrder.findByIdAndUpdate(
      id,
      {
        customer,
        device,
        issueDescription,
        status,
        estimatedCost,
        finalCost,
        technicianNotes,
      },
      { new: true },
    )
      .populate("customer")
      .populate("device");

    if (!ordenActualizada) {
      return res
        .status(404)
        .json({ message: "Orden de trabajo no encontrada" });
    }
    res.json(ordenActualizada);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar la orden de trabajo", error });
  }
};

// Eliminar una orden de trabajo
export const eliminarOrdenTrabajo = async (req, res) => {
  try {
    const { id } = req.params;
    const ordenEliminada = await WorkOrder.findByIdAndDelete(id);

    if (!ordenEliminada) {
      return res
        .status(404)
        .json({ message: "Orden de trabajo no encontrada" });
    }
    res.json({ message: "Orden de trabajo eliminada correctamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar la orden de trabajo", error });
  }
};
