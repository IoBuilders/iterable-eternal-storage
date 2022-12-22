pragma solidity >=0.8.0 <0.9.0;
// SPDX-License-Identifier: Apache-2.0

import "./IEternalStorage.sol";


interface IIterableEternalStorage is IEternalStorage {

    // *** UInt256 ***
    function addUInt256Key(bytes32 _listId, uint256 _value) external;
    function removeUInt256Key(bytes32 _listId, uint256 _value) external;
    function getUInt256KeySize(bytes32 _listId) external view returns (uint256);
    function getUInt256Keys(bytes32 _listId) external view returns (uint256[] memory);
    function getRangeOfUInt256Keys(bytes32 _listId, uint256 _offset, uint256 _limit) external view returns (uint256[] memory);
    function getUInt256KeyByIndex(bytes32 _listId, uint256 _listIndex) external view returns (uint256);
    function existsUInt256Key(bytes32 _listId, uint256 _value) external view returns (bool);

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

    // *** Bytes ***
    function addBytesKey(bytes32 _listId, bytes memory _value) external;
    function removeBytesKey(bytes32 _listId, bytes memory _value) external;
    function getBytesKeySize(bytes32 _listId) external view returns (uint256);
    //    array of bytes not possible as return value in Solidity 0.5.x
    //    function getIterableBytesList(bytes32 _listId) external view returns (bytes[] memory);
    //    function getRangeOfIterableBytesList(bytes32 _listId, uint256 _offset, uint256 _limit) external view returns (bytes[] memory);
    function getBytesKeyByIndex(bytes32 _listId, uint256 _listIndex) external view returns (bytes memory);
    function existsBytesKey(bytes32 _listId, bytes memory _value) external view returns (bool);
}
