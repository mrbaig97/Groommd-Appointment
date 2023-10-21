const express = require("express");
const router = express.Router();
const multer = require("multer");
const UserModel = require("../models/user");
const {getAllUsers} = require("../controllers/user");
const userController = require("../controllers/user");
const validImageExtensions = ["jpg", "jpeg", "png", "gif"]; // Define valid image extensions

router.get("/", (req, res) => {
  res.json({ message: "Welcome to API" });
});

const businessImages = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify the destination directory for uploaded files
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
  },
});

// Create a Multer instance with the storage strategy
const upload = multer({ storage: businessImages });

// Use Multer middleware for specific routes
router.post('/upload', upload.array('images'), async (req, res) => {

  try {
    // Check if there are uploaded files
    if (req.files && req.files.length > 0) {
      // Get the userId from the request body
      const userId = req.body.userId;
  
      // Find the user based on the provided userId
      const user = await UserModel.findOne({ _id: userId });
  
      if (user) {
        // Iterate through the uploaded files
        for (const file of req.files) {
          const fileExtension = file.originalname.split(".").pop().toLowerCase();
          
          // Check if the file extension is valid
          if (validImageExtensions.includes(fileExtension)) {
            // Create an image object with the file URL and push it to the 'images' array
            user.images.push({ path: file.path });
          } else {
            // Invalid file extension
            return res.status(400).json({ error: `Invalid file extension for file: ${file.originalname}` });
          }
        }
  
        // Save the updated user document
        await user.save();
        res.status(200).json({ message: 'File(s) uploaded successfully' });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } else {
      res.status(400).json({ error: 'No files uploaded' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error uploading files' });
  }
  
});
router.get("/images", async (req, res) => {
  try {
    // Find all users in the database
    const users = await UserModel.find({});

    // Extract and accumulate all images from all users
    const allImages = users.reduce((acc, user) => {
      return acc.concat(user.images);
    }, []);

    res.status(200).json(allImages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching images" });
  }
});

// Register a new user
router.post("/register/user", userController.registerUser);

// Register a new barber
router.post("/register/barber", userController.registerBarber);

// Register a new admin
router.post("/register/admin", userController.registerAdmin);
// Example usage:
// To register a user: POST /register/user
// To register a barber: POST /register/barber
// To register an admin: POST /register/admin

//get all users
router.get('/users', getAllUsers);

module.exports = router;
