/* hardhat.config.js */
require("@nomiclabs/hardhat-waffle")
require("dotenv").config()

const PRIVATE_KEY  = process.env.PRIVATE_KEY
const ALCHEMY_KEY = process.env.ALCHEMY_KEY

console.log(PRIVATE_KEY)
console.log(ALCHEMY_KEY)


module.exports = {
  defaultNetwork: "mumbai",
  networks: {
    hardhat: {
      chainId: 1337
    },
    mumbai: {
      url: "https://polygon-mumbai.g.alchemy.com/v2/" + ALCHEMY_KEY,
      accounts: [PRIVATE_KEY]
    }
  },
  solidity: {
    version: "0.8.3",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}