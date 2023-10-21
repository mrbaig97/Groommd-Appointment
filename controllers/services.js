const ServiceModal = require("../models/services");

exports.createService = async (req, res) => {
  try {
    const { serviceName, price, duration } = req.body;

    const newService = new ServiceModal({
      serviceName
    });

    const savedService = await newService.save();

    res.status(201).json({
      message: "Service created successfully",
      service: savedService,
    });
  } catch (error) {
    res.status(500).json({ error: "Error creating service" });
  }
};
exports.getAllServices = async (req, res) => {
    try {
      const services = await ServiceModal.find();
  
      res.status(200).json({
        message: "Services retrieved successfully",
        services,
      });
    } catch (error) {
      res.status(500).json({ error: "Error retrieving services" });
    }
  };
  exports.deleteService = async (req, res) => {
    try {
      const deletedService = await ServiceModal.findByIdAndRemove(req.params.id);
  
      if (!deletedService) {
        return res.status(404).json({ error: "Service not found" });
      }
  
      res.status(200).json({
        message: "Service deleted successfully",
        service: deletedService,
      });
    } catch (error) {
      res.status(500).json({ error: "Error deleting service" });
    }
  };
    