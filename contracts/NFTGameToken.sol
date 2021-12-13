// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract NFTGameToken is ERC721, Ownable {

    constructor() ERC721("NFTGameToken", "NFTG") {}

    using SafeMath for uint256;

    enum type_character { BERSERKER, SPIRITUAL, ELEMENTARY }
    uint256 nextId = 0;
    uint256 mintFee = 0.001 ether;
    uint256 healFee = 0.00001 ether;
    uint256 fightFee = 0.00001 ether;

    struct Character {
        uint256 id;
        uint256 dna;
        // uint256 level;
        uint256 xp;
        uint256 hp;
        uint256 mana;
        uint256 attack;
        uint256 armor;
        // uint256 speed;
        uint256 magicAttack;
        uint256 magicResistance;
        type_character typeCharacter;
    }

    mapping(uint256 => Character) private _characterDetails;

    // events
    event CharacterCreated(uint256 id);
    event Healed(uint256 tokenId);
    event Fighted(uint256 myTokenId, uint256 rivalTokenId, uint256 substrateLifeToRival, uint256 substrateLifeToMe);

    // Helper
    function _generateRandomNum(uint256 _mod) internal view returns(uint256) {
        uint256 randNum = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender)));
        return randNum.mod(_mod);
    }
    
    function updateFees(uint256 _mintFee, uint256 _healFee, uint256 _fightFee) external onlyOwner() {
        mintFee = _mintFee;
        healFee = _healFee;
        fightFee = _fightFee;
    }
    
    function withdraw() external onlyOwner() {
        payable(owner()).transfer(address(this).balance);
    }
    
    function substrateLife(uint256 id1, uint256 id2) internal view returns(uint256) {
        uint256 op1 = (_characterDetails[id1].attack).mul((1 + _characterDetails[id1].xp));
        uint256 op2 = (_characterDetails[id2].armor).mul(((1 + _characterDetails[id2].xp).div(2)));
        if (op1 < op2) {
            return 0;
        } else {
            return op1.sub(op2);
        }
    }

    function substrateLifeMagic(uint256 id1, uint256 id2) internal view returns(uint256) {
        uint256 op1 = (_characterDetails[id1].magicAttack).mul((1 + _characterDetails[id1].xp));
        uint256 op2 = (_characterDetails[id2].magicResistance).mul(((1 + _characterDetails[id2].xp).div(2)));
        if (op1 < op2) {
            return 0;
        } else {
            return op1.sub(op2);
        }
    }

    function createCharacter(type_character _typeCharacter) external payable {
        require(msg.value == mintFee, "Wrong amount of fees");
        require(balanceOf(msg.sender) < 5, "You can't have more than 5 NFT");
        require(_typeCharacter == type_character.BERSERKER || _typeCharacter == type_character.SPIRITUAL || _typeCharacter == type_character.ELEMENTARY,
        "You must choose between berserker, spiritual or elementary");
        uint256 dna = _generateRandomNum(10**16);
        if (_typeCharacter == type_character.BERSERKER) {
            _characterDetails[nextId] = Character(nextId, dna, 1, 100, 10, 5, 3, 1, 1, type_character.BERSERKER);
        }
        if (_typeCharacter == type_character.SPIRITUAL) {
            _characterDetails[nextId] = Character(nextId, dna, 1, 100, 100, 1, 1, 5, 3, type_character.SPIRITUAL);
        }
        if (_typeCharacter == type_character.ELEMENTARY) {
            _characterDetails[nextId] = Character(nextId, dna, 1, 100, 50, 2, 2, 3, 3, type_character.ELEMENTARY);
        }
        _safeMint(msg.sender, nextId);
        emit CharacterCreated(nextId);
        nextId++;
    }

    function heal(uint256 _tokenId) external payable {
        require(msg.value == healFee, "Wrong amount of fees");
        require(ownerOf(_tokenId) == msg.sender, "You're not the owner of the NFT");
        require(_characterDetails[_tokenId].hp < 100, "You're character is already healed");
        // require(_characterDetails[_tokenId].hp > 0, "You're NFT is dead");
        uint256 tempResult = (_characterDetails[_tokenId].hp).add(50);
        if (tempResult > 100) {
            _characterDetails[_tokenId].hp = 100;
        } else {
            _characterDetails[_tokenId].hp = (_characterDetails[_tokenId].hp).add(50);
        }
        emit Healed(_tokenId);
    }

    function fight(uint256 _myTokenId, uint256 _rivalTokenId) external payable {
        require(msg.value == fightFee, "Wrong amount of fees");
        require(ownerOf(_myTokenId) == msg.sender, "You're not the owner of the NFT");
        require(ownerOf(_myTokenId) != ownerOf(_rivalTokenId), "Your NFTs cannot fight each other");
        require(_characterDetails[_myTokenId].hp > 0 && _characterDetails[_rivalTokenId].hp > 0, "One of the NFTs is dead");

        uint256 substrateLifeToRival = substrateLife(_myTokenId, _rivalTokenId);
        uint256 substrateLifeToMe = substrateLife(_rivalTokenId, _myTokenId);

        if(substrateLifeToRival >= _characterDetails[_rivalTokenId].hp) {
            _characterDetails[_rivalTokenId].hp = 0;
            _characterDetails[_myTokenId].xp++;
        } else {
            _characterDetails[_rivalTokenId].hp = (_characterDetails[_rivalTokenId].hp).sub(substrateLifeToRival);
            if(substrateLifeToMe >= _characterDetails[_myTokenId].hp) {
                _characterDetails[_myTokenId].hp = 0;
                _characterDetails[_rivalTokenId].xp++;
            } else {
                _characterDetails[_myTokenId].hp = (_characterDetails[_myTokenId].hp).sub(substrateLifeToMe);
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
        emit Fighted(_myTokenId, _rivalTokenId, substrateLifeToRival, substrateLifeToMe);
    }

    function spell(uint256 _myTokenId, uint256 _rivalTokenId) external payable {
        require(msg.value == fightFee, "Wrong amount of fees");
        require(ownerOf(_myTokenId) == msg.sender, "You're not the owner of the NFT");
        require(ownerOf(_myTokenId) != ownerOf(_rivalTokenId), "Your NFTs cannot fight each other");
        require(_characterDetails[_myTokenId].hp > 0 && _characterDetails[_rivalTokenId].hp > 0, "One of the NFTs is dead");
        require(_characterDetails[_myTokenId].mana >= 10, "You don't have enough mana");

        uint256 substrateLifeToRival = substrateLifeMagic(_myTokenId, _rivalTokenId);
        uint256 substrateLifeToMe = substrateLifeMagic(_rivalTokenId, _myTokenId);

        _characterDetails[_myTokenId].mana = (_characterDetails[_myTokenId].mana).sub(10);
        if(substrateLifeToRival >= _characterDetails[_rivalTokenId].hp) {
            _characterDetails[_rivalTokenId].hp = 0;
            _characterDetails[_myTokenId].xp++;
        } else {
            _characterDetails[_rivalTokenId].hp = (_characterDetails[_rivalTokenId].hp).sub(substrateLifeToRival);
            if(substrateLifeToMe >= _characterDetails[_myTokenId].hp) {
                _characterDetails[_myTokenId].hp = 0;
                _characterDetails[_rivalTokenId].xp++;
            } else {
                _characterDetails[_myTokenId].hp = (_characterDetails[_myTokenId].hp).sub(substrateLifeToMe);
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
        emit Fighted(_myTokenId, _rivalTokenId, substrateLifeToRival, substrateLifeToMe);
    }

    // Getters
    function getTokenDetails(uint256 _tokenId) external view returns(Character memory) {
        return _characterDetails[_tokenId];
    }

    function getMyCharacters() external view returns (Character[] memory){
        uint8 count = 0;
        Character[] memory myCharacters = new Character[](balanceOf(msg.sender));
        for (uint256 i = 0; i < nextId; i++) {
            if (ownerOf(i) == msg.sender) {
                myCharacters[count] = _characterDetails[i];
                count++;
            }
        }
        return myCharacters;
    }

    function getOthersCharacters() external view returns (Character[] memory){
        uint256 count = 0;
        Character[] memory othersCharacters = new Character[](nextId.sub(balanceOf(msg.sender)));
        for (uint256 i = 0; i < nextId; i++) {
            if (ownerOf(i) != msg.sender) {
                othersCharacters[count] = _characterDetails[i];
                count++;
            }
        }
        return othersCharacters;
    }
    
    // // only for TESTS getAllCharacters
    // function getAllCharacters() external view returns (Character[] memory){
    //     Character[] memory allCharacters = new Character[](nextId);
    //     for (uint256 i = 0; i < nextId; i++) {
    //         allCharacters[i] = _characterDetails[i];
    //     }
    //     return allCharacters;
    // }
}
