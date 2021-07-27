pragma solidity ^0.7.5;
// SPDX-License-Identifier: Apache-2.0


interface IEternalStorage {
    // *** Bool ***
    function getBool(bytes32 _key) external view returns (bool);
    function setBool(bytes32 _key, bool _value) external;
    function deleteBool(bytes32 _key) external;

    // *** UInt8 ***
    function getUInt8(bytes32 _key) external view returns (uint8);
    function setUInt8(bytes32 _key, uint8 _value) external;
    function deleteUInt8(bytes32 _key) external;

    // *** UInt128 ***
    function getUInt128(bytes32 _key) external view returns (uint128);
    function setUInt128(bytes32 _key, uint128 _value) external;
    function deleteUInt128(bytes32 _key) external;

    // *** UInt256 ***
    function getUInt256(bytes32 _key) external view returns (uint256);
    function setUInt256(bytes32 _key, uint256 _value) external;
    function deleteUInt256(bytes32 _key) external;

    // *** Int8 ***
    function getInt8(bytes32 _key) external view returns (int8);
    function setInt8(bytes32 _key, int8 _value) external;
    function deleteInt8(bytes32 _key) external;

    // *** Int128 ***
    function getInt128(bytes32 _key) external view returns (int128);
    function setInt128(bytes32 _key, int128 _value) external;
    function deleteInt128(bytes32 _key) external;

    // *** Int256 ***
    function getInt256(bytes32 _key) external view returns (int256);
    function setInt256(bytes32 _key, int256 _value) external;
    function deleteInt256(bytes32 _key) external;

    // *** Address ***
    function getAddress(bytes32 _key) external view returns (address);
    function setAddress(bytes32 _key, address _value) external;
    function deleteAddress(bytes32 _key) external;

    // *** Bytes8 ***
    function getBytes8(bytes32 _key) external view returns (bytes8);
    function setBytes8(bytes32 _key, bytes8 _value) external;
    function deleteBytes8(bytes32 _key) external;

    // *** Bytes16 ***
    function getBytes16(bytes32 _key) external view returns (bytes16);
    function setBytes16(bytes32 _key, bytes16 _value) external;
    function deleteBytes16(bytes32 _key) external;

    // *** Bytes32 ***
    function getBytes32(bytes32 _key) external view returns (bytes32);
    function setBytes32(bytes32 _key, bytes32 _value) external;
    function deleteBytes32(bytes32 _key) external;

    // *** String ***
    function getString(bytes32 _key) external view returns (string memory);
    function setString(bytes32 _key, string memory _value) external;
    function deleteString(bytes32 _key) external;

    // *** bytes ***
    function getBytes(bytes32 _key) external view returns (bytes memory);
    function setBytes(bytes32 _key, bytes memory _value) external;
    function deleteBytes(bytes32 _key) external;
}
