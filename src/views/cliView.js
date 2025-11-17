const readline = require('readline');
const colors = require('../core/colors');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) =>
  new Promise((resolve) => rl.question(query, resolve));

function showMainMenu() {
  console.log();
  console.log(`${colors.white}--- Choose Your Menu ---${colors.reset}`);
  console.log(`1. Simulate Transactions`);
  console.log(`2. Launch Token`);
  console.log(`3. Register Domain`);
  console.log(`0. Exit${colors.reset}`);
}

function printWallets(wallets) {
  console.log(`\n${colors.cyan}Available wallets:${colors.reset}`);
  wallets.forEach((wallet, i) => {
    console.log(`${colors.white}${i + 1}. ${wallet.address}${colors.reset}`);
  });
}

function printWalletHeader(i, total, address) {
  console.log(`\n${colors.cyan}[Wallet ${i + 1}/${total}] ${address}${colors.reset}`);
}

function exitApp(message) {
  if (message) {
    console.log(message);
  }
  rl.close();
  process.exit(0);
}

module.exports = {
  question,
  showMainMenu,
  printWallets,
  printWalletHeader,
  exitApp,
  rl
};
