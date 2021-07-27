pragma solidity ^0.7.5;
// SPDX-License-Identifier: Apache-2.0

import "./EternalStorage.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "./IIterableEternalStorage.sol";


contract IterableEternalStorage is EternalStorage, IIterableEternalStorage {
    using SafeMath for uint256;

    bytes32 private constant SIZE_POSTFIX = "listSize";
    bytes32 private constant VALUES_POSTFIX = "listValues";
    bytes32 private constant INDEX_POSTFIX = "listIndex";
    bytes32 private constant EXISTS_POSTFIX = "listExists";
    bytes32 private constant UINT8_ID = "uint8";
    bytes32 private constant UINT16_ID = "uint16";
    bytes32 private constant UINT32_ID = "uint32";
    bytes32 private constant UINT64_ID = "uint64";
    bytes32 private constant UINT128_ID = "uint128";
    bytes32 private constant UINT256_ID = "uint256";
    bytes32 private constant INT8_ID = "int8";
    bytes32 private constant INT16_ID = "int16";
    bytes32 private constant INT32_ID = "int32";
    bytes32 private constant INT64_ID = "int64";
    bytes32 private constant INT128_ID = "int128";
    bytes32 private constant INT256_ID = "int256";
    bytes32 private constant ADDRESS_ID = "address";
    bytes32 private constant BYTES8_ID = "bytes8";
    bytes32 private constant BYTES16_ID = "bytes16";
    bytes32 private constant BYTES32_ID = "bytes32";
    bytes32 private constant STRING_ID = "string";

    // *** UInt8 ***
    function addUInt8Key(bytes32 _listId, uint8 _value) public override {
        bytes32 valueHash = keccak256(abi.encode(_value));
        require(!_existsInIterableList(UINT8_ID, _listId, valueHash), "Key exists already in the list");

        uint256 index = _createKeyEntry(UINT8_ID, _listId, valueHash);
        setUInt8(keccak256(abi.encodePacked(_listId, VALUES_POSTFIX, index)), _value);
    }

    function removeUInt8Key(bytes32 _listId, uint8 _value) public override {
        bytes32 valueHash = keccak256(abi.encode(_value));
        require(_existsInIterableList(UINT8_ID, _listId, valueHash), "Key does not exist in the list");

        uint256 keySize = _getKeySize(UINT8_ID, _listId);
        uint256 lastKeyIndex = keySize - 1;

        uint256 index = _removeKeyEntry(UINT8_ID, _listId, valueHash);
        deleteUInt8(keccak256(abi.encodePacked(_listId, VALUES_POSTFIX, index)));

        // replace position of deleted key with the last key in the list, to avoid gaps
        if (index != lastKeyIndex) {
            uint8 lastValueOfList = getUInt8KeyByIndex(_listId, lastKeyIndex);
            bytes32 lastValueOfListHash = keccak256(abi.encode(lastValueOfList));
            setUInt8(keccak256(abi.encodePacked(_listId, VALUES_POSTFIX, index)), lastValueOfList);
            setUInt256(
                keccak256(
                    abi.encodePacked(
                        UINT8_ID,
                        _listId,
                        INDEX_POSTFIX,
                        lastValueOfListHash
                    )
                ),
                index
            );

            // delete old position at last position
            deleteUInt8(keccak256(abi.encodePacked(_listId, VALUES_POSTFIX, lastKeyIndex)));
        }
    }

    function getUInt8KeySize(bytes32 _listId) public override view returns (uint256) {
        return _getKeySize(UINT8_ID, _listId);
    }

    function getUInt8Keys(bytes32 _listId) public override view returns (uint8[] memory) {
        return getRangeOfUInt8Keys(_listId, 0, getUInt8KeySize(_listId));
    }

    function getRangeOfUInt8Keys(bytes32 _listId, uint256 _offset, uint256 _limit) public override view returns (uint8[] memory) {
        uint256 rangeSize = _calculateRangeSizeOfList(getUInt8KeySize(_listId), _offset, _limit);

        uint8[] memory list = new uint8[](rangeSize);

        for (uint256 listIndex = 0; listIndex < rangeSize; listIndex++) {
            list[listIndex] = getUInt8KeyByIndex(_listId, listIndex + _offset);
        }

        return list;
    }

    function getUInt8KeyByIndex(bytes32 _listId, uint256 _listIndex) public override view returns (uint8) {
        return getUInt8(keccak256(abi.encodePacked(_listId, VALUES_POSTFIX, _listIndex)));
    }

    function existsUInt8Key(bytes32 _listId, uint8 _value) public override view returns (bool) {
        return _existsInIterableList(UINT8_ID, _listId, keccak256(abi.encode(_value)));
    }

    // *** UInt128 ***
    function addUInt128Key(bytes32 _listId, uint128 _value) public override {
        bytes32 valueHash = keccak256(abi.encode(_value));
        require(!_existsInIterableList(UINT128_ID, _listId, valueHash), "Key exists already in the list");

        uint256 index = _createKeyEntry(UINT128_ID, _listId, valueHash);
        setUInt128(keccak256(abi.encodePacked(_listId, VALUES_POSTFIX, index)), _value);
    }

    function removeUInt128Key(bytes32 _listId, uint128 _value) public override {
        bytes32 valueHash = keccak256(abi.encode(_value));
        require(_existsInIterableList(UINT128_ID, _listId, valueHash), "Key does not exist in the list");

        uint256 keySize = _getKeySize(UINT128_ID, _listId);
        uint256 lastKeyIndex = keySize - 1;

        uint256 index = _removeKeyEntry(UINT128_ID, _listId, valueHash);
        deleteUInt128(keccak256(abi.encodePacked(_listId, VALUES_POSTFIX, index)));

        // replace position of deleted key with the last key in the list, to avoid gaps
        if (index != lastKeyIndex) {
            uint128 lastValueOfList = getUInt128KeyByIndex(_listId, lastKeyIndex);
            bytes32 lastValueOfListHash = keccak256(abi.encode(lastValueOfList));
            setUInt128(keccak256(abi.encodePacked(_listId, VALUES_POSTFIX, index)), lastValueOfList);
            setUInt256(
                keccak256(
                    abi.encodePacked(
                        UINT128_ID,
                        _listId,
                        INDEX_POSTFIX,
                        lastValueOfListHash
                    )
                ),
                index
            );

            // delete old position at last position
            deleteUInt128(keccak256(abi.encodePacked(_listId, VALUES_POSTFIX, lastKeyIndex)));
        }
    }

    function getUInt128KeySize(bytes32 _listId) public override view returns (uint256) {
        return _getKeySize(UINT128_ID, _listId);
    }

    function getUInt128Keys(bytes32 _listId) public override view returns (uint128[] memory) {
        return getRangeOfUInt128Keys(_listId, 0, getUInt128KeySize(_listId));
    }

    function getRangeOfUInt128Keys(bytes32 _listId, uint256 _offset, uint256 _limit) public override view returns (uint128[] memory) {
        uint256 rangeSize = _calculateRangeSizeOfList(getUInt128KeySize(_listId), _offset, _limit);

        uint128[] memory list = new uint128[](rangeSize);

        for (uint256 listIndex = 0; listIndex < rangeSize; listIndex++) {
            list[listIndex] = getUInt128KeyByIndex(_listId, listIndex + _offset);
        }

        return list;
    }

    function getUInt128KeyByIndex(bytes32 _listId, uint256 _listIndex) public override view returns (uint128) {
        return getUInt128(keccak256(abi.encodePacked(_listId, VALUES_POSTFIX, _listIndex)));
    }

    function existsUInt128Key(bytes32 _listId, uint128 _value) public override view returns (bool) {
        return _existsInIterableList(UINT128_ID, _listId, keccak256(abi.encode(_value)));
    }

    // *** UInt256 ***
    function addUInt256Key(bytes32 _listId, uint256 _value) public override {
        bytes32 valueHash = keccak256(abi.encode(_value));
        require(!_existsInIterableList(UINT256_ID, _listId, valueHash), "Key exists already in the list");

        uint256 index = _createKeyEntry(UINT256_ID, _listId, valueHash);
        setUInt256(keccak256(abi.encodePacked(_listId, VALUES_POSTFIX, index)), _value);
    }

    function removeUInt256Key(bytes32 _listId, uint256 _value) public override {
        bytes32 valueHash = keccak256(abi.encode(_value));
        require(_existsInIterableList(UINT256_ID, _listId, valueHash), "Key does not exist in the list");

        uint256 keySize = _getKeySize(UINT256_ID, _listId);
        uint256 lastKeyIndex = keySize - 1;

        uint256 index = _removeKeyEntry(UINT256_ID, _listId, valueHash);
        deleteUInt256(keccak256(abi.encodePacked(_listId, VALUES_POSTFIX, index)));

        // replace position of deleted key with the last key in the list, to avoid gaps
        if (index != lastKeyIndex) {
            uint256 lastValueOfList = getUInt256KeyByIndex(_listId, lastKeyIndex);
            bytes32 lastValueOfListHash = keccak256(abi.encode(lastValueOfList));
            setUInt256(keccak256(abi.encodePacked(_listId, VALUES_POSTFIX, index)), lastValueOfList);
            setUInt256(
                keccak256(
                    abi.encodePacked(
                        UINT256_ID,
                        _listId,
                        INDEX_POSTFIX,
                        lastValueOfListHash
                    )
                ),
                index
            );

            // delete old position at last position
            deleteUInt256(keccak256(abi.encodePacked(_listId, VALUES_POSTFIX, lastKeyIndex)));
        }
    }

    function getUInt256KeySize(bytes32 _listId) public override view returns (uint256) {
        return _getKeySize(UINT256_ID, _listId);
    }

    function getUInt256Keys(bytes32 _listId) public override view returns (uint256[] memory) {
        return getRangeOfUInt256Keys(_listId, 0, getUInt256KeySize(_listId));
    }

    function getRangeOfUInt256Keys(bytes32 _listId, uint256 _offset, uint256 _limit) public override view returns (uint256[] memory) {
        uint256 rangeSize = _calculateRangeSizeOfList(getUInt256KeySize(_listId), _offset, _limit);

        uint256[] memory list = new uint256[](rangeSize);

        for (uint256 listIndex = 0; listIndex < rangeSize; listIndex++) {
            list[listIndex] = getUInt256KeyByIndex(_listId, listIndex + _offset);
        }

        return list;
    }

    function getUInt256KeyByIndex(bytes32 _listId, uint256 _listIndex) public override view returns (uint256) {
        return getUInt256(keccak256(abi.encodePacked(_listId, VALUES_POSTFIX, _listIndex)));
    }

    function existsUInt256Key(bytes32 _listId, uint256 _value) public override view returns (bool) {
        return _existsInIterableList(UINT256_ID, _listId, keccak256(abi.encode(_value)));
    }

    // *** Int8 ***
    function addInt8Key(bytes32 _listId, int8 _value) public override {
        bytes32 valueHash = keccak256(abi.encode(_value));
        require(!_existsInIterableList(INT8_ID, _listId, valueHash), "Key exists already in the list");

        uint256 index = _createKeyEntry(INT8_ID, _listId, valueHash);
        setInt8(keccak256(abi.encodePacked(_listId, VALUES_POSTFIX, index)), _value);
    }

    function removeInt8Key(bytes32 _listId, int8 _value) public override {
        bytes32 valueHash = keccak256(abi.encode(_value));
        require(_existsInIterableList(INT8_ID, _listId, valueHash), "Key does not exist in the list");

        uint256 keySize = _getKeySize(INT8_ID, _listId);
        uint256 lastKeyIndex = keySize - 1;

        uint256 index = _removeKeyEntry(INT8_ID, _listId, valueHash);
        deleteInt8(keccak256(abi.encodePacked(_listId, VALUES_POSTFIX, index)));

        // replace position of deleted key with the last key in the list, to avoid gaps
        if (index != lastKeyIndex) {
            int8 lastValueOfList = getInt8KeyByIndex(_listId, lastKeyIndex);
            bytes32 lastValueOfListHash = keccak256(abi.encode(lastValueOfList));
            setInt8(keccak256(abi.encodePacked(_listId, VALUES_POSTFIX, index)), lastValueOfList);
            setUInt256(
                keccak256(
                    abi.encodePacked(
                        INT8_ID,
                        _listId,
                        INDEX_POSTFIX,
                        lastValueOfListHash
                    )
                ),
                index
            );

            // delete old position at last position
            deleteInt8(keccak256(abi.encodePacked(_listId, VALUES_POSTFIX, lastKeyIndex)));
        }
    }

    function getInt8KeySize(bytes32 _listId) public override view returns (uint256) {
        return _getKeySize(INT8_ID, _listId);
    }

    function getInt8Keys(bytes32 _listId) public override view returns (int8[] memory) {
        return getRangeOfInt8Keys(_listId, 0, getInt8KeySize(_listId));
    }

    function getRangeOfInt8Keys(bytes32 _listId, uint256 _offset, uint256 _limit) public override view returns (int8[] memory) {
        uint256 rangeSize = _calculateRangeSizeOfList(getInt8KeySize(_listId), _offset, _limit);

        int8[] memory list = new int8[](rangeSize);

        for (uint256 listIndex = 0; listIndex < rangeSize; listIndex++) {
            list[listIndex] = getInt8KeyByIndex(_listId, listIndex + _offset);
        }

        return list;
    }

    function getInt8KeyByIndex(bytes32 _listId, uint256 _listIndex) public override view returns (int8) {
        return getInt8(keccak256(abi.encodePacked(_listId, VALUES_POSTFIX, _listIndex)));
    }

    function existsInt8Key(bytes32 _listId, int8 _value) public override view returns (bool) {
        return _existsInIterableList(INT8_ID, _listId, keccak256(abi.encode(_value)));
    }

    // *** Int128 ***
    function addInt128Key(bytes32 _listId, int128 _value) public override {
        bytes32 valueHash = keccak256(abi.encode(_value));
        require(!_existsInIterableList(INT128_ID, _listId, valueHash), "Key exists already in the list");

        uint256 index = _createKeyEntry(INT128_ID, _listId, valueHash);
        setInt128(keccak256(abi.encodePacked(_listId, VALUES_POSTFIX, index)), _value);
    }

    function removeInt128Key(bytes32 _listId, int128 _value) public override {
        bytes32 valueHash = keccak256(abi.encode(_value));
        require(_existsInIterableList(INT128_ID, _listId, valueHash), "Key does not exist in the list");

        uint256 keySize = _getKeySize(INT128_ID, _listId);
        uint256 lastKeyIndex = keySize - 1;

        uint256 index = _removeKeyEntry(INT128_ID, _listId, valueHash);
        deleteInt128(keccak256(abi.encodePacked(_listId, VALUES_POSTFIX, index)));

        // replace position of deleted key with the last key in the list, to avoid gaps
        if (index != lastKeyIndex) {
            int128 lastValueOfList = getInt128KeyByIndex(_listId, lastKeyIndex);
            bytes32 lastValueOfListHash = keccak256(abi.encode(lastValueOfList));
            setInt128(keccak256(abi.encodePacked(_listId, VALUES_POSTFIX, index)), lastValueOfList);
            setUInt256(
                keccak256(
                    abi.encodePacked(
                        INT128_ID,
                        _listId,
                        INDEX_POSTFIX,
                        lastValueOfListHash
                    )
                ),
                index
            );

            // delete old position at last position
            deleteInt128(keccak256(abi.encodePacked(_listId, VALUES_POSTFIX, lastKeyIndex)));
        }
    }

    function getInt128KeySize(bytes32 _listId) public override view returns (uint256) {
        return _getKeySize(INT128_ID, _listId);
    }

    function getInt128Keys(bytes32 _listId) public override view returns (int128[] memory) {
        return getRangeOfInt128Keys(_listId, 0, getInt128KeySize(_listId));
    }

    function getRangeOfInt128Keys(bytes32 _listId, uint256 _offset, uint256 _limit) public override view returns (int128[] memory) {
        uint256 rangeSize = _calculateRangeSizeOfList(getInt128KeySize(_listId), _offset, _limit);

        int128[] memory list = new int128[](rangeSize);

        for (uint256 listIndex = 0; listIndex < rangeSize; listIndex++) {
            list[listIndex] = getInt128KeyByIndex(_listId, listIndex + _offset);
        }

        return list;
    }

    function getInt128KeyByIndex(bytes32 _listId, uint256 _listIndex) public override view returns (int128) {
        return getInt128(keccak256(abi.encodePacked(_listId, VALUES_POSTFIX, _listIndex)));
    }

    function existsInt128Key(bytes32 _listId, int128 _value) public override view returns (bool) {
        return _existsInIterableList(INT128_ID, _listId, keccak256(abi.encode(_value)));
    }

    // *** Int256 ***
    function addInt256Key(bytes32 _listId, int256 _value) public override {
        bytes32 valueHash = keccak256(abi.encode(_value));
        require(!_existsInIterableList(INT256_ID, _listId, valueHash), "Key exists already in the list");

        uint256 index = _createKeyEntry(INT256_ID, _listId, valueHash);
        setInt256(keccak256(abi.encodePacked(_listId, VALUES_POSTFIX, index)), _value);
    }

    function removeInt256Key(bytes32 _listId, int256 _value) public override {
        bytes32 valueHash = keccak256(abi.encode(_value));
        require(_existsInIterableList(INT256_ID, _listId, valueHash), "Key does not exist in the list");

        uint256 keySize = _getKeySize(INT256_ID, _listId);
        uint256 lastKeyIndex = keySize - 1;

        uint256 index = _removeKeyEntry(INT256_ID, _listId, valueHash);
        deleteInt256(keccak256(abi.encodePacked(_listId, VALUES_POSTFIX, index)));

        // replace position of deleted key with the last key in the list, to avoid gaps
        if (index != lastKeyIndex) {
            int256 lastValueOfList = getInt256KeyByIndex(_listId, lastKeyIndex);
            bytes32 lastValueOfListHash = keccak256(abi.encode(lastValueOfList));
            setInt256(keccak256(abi.encodePacked(_listId, VALUES_POSTFIX, index)), lastValueOfList);
            setUInt256(
                keccak256(
                    abi.encodePacked(
                        INT256_ID,
                        _listId,
                        INDEX_POSTFIX,
                        lastValueOfListHash
                    )
                ),
                index
            );

            // delete old position at last position
            deleteInt256(keccak256(abi.encodePacked(_listId, VALUES_POSTFIX, lastKeyIndex)));
        }
    }

    function getInt256KeySize(bytes32 _listId) public override view returns (uint256) {
        return _getKeySize(INT256_ID, _listId);
    }

    function getInt256Keys(bytes32 _listId) public override view returns (int256[] memory) {
        return getRangeOfInt256Keys(_listId, 0, getInt256KeySize(_listId));
    }

    function getRangeOfInt256Keys(bytes32 _listId, uint256 _offset, uint256 _limit) public override view returns (int256[] memory) {
        uint256 rangeSize = _calculateRangeSizeOfList(getInt256KeySize(_listId), _offset, _limit);

        int256[] memory list = new int256[](rangeSize);

        for (uint256 listIndex = 0; listIndex < rangeSize; listIndex++) {
            list[listIndex] = getInt256KeyByIndex(_listId, listIndex + _offset);
        }

        return list;
    }

    function getInt256KeyByIndex(bytes32 _listId, uint256 _listIndex) public override view returns (int256) {
        return getInt256(keccak256(abi.encodePacked(_listId, VALUES_POSTFIX, _listIndex)));
    }

    function existsInt256Key(bytes32 _listId, int256 _value) public override view returns (bool) {
        return _existsInIterableList(INT256_ID, _listId, keccak256(abi.encode(_value)));
    }

    // *** Address ***
    function addAddressKey(bytes32 _listId, address _value) public override {
        bytes32 valueHash = keccak256(abi.encode(_value));
        require(!_existsInIterableList(ADDRESS_ID, _listId, valueHash), "Key exists already in the list");

        uint256 index = _createKeyEntry(ADDRESS_ID, _listId, valueHash);
        setAddress(keccak256(abi.encodePacked(_listId, VALUES_POSTFIX, index)), _value);
    }

    function removeAddressKey(bytes32 _listId, address _value) public override {
        bytes32 valueHash = keccak256(abi.encode(_value));
        require(_existsInIterableList(ADDRESS_ID, _listId, valueHash), "Key does not exist in the list");

        uint256 keySize = _getKeySize(ADDRESS_ID, _listId);
        uint256 lastKeyIndex = keySize - 1;

        uint256 index = _removeKeyEntry(ADDRESS_ID, _listId, valueHash);
        deleteAddress(keccak256(abi.encodePacked(_listId, VALUES_POSTFIX, index)));

        // replace position of deleted key with the last key in the list, to avoid gaps
        if (index != lastKeyIndex) {
            address lastValueOfList = getAddressKeyByIndex(_listId, lastKeyIndex);
            bytes32 lastValueOfListHash = keccak256(abi.encode(lastValueOfList));
            setAddress(keccak256(abi.encodePacked(_listId, VALUES_POSTFIX, index)), lastValueOfList);
            setUInt256(
                keccak256(
                    abi.encodePacked(
                        ADDRESS_ID,
                        _listId,
                        INDEX_POSTFIX,
                        lastValueOfListHash
                    )
                ),
                index
            );

            // delete old position at last position
            deleteAddress(keccak256(abi.encodePacked(_listId, VALUES_POSTFIX, lastKeyIndex)));
        }
    }

    function getAddressKeySize(bytes32 _listId) public override view returns (uint256) {
        return _getKeySize(ADDRESS_ID, _listId);
    }

    function getAddressKeys(bytes32 _listId) public override view returns (address[] memory) {
        return getRangeOfAddressKeys(_listId, 0, getAddressKeySize(_listId));
    }

    function getRangeOfAddressKeys(bytes32 _listId, uint256 _offset, uint256 _limit) public override view returns (address[] memory) {
        uint256 rangeSize = _calculateRangeSizeOfList(getAddressKeySize(_listId), _offset, _limit);

        address[] memory list = new address[](rangeSize);

        for (uint256 listIndex = 0; listIndex < rangeSize; listIndex++) {
            list[listIndex] = getAddressKeyByIndex(_listId, listIndex + _offset);
        }

        return list;
    }

    function getAddressKeyByIndex(bytes32 _listId, uint256 _listIndex) public override view returns (address) {
        return getAddress(keccak256(abi.encodePacked(_listId, VALUES_POSTFIX, _listIndex)));
    }

    function existsAddressKey(bytes32 _listId, address _value) public override view returns (bool) {
        return _existsInIterableList(ADDRESS_ID, _listId, keccak256(abi.encode(_value)));
    }

    // *** Bytes8 ***
    function addBytes8Key(bytes32 _listId, bytes8 _value) public override {
        bytes32 valueHash = keccak256(abi.encode(_value));
        require(!_existsInIterableList(BYTES8_ID, _listId, valueHash), "Key exists already in the list");

        uint256 index = _createKeyEntry(BYTES8_ID, _listId, valueHash);
        setBytes8(keccak256(abi.encodePacked(_listId, VALUES_POSTFIX, index)), _value);
    }

    function removeBytes8Key(bytes32 _listId, bytes8 _value) public override {
        bytes32 valueHash = keccak256(abi.encode(_value));
        require(_existsInIterableList(BYTES8_ID, _listId, valueHash), "Key does not exist in the list");

        uint256 keySize = _getKeySize(BYTES8_ID, _listId);
        uint256 lastKeyIndex = keySize - 1;

        uint256 index = _removeKeyEntry(BYTES8_ID, _listId, valueHash);
        deleteBytes8(keccak256(abi.encodePacked(_listId, VALUES_POSTFIX, index)));

        // replace position of deleted key with the last key in the list, to avoid gaps
        if (index != lastKeyIndex) {
            bytes8 lastValueOfList = getBytes8KeyByIndex(_listId, lastKeyIndex);
            bytes32 lastValueOfListHash = keccak256(abi.encode(lastValueOfList));
            setBytes8(keccak256(abi.encodePacked(_listId, VALUES_POSTFIX, index)), lastValueOfList);
            setUInt256(
                keccak256(
                    abi.encodePacked(
                        BYTES8_ID,
                        _listId,
                        INDEX_POSTFIX,
                        lastValueOfListHash
                    )
                ),
                index
            );

            // delete old position at last position
            deleteBytes8(keccak256(abi.encodePacked(_listId, VALUES_POSTFIX, lastKeyIndex)));
        }
    }

    function getBytes8KeySize(bytes32 _listId) public override view returns (uint256) {
        return _getKeySize(BYTES8_ID, _listId);
    }

    function getBytes8Keys(bytes32 _listId) public override view returns (bytes8[] memory) {
        return getRangeOfBytes8Keys(_listId, 0, getBytes8KeySize(_listId));
    }

    function getRangeOfBytes8Keys(bytes32 _listId, uint256 _offset, uint256 _limit) public override view returns (bytes8[] memory) {
        uint256 rangeSize = _calculateRangeSizeOfList(getBytes8KeySize(_listId), _offset, _limit);

        bytes8[] memory list = new bytes8[](rangeSize);

        for (uint256 listIndex = 0; listIndex < rangeSize; listIndex++) {
            list[listIndex] = getBytes8KeyByIndex(_listId, listIndex + _offset);
        }

        return list;
    }

    function getBytes8KeyByIndex(bytes32 _listId, uint256 _listIndex) public override view returns (bytes8) {
        return getBytes8(keccak256(abi.encodePacked(_listId, VALUES_POSTFIX, _listIndex)));
    }

    function existsBytes8Key(bytes32 _listId, bytes8 _value) public override view returns (bool) {
        return _existsInIterableList(BYTES8_ID, _listId, keccak256(abi.encode(_value)));
    }

    // *** Bytes16 ***
    function addBytes16Key(bytes32 _listId, bytes16 _value) public override {
        bytes32 valueHash = keccak256(abi.encode(_value));
        require(!_existsInIterableList(BYTES16_ID, _listId, valueHash), "Key exists already in the list");

        uint256 index = _createKeyEntry(BYTES16_ID, _listId, valueHash);
        setBytes16(keccak256(abi.encodePacked(_listId, VALUES_POSTFIX, index)), _value);
    }

    function removeBytes16Key(bytes32 _listId, bytes16 _value) public override {
        bytes32 valueHash = keccak256(abi.encode(_value));
        require(_existsInIterableList(BYTES16_ID, _listId, valueHash), "Key does not exist in the list");

        uint256 keySize = _getKeySize(BYTES16_ID, _listId);
        uint256 lastKeyIndex = keySize - 1;

        uint256 index = _removeKeyEntry(BYTES16_ID, _listId, valueHash);
        deleteBytes16(keccak256(abi.encodePacked(_listId, VALUES_POSTFIX, index)));

        // replace position of deleted key with the last key in the list, to avoid gaps
        if (index != lastKeyIndex) {
            bytes16 lastValueOfList = getBytes16KeyByIndex(_listId, lastKeyIndex);
            bytes32 lastValueOfListHash = keccak256(abi.encode(lastValueOfList));
            setBytes16(keccak256(abi.encodePacked(_listId, VALUES_POSTFIX, index)), lastValueOfList);
            setUInt256(
                keccak256(
                    abi.encodePacked(
                        BYTES16_ID,
                        _listId,
                        INDEX_POSTFIX,
                        lastValueOfListHash
                    )
                ),
                index
            );

            // delete old position at last position
            deleteBytes16(keccak256(abi.encodePacked(_listId, VALUES_POSTFIX, lastKeyIndex)));
        }
    }

    function getBytes16KeySize(bytes32 _listId) public override view returns (uint256) {
        return _getKeySize(BYTES16_ID, _listId);
    }

    function getBytes16Keys(bytes32 _listId) public override view returns (bytes16[] memory) {
        return getRangeOfBytes16Keys(_listId, 0, getBytes16KeySize(_listId));
    }

    function getRangeOfBytes16Keys(bytes32 _listId, uint256 _offset, uint256 _limit) public override view returns (bytes16[] memory) {
        uint256 rangeSize = _calculateRangeSizeOfList(getBytes16KeySize(_listId), _offset, _limit);

        bytes16[] memory list = new bytes16[](rangeSize);

        for (uint256 listIndex = 0; listIndex < rangeSize; listIndex++) {
            list[listIndex] = getBytes16KeyByIndex(_listId, listIndex + _offset);
        }

        return list;
    }

    function getBytes16KeyByIndex(bytes32 _listId, uint256 _listIndex) public override view returns (bytes16) {
        return getBytes16(keccak256(abi.encodePacked(_listId, VALUES_POSTFIX, _listIndex)));
    }

    function existsBytes16Key(bytes32 _listId, bytes16 _value) public override view returns (bool) {
        return _existsInIterableList(BYTES16_ID, _listId, keccak256(abi.encode(_value)));
    }

    // *** Bytes32 ***
    function addBytes32Key(bytes32 _listId, bytes32 _value) public override {
        bytes32 valueHash = keccak256(abi.encode(_value));
        require(!_existsInIterableList(BYTES32_ID, _listId, valueHash), "Key exists already in the list");

        uint256 index = _createKeyEntry(BYTES32_ID, _listId, valueHash);
        setBytes32(keccak256(abi.encodePacked(_listId, VALUES_POSTFIX, index)), _value);
    }

    function removeBytes32Key(bytes32 _listId, bytes32 _value) public override {
        bytes32 valueHash = keccak256(abi.encode(_value));
        require(_existsInIterableList(BYTES32_ID, _listId, valueHash), "Key does not exist in the list");

        uint256 keySize = _getKeySize(BYTES32_ID, _listId);
        uint256 lastKeyIndex = keySize - 1;

        uint256 index = _removeKeyEntry(BYTES32_ID, _listId, valueHash);
        deleteBytes32(keccak256(abi.encodePacked(_listId, VALUES_POSTFIX, index)));

        // replace position of deleted key with the last key in the list, to avoid gaps
        if (index != lastKeyIndex) {
            bytes32 lastValueOfList = getBytes32KeyByIndex(_listId, lastKeyIndex);
            bytes32 lastValueOfListHash = keccak256(abi.encode(lastValueOfList));
            setBytes32(keccak256(abi.encodePacked(_listId, VALUES_POSTFIX, index)), lastValueOfList);
            setUInt256(
                keccak256(
                    abi.encodePacked(
                        BYTES32_ID,
                        _listId,
                        INDEX_POSTFIX,
                        lastValueOfListHash
                    )
                ),
                index
            );

            // delete old position at last position
            deleteBytes32(keccak256(abi.encodePacked(_listId, VALUES_POSTFIX, lastKeyIndex)));
        }
    }

    function getBytes32KeySize(bytes32 _listId) public override view returns (uint256) {
        return _getKeySize(BYTES32_ID, _listId);
    }

    function getBytes32Keys(bytes32 _listId) public override view returns (bytes32[] memory) {
        return getRangeOfBytes32Keys(_listId, 0, getBytes32KeySize(_listId));
    }

    function getRangeOfBytes32Keys(bytes32 _listId, uint256 _offset, uint256 _limit) public override view returns (bytes32[] memory) {
        uint256 rangeSize = _calculateRangeSizeOfList(getBytes32KeySize(_listId), _offset, _limit);

        bytes32[] memory list = new bytes32[](rangeSize);

        for (uint256 listIndex = 0; listIndex < rangeSize; listIndex++) {
            list[listIndex] = getBytes32KeyByIndex(_listId, listIndex + _offset);
        }

        return list;
    }

    function getBytes32KeyByIndex(bytes32 _listId, uint256 _listIndex) public override view returns (bytes32) {
        return getBytes32(keccak256(abi.encodePacked(_listId, VALUES_POSTFIX, _listIndex)));
    }

    function existsBytes32Key(bytes32 _listId, bytes32 _value) public override view returns (bool) {
        return _existsInIterableList(BYTES32_ID, _listId, keccak256(abi.encode(_value)));
    }

    // *** String ***
    function addStringKey(bytes32 _listId, string memory _value) public override {
        bytes32 valueHash = keccak256(abi.encode(_value));
        require(!_existsInIterableList(STRING_ID, _listId, valueHash), "Key exists already in the list");

        uint256 index = _createKeyEntry(STRING_ID, _listId, valueHash);
        setString(keccak256(abi.encodePacked(_listId, VALUES_POSTFIX, index)), _value);
    }

    function removeStringKey(bytes32 _listId, string memory _value) public override {
        bytes32 valueHash = keccak256(abi.encode(_value));
        require(_existsInIterableList(STRING_ID, _listId, valueHash), "Key does not exist in the list");

        uint256 keySize = _getKeySize(STRING_ID, _listId);
        uint256 lastKeyIndex = keySize - 1;

        uint256 index = _removeKeyEntry(STRING_ID, _listId, valueHash);
        deleteString(keccak256(abi.encodePacked(_listId, VALUES_POSTFIX, index)));

        // replace position of deleted key with the last key in the list, to avoid gaps
        if (index != lastKeyIndex) {
            string memory lastValueOfList = getStringKeyByIndex(_listId, lastKeyIndex);
            bytes32 lastValueOfListHash = keccak256(abi.encode(lastValueOfList));
            setString(keccak256(abi.encodePacked(_listId, VALUES_POSTFIX, index)), lastValueOfList);
            setUInt256(
                keccak256(
                    abi.encodePacked(
                        STRING_ID,
                        _listId,
                        INDEX_POSTFIX,
                        lastValueOfListHash
                    )
                ),
                index
            );

            // delete old position at last position
            deleteString(keccak256(abi.encodePacked(_listId, VALUES_POSTFIX, lastKeyIndex)));
        }
    }

    function getStringKeySize(bytes32 _listId) public override view returns (uint256) {
        return _getKeySize(STRING_ID, _listId);
    }

    function getStringKeyByIndex(bytes32 _listId, uint256 _listIndex) public override view returns (string memory) {
        return getString(keccak256(abi.encodePacked(_listId, VALUES_POSTFIX, _listIndex)));
    }

    function existsStringKey(bytes32 _listId, string memory _value) public override view returns (bool) {
        return _existsInIterableList(STRING_ID, _listId, keccak256(abi.encode(_value)));
    }

    function _existsInIterableList(bytes32 _typeId, bytes32 _listId, bytes32 _valueHash) private view returns (bool) {
        return getBool(
            keccak256(
                abi.encodePacked(
                    _typeId,
                    _listId,
                    EXISTS_POSTFIX,
                    _valueHash
                )
            )
        );
    }

    function _getKeySize(bytes32 _typeId, bytes32 _listId) private view returns (uint256) {
        return getUInt256(keccak256(abi.encodePacked(_typeId, _listId, SIZE_POSTFIX)));
    }

    function _setIterableListSize(bytes32 _typeId, bytes32 _listId, uint256 _listSize) private {
        setUInt256(keccak256(abi.encodePacked(_typeId, _listId, SIZE_POSTFIX)), _listSize);
    }

    function _calculateRangeSizeOfList(uint256 _listSize, uint256 _offset, uint256 _limit) private pure returns (uint256) {
        require(_offset < _listSize, "Offset is out of range");

        uint256 rangeSize = _listSize.sub(_offset);

        if (rangeSize > _limit) {
            rangeSize = _limit;
        }

        return rangeSize;
    }

    function _createKeyEntry(bytes32 _typeId, bytes32 _listId, bytes32 _valueHash) private returns (uint256) {
        // the new index is equal to the size of the list before adding a new value
        uint256 newIndex = _getKeySize(_typeId, _listId);
        setUInt256(
            keccak256(
                abi.encodePacked(
                    _typeId,
                    _listId,
                    INDEX_POSTFIX,
                    _valueHash
                )
            ),
            newIndex
        );
        setBool(
            keccak256(
                abi.encodePacked(
                    _typeId,
                    _listId,
                    EXISTS_POSTFIX,
                    _valueHash
                )
            ),
            true
        );
        // the list size is the latest index plus 1
        _setIterableListSize(_typeId, _listId, newIndex + 1);

        return newIndex;
    }

    function _removeKeyEntry(bytes32 _typeId, bytes32 _listId, bytes32 _valueHash) private returns (uint256) {
        uint256 index = getUInt256(
            keccak256(
                abi.encodePacked(
                    _typeId,
                    _listId,
                    INDEX_POSTFIX,
                    _valueHash
                )
            )
        );
        deleteUInt256(
            keccak256(
                abi.encodePacked(
                    _typeId,
                    _listId,
                    INDEX_POSTFIX,
                    _valueHash
                )
            )
        );
        deleteBool(
            keccak256(
                abi.encodePacked(
                    _typeId,
                    _listId,
                    EXISTS_POSTFIX,
                    _valueHash
                )
            )
        );

        _setIterableListSize(_typeId, _listId, _getKeySize(_typeId, _listId) - 1);

        return index;
    }
}
