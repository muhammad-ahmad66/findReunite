const fs = require('fs');
const FormData = require('form-data');

const apiKey = 'acc_d56c327e74087cb';
const apiSecret = '06615fe79777a2b5248051388e88b9b2';

const detectFaces = async (filePath) => {
  if (!fs.existsSync(filePath)) {
    console.error('Image file does not exist:', filePath);
    throw new Error('Image file does not exist');
  }

  const formData = new FormData();
  formData.append('image', fs.createReadStream(filePath));

  const url = 'https://api.imagga.com/v2/faces/detections?return_face_id=1';

  try {
    // Dynamically import 'got'
    const { default: got } = await import('got');

    const response = await got.post(url, {
      body: formData,
      username: apiKey,
      password: apiSecret,
      responseType: 'json',
    });

    const result = response.body;
    if (
      result.result &&
      result.result.faces &&
      result.result.faces.length > 0
    ) {
      return result.result.faces[0].face_id;
    } else {
      throw new Error('No faces detected');
    }
  } catch (error) {
    console.error('Error response from Imagga API:', error.message);
    if (error.response && error.response.body) {
      console.error('API Error Details:', error.response.body);
    }
    throw error;
  }
};

module.exports = { detectFaces };
