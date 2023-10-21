const mongoose = require("mongoose");

// Define the schema for the service model
const serviceSchema = new mongoose.Schema(
  {
    serviceName: String,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    versionKey: false, // This option will remove the __v field from the document
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
      },
    },
    timestamps: true, // This option will automatically add createdAt and updatedAt timestamps
  }
);

// Create the Service model
const ServiceModel = mongoose.model("Service", serviceSchema);

module.exports = ServiceModel;
  