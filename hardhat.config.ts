require("@nomiclabs/hardhat-waffle");
require("dotenv").config({ path: ".env" });

const MORALIS_API_KEY_URL = process.env.MORALIS_API_KEY_URL;

const MUMBAI_PRIVATE_KEY = process.env.MUMBAI_PRIVATE_KEY;

module.exports = {
  solidity: "0.8.7",
  networks: {
    forking: {
      url: MORALIS_API_KEY_URL,
    },
    mumbai: {
      accounts: [MUMBAI_PRIVATE_KEY],
    },
  },
};
