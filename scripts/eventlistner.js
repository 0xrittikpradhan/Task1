const hre = require('hardhat');
const { ethers } = require("hardhat");
var Web3 = require('web3');
require('dotenv').config();

async function main() {

    // const NFTContract = await (await hre.ethers.getContractFactory("NFTContract"))
    //     .attach("0xd9145CCE52D386f254917e481eB44e9943F39138");  -- local
    const NFTContract = await (await hre.ethers.getContractFactory("NFTContract"))
        .attach("0x7C455c0610C0c2Beb857eC522983C0da7BB8A147");

    const ALCHEMY_Provider = `${process.env.ALCHEMY_RINKEBY_URL}`;
    var web3 = new Web3(new Web3.providers.HttpProvider(ALCHEMY_Provider));
    var blockNumber = await (await web3.eth.getBlock("latest")).number;
    console.log(blockNumber, "is the current block no.");

    // NFTContract.interface.events.TransferSingle({
    //     fromBlock: blockNumber
    // }, (error, event) => {
    //     console.log(event);
    // })
    // .on("connected", (subscriptionId) => {
    //     console.log(subscriptionId)
    // })
    // .on('data', (event) => {
    //     console.log(event)
    // })
    // .on('changed', (event) => {
    //     //remove event from local database
    // })
    // .on('error', (error, receipt) => {
    //     // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt....
    // });
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
