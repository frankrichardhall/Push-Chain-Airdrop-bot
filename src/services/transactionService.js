const { ethers } = require('ethers');
const logger = require('../core/logger');
const {
  SIMULATE_TX_ADDRESS,
  TOKEN_LAUNCH_CONTRACT
} = require('../config');
const { uploadToPinata } = require('./pinataService');

async function simulateTransaction(wallet, count) {
  try {
    logger.loading(`Simulating ${count} transaction(s)...`);

    const results = [];
    for (let i = 0; i < count; i++) {
      const tx = {
        to: SIMULATE_TX_ADDRESS,
        value: ethers.parseEther('0.001'),
        data: '0x'
      };

      const txResponse = await wallet.sendTransaction(tx);
      logger.success(`Tx ${i + 1}/${count} sent: ${txResponse.hash}`);

      await txResponse.wait();
      logger.success(`Tx ${i + 1}/${count} confirmed`);

      results.push(txResponse.hash);

      if (i < count - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    return results;
  } catch (error) {
    logger.error(`Simulate transaction error: ${error.message}`);
    return [];
  }
}

async function launchToken(wallet, tokenData) {
  try {
    logger.loading(`Launching token ${tokenData.name}...`);

    const metadata = {
      name: tokenData.name,
      description: tokenData.description,
      image: tokenData.image || '',
      external_url: tokenData.external_url || '',
      social_links: {
        website: tokenData.website || '',
        twitter: tokenData.twitter || '',
        telegram: tokenData.telegram || ''
      },
      attributes: [
        { trait_type: 'Platform', value: 'TokenLaunch' },
        { trait_type: 'Network', value: 'Push Chain' },
        { trait_type: 'Created', value: new Date().toISOString() }
      ]
    };

    const ipfsHash = await uploadToPinata(metadata);
    if (!ipfsHash) {
      throw new Error('Failed to upload metadata to IPFS');
    }

    logger.success(`Metadata uploaded to IPFS: ${ipfsHash}`);

    const iface = new ethers.Interface([
      'function createToken(tuple(string name, string symbol, uint256 totalSupply, string uri, uint256 maxBuyPercentage, address creator) params)'
    ]);

    const params = {
      name: tokenData.name,
      symbol: tokenData.symbol,
      totalSupply: ethers.parseEther(tokenData.supply),
      uri: `ipfs://${ipfsHash}`,
      maxBuyPercentage: tokenData.maxBuyPercentage || 5000,
      creator: wallet.address
    };

    const data = iface.encodeFunctionData('createToken', [params]);

    const tx = {
      to: TOKEN_LAUNCH_CONTRACT,
      value: ethers.parseEther('0.01'),
      data
    };

    const txResponse = await wallet.sendTransaction(tx);
    logger.success(`Token launch transaction sent: ${txResponse.hash}`);

    const receipt = await txResponse.wait();
    logger.success('Token launched successfully!');
    logger.info(`Transaction Hash: ${receipt.hash}`);

    return receipt.hash;
  } catch (error) {
    logger.error(`Launch token error: ${error.message}`);
    return null;
  }
}

module.exports = {
  simulateTransaction,
  launchToken
};
