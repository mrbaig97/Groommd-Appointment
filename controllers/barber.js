const BarberModal = require("../models/barber");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.createBarber = async (req, res) => {
  try {
    const { shopname, email, password, businessTimings, services } = req.body;

    const newBarber = new BarberModal({
      shopname,
      email,
      password,
      businessTimings,
      services,
    });
    const hashedPassword = await bcrypt.hash(password, 10);
    newBarber.password = hashedPassword;
    const savedBarber = await newBarber.save();

    res.status(201).json({
      message: "Barber created successfully",
      barber: savedBarber,
    });
  } catch (error) {
    res.status(500).json({ error: "Error creating barber" });
  }
};
exports.getAllBarbers = async (req, res) => {
    try {
      const barbers = await BarberModal.find();
  
      res.status(200).json({
        message: "Barbers retrieved successfully",
        barbers,
      });
    } catch (error) {
      res.status(500).json({ error: "Error retrieving barbers" });
    }
  };
  exports.getBarberById = async (req, res) => {
    try {
      const barber = await BarberModal.findById(req.params.id);
  
      if (!barber) {
        return res.status(404).json({ error: "Barber not found" });
      }
  
      res.status(200).json({
        message: "Barber retrieved successfully",
        barber,
      });
    } catch (error) {
      res.status(500).json({ error: "Error retrieving barber" });
    }
  };
  exports.updateBarber = async (req, res) => {
    try {
      const { shopname, email, password, businessTimings, services } = req.body;
      const updatedBarber = await BarberModal.findByIdAndUpdate(req.params.id, {
        shopname,
        email,
        password,
        businessTimings,
        services,
      });
  
      if (!updatedBarber) {
        return res.status(404).json({ error: "Barber not found" });
      }
  
      res.status(200).json({
        message: "Barber updated successfully",
        barber: updatedBarber,
      });
    } catch (error) {
      res.status(500).json({ error: "Error updating barber" });
    }
  };
  exports.deleteBarber = async (req, res) => {
    try {
      const deletedBarber = await BarberModal.findByIdAndRemove(req.params.id);
  
      if (!deletedBarber) {
        return res.status(404).json({ error: "Barber not found" });
      }
  
      res.status(200).json({
        message: "Barber deleted successfully",
        barber: deletedBarber,
      });
    } catch (error) {
      res.status(500).json({ error: "Error deleting barber" });
    }
  };
        
exports.loginBarber = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the barber by their email
    const barber = await BarberModal.findOne({ email });

    // If the barber is not found, return an error
    if (!barber) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, barber.password);

    // If the passwords don't match, return an error
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // If the email and password are valid, create and return a JWT token
    const token = jwt.sign(
      { barberId: barber._id, email: barber.email },
      "secret", // Replace with your actual secret key
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Barber login successful",
      token,
    });
  } catch (error) {
    res.status(500).json({ error: "Error logging in" });
  }
};

        