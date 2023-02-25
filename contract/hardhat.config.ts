import { HardhatUserConfig } from "hardhat/config"
import "@nomicfoundation/hardhat-toolbox"
require("dotenv").config()

const config: HardhatUserConfig = {
  networks: {
    hardhat: {},
    goerli: {
      url: process.env.ALCHEMY_URL,
      accounts: [process.env.PRIVATE_KEY ?? ""],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
      },
    },
  },
}

export default config
