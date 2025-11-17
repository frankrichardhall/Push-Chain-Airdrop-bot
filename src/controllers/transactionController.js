const logger = require('../core/logger');
const colors = require('../core/colors');
const { loadWalletsFromFile } = require('../models/walletModel');
const { question } = require('../views/cliView');
const { simulateTransaction } = require('../services/transactionService');

async function handleSimulateTransactions() {
  const wallets = loadWalletsFromFile();
  if (wallets.length === 0) {
    logger.error('No wallets found in privateKeys.json');
    return;
  }

  logger.info(`Found ${wallets.length} wallet(s) in privateKeys.json`);
  const count = await question('How many transactions to simulate per wallet? ');
  const txCount = parseInt(count);

  if (isNaN(txCount) || txCount <= 0) {
    logger.error('Invalid transaction count');
    return;
  }

  for (let i = 0; i < wallets.length; i++) {
    console.log(`\n${colors.cyan}[Wallet ${i + 1}/${wallets.length}] ${wallets[i].address}${colors.reset}`);
    await simulateTransaction(wallets[i], txCount);
  }
}

module.exports = {
  handleSimulateTransactions
};
