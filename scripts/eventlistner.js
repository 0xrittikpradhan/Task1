// const hre = require('hardhat');
// const { ethers } = require("hardhat");

const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");
const Web3 = require("web3");
require("dotenv").config();

const ALCHEMY_Provider = `${process.env.ALCHEMY_RINKEBY_URL}`;
const web3 = new Web3(new Web3.providers.WebsocketProvider(ALCHEMY_Provider));

const contractAddress = "0x7C455c0610C0c2Beb857eC522983C0da7BB8A147";
const contractAbi = require("../build/abi.json");

const NFTContract = new web3.eth.Contract(contractAbi, contractAddress);
// var blockNumber = web3.eth.getBlock("latest");
// web3.eth.getBlock("latest").then(console.log);
// console.log(blockNumber, "is the current block no.");

const uri =
  "mongodb+srv://0xrittikpradhan:s3ni79lQcElpJS4v@cluster0.fuglox2.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

// await mongoose.connect("mongodb+srv://0xrittikpradhan:s3ni79lQcElpJS4v@cluster0.fuglox2.mongodb.net/?retryWrites=true&w=majority");

try {
  //   console.log(client);
  NFTContract.events
    .TransferSingle(
      // {
      //   fromBlock: blockNumber,
      // },
      (error, event) => {
        console.log("Event Listen: Success");
      }
    )
    .on("connected", (subscriptionId) => {
      console.log({ subscriptionId });
    })
    .on("data", (event) => {

      const eventDetails = {
        "Block_Number" : event.blockNumber.toString(),
        "Event_Name" : event.event.toString(),
        "Operator_Address" : event.returnValues.operator.toString(),
        "From_Address" : event.returnValues.from.toString(),
        "To_Address" : event.returnValues.to.toString(),
        "Token_Id" : event.returnValues.id.toString(),
        "Token_Amount" : event.returnValues.value.toString()
      };
      console.log(eventDetails);
        await client.connect();
      
        await createListing(client, eventDetails);
    })
    .on("changed", (event) => {
      //remove event from local database
    })
    .on("error", (error, receipt) => {
      // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt....
    });
} catch (e) {
  console.error(e);
} finally {
    await client.close();
}

async function createListing(client, event) {
  const result = await client
    .db("Addresses")
    .collection("SingleTransferEvent")
    .insert(event);
  console.log(
    "New listing created with the following id: ${result.insertedId}"
  );
}

// main().catch(console.error);
