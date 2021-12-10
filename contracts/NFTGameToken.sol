// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTGameToken is ERC721, Ownable {

    constructor() ERC721("NFTGameToken", "NFTG") {}

    enum type_character { BERSERKER, SPIRITUAL, ELEMENTARY }
    uint256 nextId = 0;
    uint256 mintFee = 1 ether;
    uint256 healFee = 0.001 ether;
    uint256 fightFee = 0.001 ether;

    struct Character {
        uint256 id;
        uint256 dna;
        // uint8 level;
        uint256 xp;
        uint256 hp;
        uint8 attack;
        uint8 armor;
        // uint8 speed;     
        uint8 mana;
        uint8 magicResistance;
        type_character typeCharacter;
    }

    mapping(uint256 => Character) private _characterDetails;

    // events
    event CharacterCreated(uint256 dna);
    event Healed(uint tokenId);
    event Fighted(uint myTokenId, uint rivalTokenId);

    // Helper
    function _generateRandomNum(uint256 _mod) internal view returns(uint256) {
        uint256 randNum = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender)));
        return randNum % _mod;
    }
    
    function updateFees(uint256 _mintFee, uint256 _healFee, uint256 _fightFee) external onlyOwner() {
        mintFee = _mintFee;
        healFee = _healFee;
        fightFee = _fightFee;
    }
    
    function withdraw() external onlyOwner() {
        payable(owner()).transfer(address(this).balance);
    }

    function createCharacter(type_character _typeCharacter) external payable {
        require(msg.value == mintFee, "Wrong amount of fees");
        require(balanceOf(msg.sender) < 5, "You can't have more than 5 NFT");
        require(_typeCharacter == type_character.BERSERKER || _typeCharacter == type_character.SPIRITUAL || _typeCharacter == type_character.ELEMENTARY,
        "You must choose between berserker, spiritual or elementary");
        uint256 dna = _generateRandomNum(10**16);
        if (_typeCharacter == type_character.BERSERKER) {
            _characterDetails[nextId] = Character(nextId, dna, 1, 100, 5, 3, 1, 1, type_character.BERSERKER);
        }
        if (_typeCharacter == type_character.SPIRITUAL) {
            _characterDetails[nextId] = Character(nextId, dna, 1, 100, 1, 1, 5, 3, type_character.SPIRITUAL);
        }
        if (_typeCharacter == type_character.ELEMENTARY) {
            _characterDetails[nextId] = Character(nextId, dna, 1, 100, 2, 2, 3, 3, type_character.ELEMENTARY);
        }
        _safeMint(msg.sender, nextId);
        nextId++;
        emit CharacterCreated(dna);
    }

    function heal(uint _tokenId) external payable {
        require(msg.value == healFee, "Wrong amount of fees");
        require(ownerOf(_tokenId) == msg.sender, "You're not the owner of the NFT");
        require(_characterDetails[_tokenId].hp > 0, "You're NFT is dead");
        uint256 tempResult = _characterDetails[_tokenId].hp + 50;
        if (tempResult > 100) {
            _characterDetails[_tokenId].hp = 100;
        } else {
            _characterDetails[_tokenId].hp += 50;
        }
        emit Healed(_tokenId);
    }

    function fight(uint _myTokenId, uint _rivalTokenId) external payable {
        require(msg.value == fightFee, "Wrong amount of fees");
        require(ownerOf(_myTokenId) == msg.sender, "You're not the owner of the NFT");
        require(ownerOf(_myTokenId) != ownerOf(_rivalTokenId), "Your NFTs cannot fight each other");
        require(_characterDetails[_myTokenId].hp > 0 && _characterDetails[_rivalTokenId].hp > 0, "One of the NFTs is dead");

        uint256 substrateLifeToRival = (_characterDetails[_myTokenId].attack * _characterDetails[_myTokenId].xp) - 
        ((_characterDetails[_rivalTokenId].armor * _characterDetails[_rivalTokenId].xp) / 2);
        uint256 substrateLifeToMe = (_characterDetails[_rivalTokenId].attack * _characterDetails[_rivalTokenId].xp) - 
        ((_characterDetails[_myTokenId].armor * _characterDetails[_myTokenId].xp) / 2);

        if(substrateLifeToRival >= _characterDetails[_rivalTokenId].hp) {
            _characterDetails[_rivalTokenId].hp = 0;
            _characterDetails[_myTokenId].xp++;
        } else {
            _characterDetails[_rivalTokenId].hp -= substrateLifeToRival;
            if(substrateLifeToMe >= _characterDetails[_myTokenId].hp) {
                _characterDetails[_myTokenId].hp = 0;
                _characterDetails[_rivalTokenId].xp++;
            } else {
                _characterDetails[_myTokenId].hp -= substrateLifeToMe;
                if (substrateLifeToRival > substrateLifeToMe) {
                    _characterDetails[_myTokenId].xp++;
                } else if (substrateLifeToMe > substrateLifeToRival) {
                    _characterDetails[_rivalTokenId].xp++;
                } else {
                    _characterDetails[_myTokenId].xp++;
                    _characterDetails[_rivalTokenId].xp++;
                }
            }
        }
        emit Fighted(_myTokenId, _rivalTokenId);
    }

    // Getters
    function getTokenDetails(uint _tokenId) external view returns(Character memory) {
        return _characterDetails[_tokenId];
    }

    function getMyCharacters() public view returns (Character[] memory){
        uint8 count = 0;
        Character[] memory myCharacters = new Character[](balanceOf(msg.sender));
        for (uint i = 0; i < nextId; i++) {
            if (ownerOf(i) == msg.sender) {
                myCharacters[count] = _characterDetails[i];
                count++;
            }
        }
        return myCharacters;
    }

    function getOthersCharacters() public view returns (Character[] memory){
        uint8 count = 0;
        Character[] memory othersCharacters = new Character[](nextId - balanceOf(msg.sender));
        for (uint i = 0; i < nextId; i++) {
            if (ownerOf(i) != msg.sender) {
                othersCharacters[count] = _characterDetails[i];
                count++;
            }
        }
        return othersCharacters;
    }
    
    // only for TESTS getAllCharacters
    function getAllCharacters() public view returns (Character[] memory){
        Character[] memory allCharacters = new Character[](nextId);
        for (uint i = 0; i < nextId; i++) {
            allCharacters[i] = _characterDetails[i];
        }
        return allCharacters;
    }
}
