pragma solidity ^0.7.5;
// SPDX-License-Identifier: Apache-2.0

import "@openzeppelin/contracts/access/Ownable.sol";
import "./IEternalStorage.sol";


contract EternalStorage is IEternalStorage, Ownable {

    address public latestVersion;

    mapping(bytes32 => bool) internal boolStorage;
    mapping(bytes32 => uint256) internal uInt256Storage;
    mapping(bytes32 => int256) internal int256Storage;
    mapping(bytes32 => address) internal addressStorage;
    mapping(bytes32 => bytes32) internal bytes32Storage;
    mapping(bytes32 => string) internal stringStorage;
    mapping(bytes32 => bytes) internal bytesStorage;

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

    // *** bytes ***
    function getBytes(bytes32 _key) public override view returns (bytes memory) {
        return bytesStorage[_key];
    }

    function setBytes(bytes32 _key, bytes memory _value) public override onlyLatestVersion {
        bytesStorage[_key] = _value;
    }

    function deleteBytes(bytes32 _key) public override onlyLatestVersion {
        delete bytesStorage[_key];
    }
}
