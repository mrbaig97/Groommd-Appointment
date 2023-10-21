const SubserviceModel = require("../models/subServices");

exports.createSubservice = async (req, res) => {
  const { barberId, serviceId, serviceName, price, duration } = req.body;

  try {
    const newSubservice = new SubserviceModel({
      barberId: barberId,
      serviceId: serviceId,
      serviceName,
      price,
      duration,
    });

    await newSubservice.save();
    res.status(201).json({ message: "Subservice created successfully", subservice: newSubservice });
  } catch (error) {
    res.status(500).json({ error: "Error creating subservice" });
  }
};

exports.getSubservices = async (req, res) => {
  try {
    const subservices = await SubserviceModel.find();

    res.status(200).json({ message: "Subservices retrieved successfully", subservices });
  } catch (error) {
    res.status(500).json({ error: "Error retrieving subservices" });
  }
};

exports.deleteSubservice = async (req, res) => {
  const subserviceId = req.params.id;

  try {
    const deletedSubservice = await SubserviceModel.findByIdAndRemove(subserviceId);

    if (!deletedSubservice) {
      return res.status(404).json({ error: "Subservice not found" });
    }

    res.status(200).json({ message: "Subservice deleted successfully", subservice: deletedSubservice });
  } catch (error) {
    res.status(500).json({ error: "Error deleting subservice" });
  }
};
