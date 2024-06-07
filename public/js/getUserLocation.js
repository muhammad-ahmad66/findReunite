export const getUserLocationDetails = async function () {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          getDetails(latitude, longitude)
            .then((details) => resolve(details))
            .catch((error) => reject(error));
        },
        (error) => {
          reject(showError(error));
        },
      );
    } else {
      reject(new Error('Geolocation is not supported by this browser.'));
    }
  });
};

async function getDetails(lat, lon) {
  const apiKey = 'ccd1b9ec79ba425fb8f128482f3edb78'; // Replace with your OpenCage API key
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.results.length > 0) {
      const components = data.results[0].components;
      return {
        city: components.city || components.town || components.village,
        country: components.country,
      };
    } else {
      throw new Error('No results found');
    }
  } catch (error) {
    throw new Error('Geocoder failed due to: ' + error.message);
  }
}

function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return 'User denied the request for Geolocation.';
    case error.POSITION_UNAVAILABLE:
      return 'Location information is unavailable.';
    case error.TIMEOUT:
      return 'The request to get user location timed out.';
    case error.UNKNOWN_ERROR:
      return 'An unknown error occurred.';
    default:
      return 'An unknown error occurred.';
  }
}
