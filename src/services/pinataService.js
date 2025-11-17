const axios = require('axios');
const {
  PINATA_URL,
  PINATA_API_KEY,
  PINATA_SECRET_API_KEY,
  getRandomUserAgent
} = require('../config');
const logger = require('../core/logger');

async function uploadToPinata(metadata) {
  try {
    const response = await axios.post(
      PINATA_URL,
      {
        pinataContent: metadata,
        pinataMetadata: {
          name: `${metadata.name}-metadata`,
          keyvalues: {
            tokenName: metadata.name,
            platform: 'TokenLaunch',
            network: 'PushChain',
            timestamp: new Date().toISOString()
          }
        }
      },
      {
        headers: {
          'content-type': 'application/json',
          'pinata_api_key': PINATA_API_KEY,
          'pinata_secret_api_key': PINATA_SECRET_API_KEY,
          'User-Agent': getRandomUserAgent()
        }
      }
    );

    return response.data.IpfsHash;
  } catch (error) {
    logger.error(`Pinata upload error: ${error.message}`);
    return null;
  }
}

module.exports = {
  uploadToPinata
};
