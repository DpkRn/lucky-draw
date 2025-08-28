const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');

router.post('/location', locationController.updateLocation);
router.get('/locations', locationController.getLocations);

module.exports = router;
