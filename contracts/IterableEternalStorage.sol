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
    bytes32 private constant UINT256_ID = "uint256";
    bytes32 private constant INT256_ID = "int256";
    bytes32 private constant ADDRESS_ID = "address";
    bytes32 private constant BYTES32_ID = "bytes32";
    bytes32 private constant STRING_ID = "string";
    bytes32 private constant BYTES_ID = "bytes";

    string private constant KEY_EXISTS_ALREADY_IN_THE_LIST = "Key exists already in the list";
    string private constant KEY_DOES_NOT_EXIST_IN_THE_LIST = "Key does not exist in the list";

    // *** UInt256 ***
    function addUInt256Key(bytes32 _listId, uint256 _value) public override {
        bytes32 valueHash = keccak256(abi.encode(_value));
        require(!_existsInIterableList(UINT256_ID, _listId, valueHash), KEY_EXISTS_ALREADY_IN_THE_LIST);

        uint256 index = _createKeyEntry(UINT256_ID, _listId, valueHash);
        setUInt256(keccak256(abi.encodePacked(_listId, VALUES_POSTFIX, index)), _value);
    }

    function removeUInt256Key(bytes32 _listId, uint256 _value) public override {
        bytes32 valueHash = keccak256(abi.encode(_value));
        require(_existsInIterableList(UINT256_ID, _listId, valueHash), KEY_DOES_NOT_EXIST_IN_THE_LIST);

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

    // *** Int256 ***
    function addInt256Key(bytes32 _listId, int256 _value) public override {
        bytes32 valueHash = keccak256(abi.encode(_value));
        require(!_existsInIterableList(INT256_ID, _listId, valueHash), KEY_EXISTS_ALREADY_IN_THE_LIST);

        uint256 index = _createKeyEntry(INT256_ID, _listId, valueHash);
        setInt256(keccak256(abi.encodePacked(_listId, VALUES_POSTFIX, index)), _value);
    }

    function removeInt256Key(bytes32 _listId, int256 _value) public override {
        bytes32 valueHash = keccak256(abi.encode(_value));
        require(_existsInIterableList(INT256_ID, _listId, valueHash), KEY_DOES_NOT_EXIST_IN_THE_LIST);

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
        require(!_existsInIterableList(ADDRESS_ID, _listId, valueHash), KEY_EXISTS_ALREADY_IN_THE_LIST);

        uint256 index = _createKeyEntry(ADDRESS_ID, _listId, valueHash);
        setAddress(keccak256(abi.encodePacked(_listId, VALUES_POSTFIX, index)), _value);
    }

    function removeAddressKey(bytes32 _listId, address _value) public override {
        bytes32 valueHash = keccak256(abi.encode(_value));
        require(_existsInIterableList(ADDRESS_ID, _listId, valueHash), KEY_DOES_NOT_EXIST_IN_THE_LIST);

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

    // *** Bytes32 ***
    function addBytes32Key(bytes32 _listId, bytes32 _value) public override {
        bytes32 valueHash = keccak256(abi.encode(_value));
        require(!_existsInIterableList(BYTES32_ID, _listId, valueHash), KEY_EXISTS_ALREADY_IN_THE_LIST);

        uint256 index = _createKeyEntry(BYTES32_ID, _listId, valueHash);
        setBytes32(keccak256(abi.encodePacked(_listId, VALUES_POSTFIX, index)), _value);
    }

    function removeBytes32Key(bytes32 _listId, bytes32 _value) public override {
        bytes32 valueHash = keccak256(abi.encode(_value));
        require(_existsInIterableList(BYTES32_ID, _listId, valueHash), KEY_DOES_NOT_EXIST_IN_THE_LIST);

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
        require(!_existsInIterableList(STRING_ID, _listId, valueHash), KEY_EXISTS_ALREADY_IN_THE_LIST);

        uint256 index = _createKeyEntry(STRING_ID, _listId, valueHash);
        setString(keccak256(abi.encodePacked(_listId, VALUES_POSTFIX, index)), _value);
    }

    function removeStringKey(bytes32 _listId, string memory _value) public override {
        bytes32 valueHash = keccak256(abi.encode(_value));
        require(_existsInIterableList(STRING_ID, _listId, valueHash), KEY_DOES_NOT_EXIST_IN_THE_LIST);

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

    // *** Bytes ***
    function addBytesKey(bytes32 _listId, bytes memory _value) public override {
        bytes32 valueHash = keccak256(abi.encode(_value));
        require(!_existsInIterableList(BYTES_ID, _listId, valueHash), KEY_EXISTS_ALREADY_IN_THE_LIST);

        uint256 index = _createKeyEntry(BYTES_ID, _listId, valueHash);
        setBytes(keccak256(abi.encodePacked(_listId, VALUES_POSTFIX, index)), _value);
    }

    function removeBytesKey(bytes32 _listId, bytes memory _value) public override {
        bytes32 valueHash = keccak256(abi.encode(_value));
        require(_existsInIterableList(BYTES_ID, _listId, valueHash), KEY_DOES_NOT_EXIST_IN_THE_LIST);

        uint256 keySize = _getKeySize(BYTES_ID, _listId);
        uint256 lastKeyIndex = keySize - 1;

        uint256 index = _removeKeyEntry(BYTES_ID, _listId, valueHash);
        deleteBytes(keccak256(abi.encodePacked(_listId, VALUES_POSTFIX, index)));

        // replace position of deleted key with the last key in the list, to avoid gaps
        if (index != lastKeyIndex) {
            bytes memory lastValueOfList = getBytesKeyByIndex(_listId, lastKeyIndex);
            bytes32 lastValueOfListHash = keccak256(abi.encode(lastValueOfList));
            setBytes(keccak256(abi.encodePacked(_listId, VALUES_POSTFIX, index)), lastValueOfList);
            setUInt256(
                keccak256(
                    abi.encodePacked(
                        BYTES_ID,
                        _listId,
                        INDEX_POSTFIX,
                        lastValueOfListHash
                    )
                ),
                index
            );

            // delete old position at last position
            deleteBytes(keccak256(abi.encodePacked(_listId, VALUES_POSTFIX, lastKeyIndex)));
        }
    }

    function getBytesKeySize(bytes32 _listId) public override view returns (uint256) {
        return _getKeySize(BYTES_ID, _listId);
    }

    function getBytesKeyByIndex(bytes32 _listId, uint256 _listIndex) public override view returns (bytes memory) {
        return getBytes(keccak256(abi.encodePacked(_listId, VALUES_POSTFIX, _listIndex)));
    }

    function existsBytesKey(bytes32 _listId, bytes memory _value) public override view returns (bool) {
        return _existsInIterableList(BYTES_ID, _listId, keccak256(abi.encode(_value)));
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
