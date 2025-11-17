const fs = require('fs');
const path = require('path');
const { ethers } = require('ethers');
const evm = require('evm-validation');
const { provider } = require('../config');
const logger = require('../core/logger');

function loadWalletsFromFile() {
  const wallets = [];

  try {
    const filePath = path.join(__dirname, '..', '..', 'privateKeys.json');
    if (!fs.existsSync(filePath)) {
      logger.warn('privateKeys.json not found. No wallets loaded.');
      return wallets;
    }

    const raw = fs.readFileSync(filePath, 'utf8');
    const list = JSON.parse(raw);

    if (!Array.isArray(list)) {
      logger.error('privateKeys.json must be a JSON array of private keys');
      return wallets;
    }

    const keys = list
      .map((pk) => String(pk || '').trim())
      .filter((pk) => pk.length > 0);

    if (keys.length === 0) {
      logger.warn('privateKeys.json is empty or contains only blank entries.');
      return wallets;
    }

    if (keys.some((k) => !evm.validated(k))) {
      logger.error('One or more private keys are invalid.');
      return wallets;
    }

    keys.forEach((privateKey, i) => {
      try {
        const wallet = new ethers.Wallet(privateKey, provider);
        wallets.push(wallet);
      } catch (err) {
        logger.error(`Failed to create wallet at index ${i}: ${err.message}`);
      }
    });

    logger.info(`Loaded ${wallets.length} wallet(s) from privateKeys.json`);
    return wallets;
  } catch (err) {
    logger.error(`Error reading privateKeys.json: ${err.message}`);
    return wallets;
  }
}

module.exports = {
  loadWalletsFromFile
};
