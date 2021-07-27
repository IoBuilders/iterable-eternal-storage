pragma solidity ^0.7.5;
// SPDX-License-Identifier: Apache-2.0

import "./IEternalStorage.sol";


interface IIterableEternalStorage is IEternalStorage {
    // *** UInt8 ***
    function addUInt8Key(bytes32 _listId, uint8 _value) external;
    function removeUInt8Key(bytes32 _listId, uint8 _value) external;
    function getUInt8KeySize(bytes32 _listId) external view returns (uint256);
    function getUInt8Keys(bytes32 _listId) external view returns (uint8[] memory);
    function getRangeOfUInt8Keys(bytes32 _listId, uint256 _offset, uint256 _limit) external view returns (uint8[] memory);
    function getUInt8KeyByIndex(bytes32 _listId, uint256 _listIndex) external view returns (uint8);
    function existsUInt8Key(bytes32 _listId, uint8 _value) external view returns (bool);

    // *** UInt128 ***
    function addUInt128Key(bytes32 _listId, uint128 _value) external;
    function removeUInt128Key(bytes32 _listId, uint128 _value) external;
    function getUInt128KeySize(bytes32 _listId) external view returns (uint256);
    function getUInt128Keys(bytes32 _listId) external view returns (uint128[] memory);
    function getRangeOfUInt128Keys(bytes32 _listId, uint256 _offset, uint256 _limit) external view returns (uint128[] memory);
    function getUInt128KeyByIndex(bytes32 _listId, uint256 _listIndex) external view returns (uint128);
    function existsUInt128Key(bytes32 _listId, uint128 _value) external view returns (bool);

    // *** UInt256 ***
    function addUInt256Key(bytes32 _listId, uint256 _value) external;
    function removeUInt256Key(bytes32 _listId, uint256 _value) external;
    function getUInt256KeySize(bytes32 _listId) external view returns (uint256);
    function getUInt256Keys(bytes32 _listId) external view returns (uint256[] memory);
    function getRangeOfUInt256Keys(bytes32 _listId, uint256 _offset, uint256 _limit) external view returns (uint256[] memory);
    function getUInt256KeyByIndex(bytes32 _listId, uint256 _listIndex) external view returns (uint256);
    function existsUInt256Key(bytes32 _listId, uint256 _value) external view returns (bool);

    // *** Int8 ***
    function addInt8Key(bytes32 _listId, int8 _value) external;
    function removeInt8Key(bytes32 _listId, int8 _value) external;
    function getInt8KeySize(bytes32 _listId) external view returns (uint256);
    function getInt8Keys(bytes32 _listId) external view returns (int8[] memory);
    function getRangeOfInt8Keys(bytes32 _listId, uint256 _offset, uint256 _limit) external view returns (int8[] memory);
    function getInt8KeyByIndex(bytes32 _listId, uint256 _listIndex) external view returns (int8);
    function existsInt8Key(bytes32 _listId, int8 _value) external view returns (bool);

    // *** Int128 ***
    function addInt128Key(bytes32 _listId, int128 _value) external;
    function removeInt128Key(bytes32 _listId, int128 _value) external;
    function getInt128KeySize(bytes32 _listId) external view returns (uint256);
    function getInt128Keys(bytes32 _listId) external view returns (int128[] memory);
    function getRangeOfInt128Keys(bytes32 _listId, uint256 _offset, uint256 _limit) external view returns (int128[] memory);
    function getInt128KeyByIndex(bytes32 _listId, uint256 _listIndex) external view returns (int128);
    function existsInt128Key(bytes32 _listId, int128 _value) external view returns (bool);

    // *** Int256 ***
    function addInt256Key(bytes32 _listId, int256 _value) external;
    function removeInt256Key(bytes32 _listId, int256 _value) external;
    function getInt256KeySize(bytes32 _listId) external view returns (uint256);
    function getInt256Keys(bytes32 _listId) external view returns (int256[] memory);
    function getRangeOfInt256Keys(bytes32 _listId, uint256 _offset, uint256 _limit) external view returns (int256[] memory);
    function getInt256KeyByIndex(bytes32 _listId, uint256 _listIndex) external view returns (int256);
    function existsInt256Key(bytes32 _listId, int256 _value) external view returns (bool);

    // *** Address ***
    function addAddressKey(bytes32 _listId, address _value) external;
    function removeAddressKey(bytes32 _listId, address _value) external;
    function getAddressKeySize(bytes32 _listId) external view returns (uint256);
    function getAddressKeys(bytes32 _listId) external view returns (address[] memory);
    function getRangeOfAddressKeys(bytes32 _listId, uint256 _offset, uint256 _limit) external view returns (address[] memory);
    function getAddressKeyByIndex(bytes32 _listId, uint256 _listIndex) external view returns (address);
    function existsAddressKey(bytes32 _listId, address _value) external view returns (bool);

    // *** Bytes8 ***
    function addBytes8Key(bytes32 _listId, bytes8 _value) external;
    function removeBytes8Key(bytes32 _listId, bytes8 _value) external;
    function getBytes8KeySize(bytes32 _listId) external view returns (uint256);
    function getBytes8Keys(bytes32 _listId) external view returns (bytes8[] memory);
    function getRangeOfBytes8Keys(bytes32 _listId, uint256 _offset, uint256 _limit) external view returns (bytes8[] memory);
    function getBytes8KeyByIndex(bytes32 _listId, uint256 _listIndex) external view returns (bytes8);
    function existsBytes8Key(bytes32 _listId, bytes8 _value) external view returns (bool);

    // *** Bytes16 ***
    function addBytes16Key(bytes32 _listId, bytes16 _value) external;
    function removeBytes16Key(bytes32 _listId, bytes16 _value) external;
    function getBytes16KeySize(bytes32 _listId) external view returns (uint256);
    function getBytes16Keys(bytes32 _listId) external view returns (bytes16[] memory);
    function getRangeOfBytes16Keys(bytes32 _listId, uint256 _offset, uint256 _limit) external view returns (bytes16[] memory);
    function getBytes16KeyByIndex(bytes32 _listId, uint256 _listIndex) external view returns (bytes16);
    function existsBytes16Key(bytes32 _listId, bytes16 _value) external view returns (bool);

    // *** Bytes32 ***
    function addBytes32Key(bytes32 _listId, bytes32 _value) external;
    function removeBytes32Key(bytes32 _listId, bytes32 _value) external;
    function getBytes32KeySize(bytes32 _listId) external view returns (uint256);
    function getBytes32Keys(bytes32 _listId) external view returns (bytes32[] memory);
    function getRangeOfBytes32Keys(bytes32 _listId, uint256 _offset, uint256 _limit) external view returns (bytes32[] memory);
    function getBytes32KeyByIndex(bytes32 _listId, uint256 _listIndex) external view returns (bytes32);
    function existsBytes32Key(bytes32 _listId, bytes32 _value) external view returns (bool);

    // *** String ***
    function addStringKey(bytes32 _listId, string memory _value) external;
    function removeStringKey(bytes32 _listId, string memory _value) external;
    function getStringKeySize(bytes32 _listId) external view returns (uint256);
    //    array of string not possible as return value in Solidity 0.5.x
    //    function getIterableStringList(bytes32 _listId) external view returns (string[] memory);
    //    function getRangeOfIterableStringList(bytes32 _listId, uint256 _offset, uint256 _limit) external view returns (string[] memory);
    function getStringKeyByIndex(bytes32 _listId, uint256 _listIndex) external view returns (string memory);
    function existsStringKey(bytes32 _listId, string memory _value) external view returns (bool);
}
