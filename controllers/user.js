const UserModel = require("../models/user");
const bcrypt = require("bcrypt");

exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const role = "user"; // Set the role to "user" for user registration

  try {
    // Check if the email already exists in the database
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // If the email doesn't exist, create a new user
    const newUser = new UserModel({
      name,
      email,
      password,
      role,
    });

    const hashedPassword = await bcrypt.hash(password, 10);
    newUser.password = hashedPassword;
    await newUser.save();

    res.status(201).json({ message: "User registration successful" }); 
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Error registering user" });
  }
};


exports.registerBarber = async (req, res) => {
  const { name, email, password, shopname, businessTimings, services } = req.body;
  const role = "barber"; // Set the role to "barber" for barber registration

  try {
    const newBarber = new UserModel({
      name,
      email,
      password,
      role,
      shopname,
      businessTimings,
      services,
    });

    const hashedPassword = await bcrypt.hash(password, 10);
    newBarber.password = hashedPassword;
    await newBarber.save();

    res.status(201).json({ message: "Barber registration successful" });
  } catch (error) {
    console.error("Error registering barber:", error);
    res.status(500).json({ error: "Error registering barber" });
  }
};

exports.registerAdmin = async (req, res) => {
  const { name, email, password } = req.body;
  const role = "admin"; // Set the role to "admin" for admin registration

  try {
    const newAdmin = new UserModel({
      name,
      email,
      password,
      role,
      // Add other admin-specific fields as needed
    });

    const hashedPassword = await bcrypt.hash(password, 10);
    newAdmin.password = hashedPassword;
    await newAdmin.save();

    res.status(201).json({ message: "Admin registration successful" });
  } catch (error) {
    console.error("Error registering admin:", error);
    res.status(500).json({ error: "Error registering admin" });
  }
};


exports.getAllUsers = async (req, res) => {
  try {
    const users = await UserModal.find();

    res.status(200).json({
      message: "Users retrieved successfully",
      users,
    });
    } catch (error) {
      res.status(500).json({ error: "Error retrieving users" });
    }
    };
   