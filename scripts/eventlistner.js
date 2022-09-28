// const hre = require('hardhat');
// const { ethers } = require("hardhat");
var Web3 = require("web3");
require("dotenv").config();

const ALCHEMY_Provider = `${process.env.ALCHEMY_RINKEBY_URL}`;
const web3 = new Web3(new Web3.providers.WebsocketProvider(ALCHEMY_Provider));

const contractAddress = "0x7C455c0610C0c2Beb857eC522983C0da7BB8A147";
const contractAbi = require("../build/abi.json");

const NFTContract = new web3.eth.Contract(contractAbi, contractAddress);
// var blockNumber = web3.eth.getBlock("latest");
// web3.eth.getBlock("latest").then(console.log);
// console.log(blockNumber, "is the current block no.");

NFTContract.events
  .TransferSingle(
    // {
    //   fromBlock: blockNumber,
    // },
    (error, event) => {
      console.log(event);
    }
  )
  .on("connected", (subscriptionId) => {
    console.log({subscriptionId});
  })
  .on("data", (event) => {
    console.log(event);
  })
  .on("changed", (event) => {
    //remove event from local database
  })
  .on("error", (error, receipt) => {
    // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt....
  });
