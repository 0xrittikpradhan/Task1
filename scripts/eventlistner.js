// const hre = require('hardhat');
// const { ethers } = require("hardhat");
// const mongoose = require("mongoose");

const { MongoClient } = require("mongodb");
const express = require("express");
const Web3 = require("web3");
require("dotenv").config();

const ALCHEMY_Provider = `${process.env.ALCHEMY_RINKEBY_URL}`;
const web3 = new Web3(new Web3.providers.WebsocketProvider(ALCHEMY_Provider));
const app = express();

// Old Token Contract 
// const contractAddress = "0x7C455c0610C0c2Beb857eC522983C0da7BB8A147";
// const contractAbi = require("../build/abi.json");

const contractAddress = "0x71D93540154882ec5a28D8D61c3249A856C7B494";
const contractAbi = require("../build/newTokenABI.json");

const NFTContract = new web3.eth.Contract(contractAbi, contractAddress);
// var blockNumber = web3.eth.getBlock("latest");
// web3.eth.getBlock("latest").then(console.log);
// console.log(blockNumber, "is the current block no.");

const uri =
  "mongodb+srv://0xrittikpradhan:s3ni79lQcElpJS4v@cluster0.fuglox2.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

//Listning Transfer Events which are being emitted on ERC1155 Token Transfer.

// await mongoose.connect("mongodb+srv://0xrittikpradhan:s3ni79lQcElpJS4v@cluster0.fuglox2.mongodb.net/?retryWrites=true&w=majority");

NFTContract.events
  .TransferSingle(
    // {
    //   fromBlock: blockNumber,
    // },
    (error, event) => {
      try {
        const eventDetails = {
          Tx_Hash: event.transactionHash,
          Block_Number: event.blockNumber.toString(),
          Event_Name: event.event.toString(),
          Operator_Address: event.returnValues.operator.toString(),
          From_Address: event.returnValues.from.toString(),
          To_Address: event.returnValues.to.toString(),
          Token_Id: event.returnValues.id.toString(),
          Token_Amount: event.returnValues.value.toString(),
        };
        // console.log(eventDetails);
        client.connect();
        createListing(client, eventDetails);
      } catch (e) {
        console.error(e);
      } finally {
        // client.close();
      }
    }
  )
  .on("connected", (subscriptionId) => {
    console.log({ subscriptionId });
  })
  .on("data", (event) => {
    // console.log(event);
  })
  .on("changed", (event) => {
    //remove event from local database
  })
  .on("error", (error, receipt) => {
    // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt....
  });

NFTContract.events
  .TransferBatch(
    // {
    //   fromBlock: blockNumber,
    // },
    (error, event) => {
      try {
        client.connect();
        event.returnValues.ids.forEach((id) => {
          const index = event.returnValues.ids.indexOf(id);
          const value = event.returnValues.values[index];
          const eventDetails = {
            Tx_Hash: event.transactionHash,
            Block_Number: event.blockNumber.toString(),
            Event_Name: event.event.toString(),
            Operator_Address: event.returnValues.operator.toString(),
            From_Address: event.returnValues.from.toString(),
            To_Address: event.returnValues.to.toString(),
            Token_Id: id.toString(),
            Token_Amount: value.toString(),
          };
          createListing(client, eventDetails);
        });

      } catch (e) {
        console.error(e);
      } finally {
        // client.close();
      }
    }
  )
  .on("connected", (subscriptionId) => {
    console.log({ subscriptionId });
  })
  .on("data", (event) => {
    // console.log(event);
  })
  .on("changed", (event) => {
    //remove event from local database
  })
  .on("error", (error, receipt) => {
    // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt....
  });

async function createListing(client, eventDetails) {
  const checkTXHash = await client.db("Addresses")
  .collection("TransferEvent")
    .findOne({ Tx_Hash: eventDetails.Tx_Hash, Token_Id: eventDetails.Token_Id });
  if (checkTXHash === null) {
    console.log("Inserting into DB Collection...");
    const result = await client
      .db("Addresses")
      .collection("TransferEvent")
      .insertOne(eventDetails);
    console.log(
      `New listing created with the following id: ${result.insertedId}`
    );
  }
  else {
    console.log("Hash Already Exists");
  }
}

// main().catch(console.error);
