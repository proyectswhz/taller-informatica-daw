import express from "express";

import Customer from "../models/customer.js";

export const obtenerClientes = async (req, res) => {
  try {
    const clienteParametro = req.query.cliente; // Obtener el parámetro de búsqueda del cliente

    if (clienteParametro && clienteParametro.trim() !== "") {
      // Si se proporciona un parámetro de búsqueda, buscar clientes por nombre o apellido
      const clientes = await Customer.find({
        $or: [
          { name: { $regex: clienteParametro, $options: "i" } },
          { dni: { $regex: clienteParametro, $options: "i" } },
          { phone: { $regex: clienteParametro, $options: "i" } },
        ],
      });
      res.json(clientes);
      return;
    }

    const clientes = await Customer.find();
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los clientes", error });
  }
};

export const obtenerClientePorId = async (req, res) => {
  try {
    const { id } = req.params;
    const cliente = await Customer.findById(id);
    if (!cliente) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el cliente", error });
  }
};

export const crearCliente = async (req, res) => {
  try {
    // Desestructurar los datos del cliente desde el cuerpo de la solicitud
    const { name, surname, phone, email, dni, address } = req.body;
    // Verificar si el cliente ya existe en la base de datos por su DNI
    const clienteExistente = await Customer.findOne({ dni });
    // Verificar si el cliente ya existe en la base de datos
    if (clienteExistente) {
      return res.status(400).json({ message: "El cliente ya existe" });
    }
    // Crear nuevo cliente objeto con los datos proporcionados
    const nuevoCliente = new Customer({
      name,
      surname,
      phone,
      email,
      dni,
      address,
    });
    // Guardar el nuevo cliente en la base de datos
    const clienteGuardado = await nuevoCliente.save();
    res.status(201).json(clienteGuardado);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el cliente", error });
  }
};

export const actualizarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, surname, phone, email, dni, address } = req.body;
    // Buscar el cliente por su ID y actualizar sus datos
    const clienteActualizado = await Customer.findByIdAndUpdate(
      id,
      { name, surname, phone, email, dni, address },
      { new: true, runValidators: true },
    );
    if (!clienteActualizado) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    res.json(clienteActualizado);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el cliente", error });
  }
};

export const eliminarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const clienteEliminado = await Customer.findByIdAndDelete(id);
    if (!clienteEliminado) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    res.json({ message: "Cliente eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el cliente", error });
  }
};
