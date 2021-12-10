// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Token is ERC721, Ownable {

    constructor() ERC721("NFTGAME", "NFTG") {}

    uint256 count = 0;

    uint256 fee = 0.001 ether;

    struct Caracter {
        uint256 id;
        uint256 dna;
        uint8 level;
        uint8 hp;
        uint8 mana;
        uint8 magicResistance;
        uint8 attack;
        uint8 armor;
        uint8 speed;
    }

    Caracter[] public caracters;

    function createCaracter() external payable {
        require(msg.value == fee, "Incorrect amount");
        uint8[] memory _attributes = _attributesDistribution();
        caracters.push(Caracter(count, _generateRandomNumber(10**16, 1), 1, 100, _attributes[0], _attributes[1], _attributes[2], _attributes[3], _attributes[4]));
        _safeMint(msg.sender, count);
        count++;
    }

    function updateFee(uint256 _fee) external onlyOwner() {
        fee = _fee;
    }

    function withdraw() external payable onlyOwner() {
        payable(owner()).transfer(address(this).balance);
    }

    // Helpers
    function _generateRandomNumber(uint256 _mod, uint8 num) internal view returns(uint256) {
        return uint256(keccak256(abi.encodePacked(num, block.timestamp, block.difficulty, msg.sender))) % _mod;
    }

    function _attributesDistribution() public view returns(uint8[] memory) {
        uint8[] memory _attributes = new uint8[](5);
        for(uint8 i=0; i<5; i++) {
            _attributes[i] = 3 + uint8(_generateRandomNumber(3, i)); // idée nft: la lose ou la win, tu obtiens 0 ou 10 points bonus
        }
        return _attributes;
    }

    // Getters
    function getCaracterDetails(uint256 _id) external view returns(Caracter memory) {
        return caracters[_id];
    }
    
    function getAllCaracters() external view returns(Caracter[] memory) {
        return caracters;
    }
}