// In-memory user location model
const userLocations = {};

function updateUserLocation(userId, lat, lng) {
  userLocations[userId] = { lat, lng, timestamp: Date.now() };
}

function getAllUserLocations() {
  return userLocations;
}

module.exports = {
  updateUserLocation,
  getAllUserLocations,
};
