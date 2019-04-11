pragma solidity ^0.5.0;


contract IEternalStorage {
    // *** Bool ***
    function getBool(bytes32 _key) public view returns (bool);
    function setBool(bytes32 _key, bool _value) public;
    function deleteBool(bytes32 _key) public;

    // *** UInt8 ***
    function getUInt8(bytes32 _key) public view returns (uint8);
    function setUInt8(bytes32 _key, uint8 _value) public;
    function deleteUInt8(bytes32 _key) public;

    // *** UInt128 ***
    function getUInt128(bytes32 _key) public view returns (uint128);
    function setUInt128(bytes32 _key, uint128 _value) public;
    function deleteUInt128(bytes32 _key) public;

    // *** UInt256 ***
    function getUInt256(bytes32 _key) public view returns (uint256);
    function setUInt256(bytes32 _key, uint256 _value) public;
    function deleteUInt256(bytes32 _key) public;

    // *** Int8 ***
    function getInt8(bytes32 _key) public view returns (int8);
    function setInt8(bytes32 _key, int8 _value) public;
    function deleteInt8(bytes32 _key) public;

    // *** Int128 ***
    function getInt128(bytes32 _key) public view returns (int128);
    function setInt128(bytes32 _key, int128 _value) public;
    function deleteInt128(bytes32 _key) public;

    // *** Int256 ***
    function getInt256(bytes32 _key) public view returns (int256);
    function setInt256(bytes32 _key, int256 _value) public;
    function deleteInt256(bytes32 _key) public;

    // *** Address ***
    function getAddress(bytes32 _key) public view returns (address);
    function setAddress(bytes32 _key, address _value) public;
    function deleteAddress(bytes32 _key) public;

    // *** Bytes8 ***
    function getBytes8(bytes32 _key) public view returns (bytes8);
    function setBytes8(bytes32 _key, bytes8 _value) public;
    function deleteBytes8(bytes32 _key) public;

    // *** Bytes16 ***
    function getBytes16(bytes32 _key) public view returns (bytes16);
    function setBytes16(bytes32 _key, bytes16 _value) public;
    function deleteBytes16(bytes32 _key) public;

    // *** Bytes32 ***
    function getBytes32(bytes32 _key) public view returns (bytes32);
    function setBytes32(bytes32 _key, bytes32 _value) public;
    function deleteBytes32(bytes32 _key) public;

    // *** String ***
    function getString(bytes32 _key) public view returns (string memory);
    function setString(bytes32 _key, string memory _value) public;
    function deleteString(bytes32 _key) public;
}
