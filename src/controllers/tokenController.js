const logger = require('../core/logger');
const colors = require('../core/colors');
const { loadWalletsFromFile } = require('../models/walletModel');
const { question, printWallets } = require('../views/cliView');
const { launchToken } = require('../services/transactionService');

async function handleLaunchTokenMenu() {
  const wallets = loadWalletsFromFile();
  if (wallets.length === 0) {
    logger.error('No wallets found in privateKeys.json');
    return;
  }

  printWallets(wallets);

  const walletIndex = await question('Select wallet number: ');
  const index = parseInt(walletIndex) - 1;

  if (isNaN(index) || index < 0 || index >= wallets.length) {
    logger.error('Invalid wallet selection');
    return;
  }

  console.log(`\n${colors.yellow}Enter token details:${colors.reset}`);
  const name = await question('Token Name: ');
  const symbol = await question('Token Symbol: ');
  const supply = await question('Total Supply (e.g., 10000000): ');
  const description = await question('Description: ');
  const image = await question('Image URL (optional): ');
  const website = await question('Website (optional): ');
  const twitter = await question('Twitter (optional): ');
  const telegram = await question('Telegram (optional): ');

  const tokenData = {
    name,
    symbol,
    supply,
    description,
    image,
    website,
    twitter,
    telegram
  };

  await launchToken(wallets[index], tokenData);
}

module.exports = {
  handleLaunchTokenMenu
};
