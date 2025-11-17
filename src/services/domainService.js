const { ethers } = require('ethers');
const { abiCoder, DOMAIN_REGISTRAR_CONTRACT } = require('../config');
const logger = require('../core/logger');

const REGISTER_SELECTOR = '0xe9f36aef';

async function registerDomain(wallet, domainName, chainId, metadataJson, valueEth = '0.01') {
  const encodedArgs = abiCoder.encode(
    ['string', 'uint256', 'address', 'string'],
    [domainName, chainId, wallet.address, metadataJson]
  );
  const data = REGISTER_SELECTOR + encodedArgs.slice(2);

  logger.loading(`Registering domain "${domainName}" for ${wallet.address} ...`);

  try {
    const tx = {
      to: DOMAIN_REGISTRAR_CONTRACT,
      value: ethers.parseEther(valueEth),
      data
    };

    const txResponse = await wallet.sendTransaction(tx);
    logger.success(`Domain tx sent: ${txResponse.hash}`);

    const receipt = await txResponse.wait();
    if (receipt.status === 1) {
      logger.success(`Domain "${domainName}" registered successfully!`);
    } else {
      logger.error('Domain registration tx reverted');
    }

    return receipt;
  } catch (err) {
    logger.error(`Domain registration error: ${err.message}`);
    throw err;
  }
}

module.exports = {
  registerDomain
};
