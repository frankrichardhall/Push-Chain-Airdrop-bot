const logger = require('../core/logger');
const colors = require('../core/colors');
const { loadWalletsFromFile } = require('../models/walletModel');
const { question, showMainMenu, exitApp } = require('../views/cliView');

const { handleSimulateTransactions } = require('./transactionController');
const { handleLaunchTokenMenu } = require('./tokenController');
const { handleRegisterDomain } = require('./domainController');

async function mainMenu() {
  showMainMenu();
  const choice = await question('Select option: ');

  switch (choice) {
    case '1':
      await handleSimulateTransactions();
      break;
    case '2':
      await handleLaunchTokenMenu();
      break;
    case '3':
      await handleRegisterDomain();
      break;
    case '0':
      logger.info('Goodbye!');
      exitApp();
      return;
    default:
      logger.error('Invalid option');
  }

  await mainMenu();
}

function start() {
  logger.banner();

  const wallets = loadWalletsFromFile();
  console.log(`${colors.green}[✓] Found ${wallets.length} wallet(s) in privateKeys.json${colors.reset}`);

  mainMenu();
}

module.exports = {
  start
};
