import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [
        true,
        "El tipo de dispositivo es obligatorio (ej. Portátil, Sobremesa, Tablet)",
      ],
      trim: true,
    },
    brand: {
      type: String,
      required: [true, "La marca es obligatoria"],
      trim: true,
    },
    model: {
      type: String,
      required: [true, "El modelo es obligatorio"],
      trim: true,
    },
    serialNumber: {
      type: String,
      trim: true,
      uppercase: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: [true, "El equipo debe estar asociado a un cliente"],
    },
    observations: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const Device = mongoose.model("Device", deviceSchema);

export default Device;
