const axios = require('axios');

async function getCurrentCityAndCountry(ipAddress) {
  try {
    const response = await axios.get(`http://ip-api.com/json/${ipAddress}`);
    const { city, country } = response.data;
    return { city, country };
  } catch (error) {
    console.error('Error fetching location:', error);
    // Default to unknown if location cannot be determined
    return { city: 'unknown', country: 'unknown' };
  }
}

module.exports = getCurrentCityAndCountry;
