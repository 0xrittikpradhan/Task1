const Web3 = require('web3');
require('dotenv').config()

const ALCHEMY_Provider = `${process.env.ALCHEMY_RINKEBY_URL}`;
const web3 = new Web3(ALCHEMY_Provider);

const contractAddress = "0x7C455c0610C0c2Beb857eC522983C0da7BB8A147";
const contractAbi = require("../build/abi.json");

const contract = new web3.eth.Contract(contractAddress, contractAbi);

console.log(contract);

async function getEvents() {
    var blockNumber = await (await web3.eth.getBlock("latest")).number;
    console.log(blockNumber, "is the current block no.");

    const events = await contract.getPastEvents(
        'TransferSingle',
        { fromBlock: 0, toBlock: blockNumber}
    );

    console.log(events);

    // await getTransferDetails(events);
}

async function getTransferDetails(eventsData) {
    for (i = 0; i < eventsData.length; i++) {
        let from = eventsData[i]['returnValues']['from'];
        let to = eventsData[i]['returnValues']['to'];
        let amount = eventsData[i]['returnValues']['amount'];
        let converted_amount = web3.utils.fromWei(amount);
        if (converted_amount > 32) { //checking for transcations with above 32 eth as an example
            console.log("From:", from, "- To:", to, "- Value:", converted_amount);
        }
    };
}

getEvents(contractAddress, contractAbi);