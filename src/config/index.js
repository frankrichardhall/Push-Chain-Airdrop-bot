const { ethers } = require('ethers');

const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0"
];

const getRandomUserAgent = () =>
  USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];

const RPC_URL = 'https://evm.donut.rpc.push.org/';
const PINATA_URL = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';

const TOKEN_LAUNCH_CONTRACT = '0xFB07792D0F71C7e385aC220bEaeF0cbF187233A0';
const SIMULATE_TX_ADDRESS = '0xFaE3594C68EDFc2A61b7527164BDAe80bC302108';
const DOMAIN_REGISTRAR_CONTRACT = '0x84c48f4995Db90e9feD4c46d27e6468A5172Fc49';

const PINATA_API_KEY = '4d6d1b9e4e595455bc33';
const PINATA_SECRET_API_KEY = '22b97a9fd13a421aeea516665328df5d3c9335d9194ab3dff9f80347a571d520';

const provider = new ethers.JsonRpcProvider(RPC_URL);
const abiCoder = new ethers.AbiCoder();

module.exports = {
  USER_AGENTS,
  getRandomUserAgent,
  RPC_URL,
  PINATA_URL,
  TOKEN_LAUNCH_CONTRACT,
  SIMULATE_TX_ADDRESS,
  DOMAIN_REGISTRAR_CONTRACT,
  PINATA_API_KEY,
  PINATA_SECRET_API_KEY,
  provider,
  abiCoder
};
