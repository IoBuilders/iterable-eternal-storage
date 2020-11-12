pragma solidity ^0.7.1;
// SPDX-License-Identifier: Apache-2.0

import "@openzeppelin/contracts/access/Ownable.sol";
import "./IEternalStorage.sol";


contract EternalStorage is IEternalStorage, Ownable {

    address public latestVersion;

    mapping(bytes32 => bool) internal boolStorage;
    mapping(bytes32 => uint8) internal uInt8Storage;
    mapping(bytes32 => uint128) internal uInt128Storage;
    mapping(bytes32 => uint256) internal uInt256Storage;
    mapping(bytes32 => int8) internal int8Storage;
    mapping(bytes32 => int128) internal int128Storage;
    mapping(bytes32 => int256) internal int256Storage;
    mapping(bytes32 => address) internal addressStorage;
    mapping(bytes32 => bytes8) internal bytes8Storage;
    mapping(bytes32 => bytes16) internal bytes16Storage;
    mapping(bytes32 => bytes32) internal bytes32Storage;
    mapping(bytes32 => string) internal stringStorage;

    modifier onlyLatestVersion() {
        require(msg.sender == latestVersion, "only the latest version of the contract can call setters");
        _;
    }

    event VersionUpgraded(
        address indexed newVersion
    );

    function upgradeVersion(address _newVersion) external onlyOwner {
        latestVersion = _newVersion;

        emit VersionUpgraded(_newVersion);
    }

    // *** Bool ***
    function getBool(bytes32 _key) public override view returns (bool) {
        return boolStorage[_key];
    }

    function setBool(bytes32 _key, bool _value) public override  onlyLatestVersion {
        boolStorage[_key] = _value;
    }

    function deleteBool(bytes32 _key) public override onlyLatestVersion {
        delete boolStorage[_key];
    }

    // *** UInt8 ***
    function getUInt8(bytes32 _key) public override view returns (uint8) {
        return uInt8Storage[_key];
    }

    function setUInt8(bytes32 _key, uint8 _value) public override onlyLatestVersion {
        uInt8Storage[_key] = _value;
    }

    function deleteUInt8(bytes32 _key) public override onlyLatestVersion {
        delete uInt8Storage[_key];
    }

    // *** UInt128 ***
    function getUInt128(bytes32 _key) public override view returns (uint128) {
        return uInt128Storage[_key];
    }

    function setUInt128(bytes32 _key, uint128 _value) public override onlyLatestVersion {
        uInt128Storage[_key] = _value;
    }

    function deleteUInt128(bytes32 _key) public override onlyLatestVersion {
        delete uInt128Storage[_key];
    }

    // *** UInt256 ***
    function getUInt256(bytes32 _key) public override view returns (uint256) {
        return uInt256Storage[_key];
    }

    function setUInt256(bytes32 _key, uint256 _value) public override onlyLatestVersion {
        uInt256Storage[_key] = _value;
    }

    function deleteUInt256(bytes32 _key) public override onlyLatestVersion {
        delete uInt256Storage[_key];
    }

    // *** Int8 ***
    function getInt8(bytes32 _key) public override view returns (int8) {
        return int8Storage[_key];
    }

    function setInt8(bytes32 _key, int8 _value) public override onlyLatestVersion {
        int8Storage[_key] = _value;
    }

    function deleteInt8(bytes32 _key) public override onlyLatestVersion {
        delete int8Storage[_key];
    }

    // *** Int128 ***
    function getInt128(bytes32 _key) public override view returns (int128) {
        return int128Storage[_key];
    }

    function setInt128(bytes32 _key, int128 _value) public override onlyLatestVersion {
        int128Storage[_key] = _value;
    }

    function deleteInt128(bytes32 _key) public override onlyLatestVersion {
        delete int128Storage[_key];
    }

    // *** Int256 ***
    function getInt256(bytes32 _key) public override view returns (int256) {
        return int256Storage[_key];
    }

    function setInt256(bytes32 _key, int256 _value) public override onlyLatestVersion {
        int256Storage[_key] = _value;
    }

    function deleteInt256(bytes32 _key) public override onlyLatestVersion {
        delete int256Storage[_key];
    }

    // *** Address ***
    function getAddress(bytes32 _key) public override view returns (address) {
        return addressStorage[_key];
    }

    function setAddress(bytes32 _key, address _value) public override onlyLatestVersion {
        addressStorage[_key] = _value;
    }

    function deleteAddress(bytes32 _key) public override onlyLatestVersion {
        delete addressStorage[_key];
    }

    // *** Bytes8 ***
    function getBytes8(bytes32 _key) public override view returns (bytes8) {
        return bytes8Storage[_key];
    }

    function setBytes8(bytes32 _key, bytes8 _value) public override onlyLatestVersion {
        bytes8Storage[_key] = _value;
    }

    function deleteBytes8(bytes32 _key) public override onlyLatestVersion {
        delete bytes8Storage[_key];
    }

    // *** Bytes16 ***
    function getBytes16(bytes32 _key) public override view returns (bytes16) {
        return bytes16Storage[_key];
    }

    function setBytes16(bytes32 _key, bytes16 _value) public override onlyLatestVersion {
        bytes16Storage[_key] = _value;
    }

    function deleteBytes16(bytes32 _key) public override onlyLatestVersion {
        delete bytes16Storage[_key];
    }

    // *** Bytes32 ***
    function getBytes32(bytes32 _key) public override view returns (bytes32) {
        return bytes32Storage[_key];
    }

    function setBytes32(bytes32 _key, bytes32 _value) public override onlyLatestVersion {
        bytes32Storage[_key] = _value;
    }

    function deleteBytes32(bytes32 _key) public override onlyLatestVersion {
        delete bytes32Storage[_key];
    }

    // *** String ***
    function getString(bytes32 _key) public override view returns (string memory) {
        return stringStorage[_key];
    }

    function setString(bytes32 _key, string memory _value) public override onlyLatestVersion {
        stringStorage[_key] = _value;
    }

    function deleteString(bytes32 _key) public override onlyLatestVersion {
        delete stringStorage[_key];
    }
}
