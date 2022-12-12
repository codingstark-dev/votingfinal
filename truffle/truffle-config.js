const HDWalletProvider  = require('@truffle/hdwallet-provider');

require('dotenv').config();

const mnemonic = "chaos fame moon match lion impact seven mango luxury model harbor avoid";
const infuraProjectId = "41eb383440a04213bc13f509be85f90a";

module.exports = {

  contracts_build_directory: "../client/src/contracts",
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
    },
    goerli: {
      provider: () => {
        return new HDWalletProvider(mnemonic, 'https://goerli.infura.io/v3/' + infuraProjectId)
      },
      network_id: '5'
    },
  },

  mocha: {
  },

  compilers: {
    solc: {
      version: "0.8.17",
    }
  },
};
