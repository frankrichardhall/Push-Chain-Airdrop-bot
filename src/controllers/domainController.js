const logger = require('../core/logger');
const { loadWalletsFromFile } = require('../models/walletModel');
const { question, printWallets } = require('../views/cliView');
const { registerDomain } = require('../services/domainService');

async function handleRegisterDomain() {
  const wallets = loadWalletsFromFile();
  if (wallets.length === 0) {
    logger.error('No wallets found in privateKeys.json');
    return;
  }

  printWallets(wallets);

  const walletIndex = await question('Select wallet number for domain registration: ');
  const index = parseInt(walletIndex) - 1;

  if (isNaN(index) || index < 0 || index >= wallets.length) {
    logger.error('Invalid wallet selection');
    return;
  }

  let domainName = await question('Enter domain (e.g., vikitoshi.push): ');
  domainName = (domainName || '').trim().toLowerCase();

  if (!domainName) {
    logger.error('Domain cannot be empty');
    return;
  }

  if (!domainName.includes('.')) {
    domainName = `${domainName}.push`;
    logger.info(`No TLD detected, using: ${domainName}`);
  }

  const chainId = 42101;
  const metadata = {
    registeredBy: 'PushChain Auto Bot',
    timestamp: Date.now()
  };
  const metadataJson = JSON.stringify(metadata);

  await registerDomain(wallets[index], domainName, chainId, metadataJson, '0.01');
}

module.exports = {
  handleRegisterDomain
};
