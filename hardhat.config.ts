import "@typechain/hardhat";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
require("@nomiclabs/hardhat-waffle");
require("dotenv").config({ path: ".env" });

const MORALIS_API_KEY_URL = process.env.MORALIS_API_KEY_URL;

const MUMBAI_PRIVATE_KEY = process.env.MUMBAI_PRIVATE_KEY;

module.exports = {
  solidity: "0.8.7",
  networks: {
    mumbai: {
      url: MORALIS_API_KEY_URL,
      accounts: [MUMBAI_PRIVATE_KEY],
    },
  },
};
