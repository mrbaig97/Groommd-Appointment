const express = require('express');
const router = express.Router();
const {createService,getAllServices,deleteService} = require('../controllers/services');

// Create a new service
router.post('/services', createService);

// Get all services
router.get('/services', getAllServices);

// Delete a service by ID
router.delete('/services/:id', deleteService);

module.exports = router;
