# Iterable Eternal Storage

[![Build Status](https://travis-ci.org/IoBuilders/iterable-eternal-storage.svg?branch=master)](https://travis-ci.org/IoBuilders/iterable-eternal-storage)
[![Coverage Status](https://coveralls.io/repos/github/IoBuilders/iterable-eternal-storage/badge.svg?branch=master)](https://coveralls.io/github/IoBuilders/iterable-eternal-storage?branch=master)

This library provides Solidity smart contracts for [eternal storage](https://fravoll.github.io/solidity-patterns/eternal_storage.html) with iterable functionality. 

The aim is to provide smart contracts, which only contain the data of an application. Through the separation of logic and data make the dApp is upgradable.  
To make the data itself upgradable the library provides the functionality to add iterable keys. This way the data can be iterated over and changed if necessary.

## Usage

The eternal storage needs to be deployed first. After that the address of the logic smart contract, which wants to use it, has to be set by calling `upgradeVersion`.  
With `truffle console` this is done with:

```javascript
EternalStorage.new().then((c) => {eternalStorage = c})
eternalStorage.upgradeVersion(LOGIC_CONTRACT_ADDRESS)

// or

IterableEternalStorage.new().then((c) => {iterableEternalStorage = c})
iterableEternalStorage.upgradeVersion(LOGIC_CONTRACT_ADDRESS)
```

### Eternal storage

The following example shows the usage of the eternal storage library with the `uint256` data type.

```solidity
import "IEternalStorage.sol";

contract Example {
    IEternalStorage internal eternalStorage;

    constructor(IEternalStorage _storage) public {
        eternalStorage = _storage;
    }
    
    function addToX(uint256 value) external {
        uint256 x = eternalStorage.getUInt256(keccak256(abi.encodePacked("X")));
        x = x + value;
        
        eternalStorage.setUInt256(keccak256(abi.encodePacked("X")), x);
    }
    
    function getX() public view returns (uint256) {
        return eternalStorage.getUInt256(keccak256(abi.encodePacked("X")));
    }
    
    function resetX() public {
        eternalStorage.deleteUInt256(keccak256(abi.encodePacked("X")));
    }
}
```

### Iterable Eternal Storage

The following table shows the available functions with there explanations. The **X** has to be replaced with the data types:

| Function        | Description           | Comment  |
| ------------- |-------------| -----|
| add**X**Key(bytes32 _listId, **X** _value) public | Adds a key to a iterable list | - |
| remove**X**Key(bytes32 _listId, **X** _value) public | Removes a key from a iterable list | - |
| get**X**KeySize(bytes32 _listId) public view returns **X**) | Returns the number of elements in a list | - |
| get**X**Keys(bytes32 _listId) public view returns (**X**[] memory) | Returns an array with the keys of a list | not available for `string` |
| getRangeOf**X**Keys(bytes32 _listId, uint256 _offset, uint256 _limit) public view returns (**X**[] memory) | Returns an array with the given range of the keys of a list | not available for `string` | - |
| get**X**KeyByIndex(bytes32 _listId, uint256 _listIndex) public view returns (**X**) | Returns the element at the given index | - |
| exists**X**Key(bytes32 _listId, **X** _value) public view returns (bool) | Returns if a given value is an element of the list | - |

## Data types

The following data types are available

* bool
* uint8
* uint128
* uint256
* int8
* int128
* int256
* address
* bytes8
* bytes16
* bytes32
* string (partially)

## Tests

To run the unit tests execute `npm test`

## Code coverage

To run the code coverage execute `npm run coverage`
