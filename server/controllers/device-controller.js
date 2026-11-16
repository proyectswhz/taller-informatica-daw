import express from "express";

import Device from "../models/device.js";

export const obtenerDispositivosIdCliente = async (req, res) => {
  try {
    const customerObjectID = req.params.id;
    const dispositivos = await Device.find({ customer: customerObjectID });
    res.json(dispositivos);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener los dispositivos", error });
  }
};
// Obtener todos los dispositivos
export const obtenerDispositivos = async (req, res) => {
  try {
    const dispositivos = await Device.find();
    res.json(dispositivos);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener los dispositivos", error });
  }
};

// Obtener un dispositivo por su ID
export const obtenerDispositivoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const dispositivo = await Device.findById(id);
    if (!dispositivo) {
      return res.status(404).json({ message: "Dispositivo no encontrado" });
    }
    res.json(dispositivo);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el dispositivo", error });
  }
};

// Crear un nuevo dispositivo
export const crearDispositivo = async (req, res) => {
  try {
    const { type, brand, model, serialNumber, customer, observations } =
      req.body;
    // Verificar si el dispositivo ya existe en la base de datos por su número de serie
    const dispositivoExistente = await Device.findOne({ serialNumber });
    if (dispositivoExistente) {
      return res.status(400).json({ message: "El dispositivo ya existe" });
    }
    const nuevoDispositivo = new Device({
      type,
      brand,
      model,
      serialNumber,
      customer,
      observations,
    });
    const dispositivoGuardado = await nuevoDispositivo.save();
    res.status(201).json(dispositivoGuardado);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el dispositivo", error });
  }
};

// Actualizar un dispositivo existente
export const actualizarDispositivo = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, brand, model, serialNumber, customer, observations } =
      req.body;
    const dispositivoActualizado = await Device.findByIdAndUpdate(
      id,
      { type, brand, model, serialNumber, customer, observations },
      { new: true },
    );
    if (!dispositivoActualizado) {
      return res.status(404).json({ message: "Dispositivo no encontrado" });
    }
    res.json(dispositivoActualizado);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar el dispositivo", error });
  }
};

// Eliminar un dispositivo existente
export const eliminarDispositivo = async (req, res) => {
  try {
    const { id } = req.params;
    const dispositivoEliminado = await Device.findByIdAndDelete(id);

    if (!dispositivoEliminado) {
      return res.status(404).json({ message: "Dispositivo no encontrado" });
    }
    res.json({ message: "Dispositivo eliminado correctamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar el dispositivo", error });
  }
};
