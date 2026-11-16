import mongoose from "mongoose";

const workOrderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: [true, "La orden debe estar asociada a un cliente"],
    },
    device: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Device",
      required: [true, "La orden debe estar asociada a un dispositivo"],
    },
    issueDescription: {
      type: String,
      required: [true, "La descripción de la avería es obligatoria"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["Pendiente", "En reparación", "Finalizado", "Entregado"],
      default: "Pendiente",
    },
    estimatedCost: {
      type: Number,
      default: 0,
    },
    finalCost: {
      type: Number,
      default: 0,
    },
    technicianNotes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const WorkOrder = mongoose.model("WorkOrder", workOrderSchema);

export default WorkOrder;
