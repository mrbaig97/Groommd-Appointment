const express = require("express");
const router = express.Router();
const subserviceController = require("../controllers/subServices");

router.post("/subservices", subserviceController.createSubservice);
router.get("/subservices", subserviceController.getSubservices);
router.delete("/subservices/:id", subserviceController.deleteSubservice);




module.exports = router;
