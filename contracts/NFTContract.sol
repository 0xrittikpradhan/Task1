//SPDX-License-Identifier: None

pragma solidity ^0.8.17;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract NFTContract is ERC1155 {
    uint256 public constant taskToken = 0;
    constructor() ERC1155("https://game.example/api/item/{id}.json") {
        _mint(msg.sender, taskToken, 10 * 10 ** 18, "");
    }
}