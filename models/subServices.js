const mongoose = require("mongoose");

const subserviceSchema = new mongoose.Schema({
  barberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Barber", // Reference to the Barber model
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service", // Reference to the Service model
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  serviceName: String,
  price: Number,
  duration: Number,
}, {
  versionKey: false, // This option will remove the __v field from the document
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
    },
  },
  timestamps: true, // This option will automatically add createdAt and updatedAt timestamps
});

const SubserviceModel = mongoose.model("Subservice", subserviceSchema);

module.exports = SubserviceModel;
