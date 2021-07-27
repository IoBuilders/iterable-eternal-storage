const truffleAssert = require('truffle-assertions');
const rn = require('random-number');
const randomString = require("randomstring");

const IterableEternalStorage = artifacts.require("IterableEternalStorage");

let listSize;
let values;
let texts;
let offset;
let limit;
let expectedListSize;
let randomIndex;

function getRandomUInt() {
    return rn({
        integer: true,
        min: 0,
        max: (2 ** 8) -1
    })
}

function getRandomInt() {
    return rn({
        integer: true,
        min: -127,
        max: 127
    })
}

function calculateExpectedListSize(listSize, offset, limit) {
    return (listSize - offset) > limit ? limit : listSize - offset;
}

function initListTest() {
    // size between 2 and 10
    listSize = Math.floor(Math.random() * 10) + 2;
    values = [];
    texts = [];
    // between 0 and (listSize - 1)
    offset = Math.floor(Math.random() * (listSize - 1));
    randomIndex = offset;
    // size between 1 and 10
    limit = Math.floor(Math.random() * 10) + 1;
    expectedListSize = calculateExpectedListSize(listSize, offset, limit);
}

contract('IterableEternalStorage', (accounts) => {
    let iterableEternalStorage;
    let listId;
    let valueNotInList;

    beforeEach(async() => {
        iterableEternalStorage = await IterableEternalStorage.new();
        iterableEternalStorage.upgradeVersion(accounts[0]);
        listId = web3.utils.sha3(Math.random().toString());

        initListTest();
    });

    describe('UInt256', () => {
        beforeEach(async () => {
            for (let i = 0; i < listSize; i++) {
                let value;

                while (true) {
                    value = getRandomUInt();

                    if (!values.includes(value)) {
                        break;
                    }
                }
                await iterableEternalStorage.addUInt256Key(listId, value);
                values.push(value);
            }

            while (true) {
                valueNotInList = getRandomUInt();

                if (!values.includes(valueNotInList)) {
                    break;
                }
            }
        });

        describe('addUInt256Key', async() => {
            it("should revert when not called by latest version", async() => {
                await truffleAssert.reverts(iterableEternalStorage.addUInt256Key(listId, valueNotInList, {from: accounts[1]}));
            });

            it("should revert when an existing values is added", async () => {
                await truffleAssert.reverts(iterableEternalStorage.addUInt256Key(listId, values[0]));
            });

            it("should add a key and increase the key size", async() => {
                const uint256Value = await iterableEternalStorage.getUInt256KeyByIndex(listId, 0);
                assert.isTrue(uint256Value.eq(web3.utils.toBN(values[0])), 'Incorrect value was saved');

                let actualListSize = await iterableEternalStorage.getUInt256KeySize(listId);
                assert.isTrue(actualListSize.eq(web3.utils.toBN(listSize)), 'Length of list is not correct');
            });
        });

        describe('getUInt256Keys', async() => {
            it("should return all items added by addUInt256Key", async() => {
                const uint256Values = await iterableEternalStorage.getUInt256Keys(listId);

                assert.strictEqual(listSize, uint256Values.length, `Expected size of returned array to be ${listSize}, but is ${uint256Values.length}`);

                for (let i = 0; i < listSize; i++) {
                    assert.isTrue(uint256Values[i].eq(web3.utils.toBN(values[i])));
                }
            });
        });

        describe('getRangeOfUInt256Keys', async() => {
            it('should revert if the offset is out of range', async () => {
                await truffleAssert.reverts(iterableEternalStorage.getRangeOfUInt256Keys(listId, listSize, 1));
            });

            it("should return a range of items added by addUInt256Key", async() => {
                const uint256Values = await iterableEternalStorage.getRangeOfUInt256Keys(listId, offset, limit);

                assert.strictEqual(expectedListSize, uint256Values.length, `Expected size of returned array to be ${expectedListSize}, but is ${uint256Values.length}`);

                for (let i = 0; i < expectedListSize; i++) {
                    assert.isTrue(uint256Values[i].eq(web3.utils.toBN(values[i + offset])));
                }
            });
        });

        describe('removeUInt256Key', async () => {
            it("should revert when not called by latest version", async () => {
                await truffleAssert.reverts(iterableEternalStorage.removeUInt256Key(listId, values[0], {from: accounts[1]}));
            });

            it("should revert when a non-existing key is given", async () => {
                await truffleAssert.reverts(iterableEternalStorage.removeUInt256Key(listId, valueNotInList));
            });

            it("should remove a key and decrease the key size", async () => {
                await truffleAssert.passes(iterableEternalStorage.removeUInt256Key(listId, values[randomIndex]));
                // remove item which has been deleted in the smart contract
                values.splice(randomIndex, 1);

                let newListSize = await iterableEternalStorage.getUInt256KeySize(listId);
                assert.isTrue(newListSize.eq(web3.utils.toBN(listSize - 1)), 'Length of list is not correct');

                const uint256Values = await iterableEternalStorage.getUInt256Keys(listId);

                // sort, because the values can be in a different order
                uint256Values.sort();
                values.sort();

                for (let i = 0; i < newListSize; i++) {
                    assert.isTrue(uint256Values[i].eq(web3.utils.toBN(values[i])));
                }
            });

            it("should remove the last key and decrease the key size", async () => {
                await truffleAssert.passes(iterableEternalStorage.removeUInt256Key(listId, values[listSize - 1]));
                // remove last item of array
                values.pop();

                let newListSize = await iterableEternalStorage.getUInt256KeySize(listId);
                assert.isTrue(newListSize.eq(web3.utils.toBN(listSize - 1)), 'Length of list is not correct');

                const uint256Values = await iterableEternalStorage.getUInt256Keys(listId);

                for (let i = 0; i < newListSize; i++) {
                    assert.isTrue(uint256Values[i].eq(web3.utils.toBN(values[i])));
                }
            });
        });

        describe('existsUInt256Key', async () => {
            it("should return true for an existing key", async () => {
                const keyExists = await iterableEternalStorage.existsUInt256Key(listId, values[0]);
                assert.isTrue(keyExists);
            });

            it("should false for a non-existing key", async () => {
                const keyExists = await iterableEternalStorage.existsUInt256Key(listId, valueNotInList);
                assert.isFalse(keyExists);
            });
        });
    });

    describe('Int256', () => {
        beforeEach(async () => {
            for (let i = 0; i < listSize; i++) {
                let value;

                while (true) {
                    value = getRandomInt();

                    if (!values.includes(value)) {
                        break;
                    }
                }

                await iterableEternalStorage.addInt256Key(listId, value);
                values.push(value);
            }

            while (true) {
                valueNotInList = getRandomInt();

                if (!values.includes(valueNotInList)) {
                    break;
                }
            }
        });

        describe('addInt256Key', async () => {
            it("should revert when not called by latest version", async () => {
                await truffleAssert.reverts(iterableEternalStorage.addInt256Key(listId, valueNotInList, {from: accounts[1]}));
            });

            it("should revert when an existing values is added", async () => {
                await truffleAssert.reverts(iterableEternalStorage.addInt256Key(listId, values[0]));
            });

            it("should add a key and increase the key size", async () => {
                const int256Value = await iterableEternalStorage.getInt256KeyByIndex(listId, 0);
                assert.isTrue(int256Value.eq(web3.utils.toBN(values[0])), 'Incorrect value was saved');

                let actualListSize = await iterableEternalStorage.getInt256KeySize(listId);
                assert.isTrue(actualListSize.eq(web3.utils.toBN(listSize)), 'Length of list is not correct');
            });
        });

        describe('getInt256Keys', async () => {
            it("should return all items added by addInt256Key", async () => {
                const int256Values = await iterableEternalStorage.getInt256Keys(listId);

                assert.strictEqual(listSize, int256Values.length, `Expected size of returned array to be ${listSize}, but is ${int256Values.length}`);

                for (let i = 0; i < listSize; i++) {
                    assert.isTrue(int256Values[i].eq(web3.utils.toBN(values[i])));
                }
            });
        });

        describe('getRangeOfInt256Keys', async () => {
            it('should revert if the offset is out of range', async () => {
                await truffleAssert.reverts(iterableEternalStorage.getRangeOfInt256Keys(listId, listSize, 1));
            });

            it("should return a range of items added by addInt256Key", async () => {
                const int256Values = await iterableEternalStorage.getRangeOfInt256Keys(listId, offset, limit);

                assert.strictEqual(expectedListSize, int256Values.length, `Expected size of returned array to be ${expectedListSize}, but is ${int256Values.length}`);

                for (let i = 0; i < expectedListSize; i++) {
                    assert.isTrue(int256Values[i].eq(web3.utils.toBN(values[i + offset])));
                }
            });
        });

        describe('removeInt256Key', async () => {
            it("should revert when not called by latest version", async () => {
                await truffleAssert.reverts(iterableEternalStorage.removeInt256Key(listId, values[0], {from: accounts[1]}));
            });

            it("should revert when a non-existing key is given", async () => {
                await truffleAssert.reverts(iterableEternalStorage.removeInt256Key(listId, valueNotInList));
            });

            it("should remove a key and decrease the key size", async () => {
                await truffleAssert.passes(iterableEternalStorage.removeInt256Key(listId, values[randomIndex]));
                // remove item which has been deleted in the smart contract
                values.splice(randomIndex, 1);

                let newListSize = await iterableEternalStorage.getInt256KeySize(listId);
                assert.isTrue(newListSize.eq(web3.utils.toBN(listSize - 1)), 'Length of list is not correct');

                const int256Values = await iterableEternalStorage.getInt256Keys(listId);

                // sort, because the values can be in a different order
                int256Values.sort();
                values.sort();

                for (let i = 0; i < newListSize; i++) {
                    assert.isTrue(int256Values[i].eq(web3.utils.toBN(values[i])));
                }
            });

            it("should remove the last key and decrease the key size", async () => {
                await truffleAssert.passes(iterableEternalStorage.removeInt256Key(listId, values[listSize - 1]));
                // remove last item of array
                values.pop();

                let newListSize = await iterableEternalStorage.getInt256KeySize(listId);
                assert.isTrue(newListSize.eq(web3.utils.toBN(listSize - 1)), 'Length of list is not correct');

                const int256Values = await iterableEternalStorage.getInt256Keys(listId);

                for (let i = 0; i < newListSize; i++) {
                    assert.isTrue(int256Values[i].eq(web3.utils.toBN(values[i])));
                }
            });
        });

        describe('existsInt256Key', async () => {
            it("should return true for an existing key", async () => {
                const keyExists = await iterableEternalStorage.existsInt256Key(listId, values[0]);
                assert.isTrue(keyExists);
            });

            it("should false for a non-existing key", async () => {
                const keyExists = await iterableEternalStorage.existsInt256Key(listId, valueNotInList);
                assert.isFalse(keyExists);
            });
        });
    });

    describe('Address', () => {
        beforeEach(async () => {
            for (let i = 0; i < listSize; i++) {
                let value;

                while (true) {
                    value = web3.utils.randomHex(20);

                    if (!values.includes(value)) {
                        break;
                    }
                }

                await iterableEternalStorage.addAddressKey(listId, value);
                values.push(value);
            }

            while (true) {
                valueNotInList = web3.utils.randomHex(20);

                if (!values.includes(valueNotInList)) {
                    break;
                }
            }
        });

        describe('addAddressKey', async () => {
            it("should revert when not called by latest version", async () => {
                await truffleAssert.reverts(iterableEternalStorage.addAddressKey(listId, valueNotInList, {from: accounts[1]}));
            });

            it("should revert when an existing values is added", async () => {
                await truffleAssert.reverts(iterableEternalStorage.addAddressKey(listId, values[0]));
            });

            it("should add a key and increase the key size", async () => {
                const addressValue = await iterableEternalStorage.getAddressKeyByIndex(listId, 0);
                assert.strictEqual(values[0], addressValue.toLowerCase(), 'Incorrect value was saved');

                let actualListSize = await iterableEternalStorage.getAddressKeySize(listId);
                assert.isTrue(actualListSize.eq(web3.utils.toBN(listSize)), 'Length of list is not correct');
            });
        });

        describe('getAddressKeys', async () => {
            it("should return all items added by addAddressKey", async () => {
                const addressValues = await iterableEternalStorage.getAddressKeys(listId);

                assert.strictEqual(listSize, addressValues.length, `Expected size of returned array to be ${listSize}, but is ${addressValues.length}`);

                for (let i = 0; i < listSize; i++) {
                    assert.strictEqual(values[i], (addressValues[i]).toLowerCase());
                }
            });
        });

        describe('getRangeOfAddressKeys', async () => {
            it('should revert if the offset is out of range', async () => {
                await truffleAssert.reverts(iterableEternalStorage.getRangeOfAddressKeys(listId, listSize, 1));
            });

            it("should return a range of items added by addAddressKey", async () => {
                const addressValues = await iterableEternalStorage.getRangeOfAddressKeys(listId, offset, limit);

                assert.strictEqual(expectedListSize, addressValues.length, `Expected size of returned array to be ${expectedListSize}, but is ${addressValues.length}`);

                for (let i = 0; i < expectedListSize; i++) {
                    assert.strictEqual(values[i + offset], (addressValues[i]).toLowerCase());
                }
            });
        });

        describe('removeAddressKey', async () => {
            it("should revert when not called by latest version", async () => {
                await truffleAssert.reverts(iterableEternalStorage.removeAddressKey(listId, values[0], {from: accounts[1]}));
            });

            it("should revert when a non-existing key is given", async () => {
                await truffleAssert.reverts(iterableEternalStorage.removeAddressKey(listId, valueNotInList));
            });

            it("should remove a key and decrease the key size", async () => {
                await truffleAssert.passes(iterableEternalStorage.removeAddressKey(listId, values[randomIndex]));
                // remove item which has been deleted in the smart contract
                values.splice(randomIndex, 1);

                let newListSize = await iterableEternalStorage.getAddressKeySize(listId);
                assert.isTrue(newListSize.eq(web3.utils.toBN(listSize - 1)), 'Length of list is not correct');

                const addressValues = await iterableEternalStorage.getAddressKeys(listId);

                addressValues.forEach((addressValue) => {
                    const index = values.indexOf(addressValue.toLowerCase());
                    assert.notStrictEqual(index, -1, `${addressValue.toLowerCase()} is not included in ${values}`);
                    assert.strictEqual(addressValue.toLowerCase(), values[index]);
                });
            });

            it("should remove the last key and decrease the key size", async () => {
                await truffleAssert.passes(iterableEternalStorage.removeAddressKey(listId, values[listSize - 1]));
                // remove last item of array
                values.pop();

                let newListSize = await iterableEternalStorage.getAddressKeySize(listId);
                assert.isTrue(newListSize.eq(web3.utils.toBN(listSize - 1)), 'Length of list is not correct');

                const addressValues = await iterableEternalStorage.getAddressKeys(listId);

                for (let i = 0; i < newListSize; i++) {
                    assert.strictEqual(values[i], (addressValues[i]).toLowerCase());
                }
            });
        });

        describe('existsAddressKey', async () => {
            it("should return true for an existing key", async () => {
                const keyExists = await iterableEternalStorage.existsAddressKey(listId, values[0]);
                assert.isTrue(keyExists);
            });

            it("should false for a non-existing key", async () => {
                const keyExists = await iterableEternalStorage.existsAddressKey(listId, valueNotInList);
                assert.isFalse(keyExists);
            });
        });
    });

    describe('Bytes32', () => {
        beforeEach(async () => {
            for (let i = 0; i < listSize; i++) {
                let value;

                while (true) {
                    text = randomString.generate(32);
                    value = web3.utils.fromAscii(text);

                    if (!values.includes(value)) {
                        break;
                    }
                }

                await iterableEternalStorage.addBytes32Key(listId, value);
                values.push(value);
                texts.push(text);
            }

            while (true) {
                valueNotInList = web3.utils.fromAscii(randomString.generate(32));

                if (!values.includes(valueNotInList)) {
                    break;
                }
            }
        });

        describe('addBytes32Key', async () => {
            it("should revert when not called by latest version", async () => {
                await truffleAssert.reverts(iterableEternalStorage.addBytes32Key(listId, valueNotInList, {from: accounts[1]}));
            });

            it("should revert when an existing values is added", async () => {
                await truffleAssert.reverts(iterableEternalStorage.addBytes32Key(listId, values[0]));
            });

            it("should add a key and increase the key size", async () => {
                const bytes32Value = await iterableEternalStorage.getBytes32KeyByIndex(listId, 0);
                assert.strictEqual(texts[0], web3.utils.toAscii(bytes32Value), 'Incorrect value was saved');

                let actualListSize = await iterableEternalStorage.getBytes32KeySize(listId);
                assert.isTrue(actualListSize.eq(web3.utils.toBN(listSize)), 'Length of list is not correct');
            });
        });

        describe('getBytes32Keys', async () => {
            it("should return all items added by addBytes32Key", async () => {
                const bytes32Values = await iterableEternalStorage.getBytes32Keys(listId);

                assert.strictEqual(listSize, bytes32Values.length, `Expected size of returned array to be ${listSize}, but is ${bytes32Values.length}`);

                for (let i = 0; i < listSize; i++) {
                    assert.strictEqual(texts[i], web3.utils.toAscii(bytes32Values[i]));
                }
            });
        });

        describe('getRangeOfBytes32Keys', async () => {
            it('should revert if the offset is out of range', async () => {
                await truffleAssert.reverts(iterableEternalStorage.getRangeOfBytes32Keys(listId, listSize, 1));
            });

            it("should return a range of items added by addBytes32Key", async () => {
                const bytes32Values = await iterableEternalStorage.getRangeOfBytes32Keys(listId, offset, limit);

                assert.strictEqual(expectedListSize, bytes32Values.length, `Expected size of returned array to be ${expectedListSize}, but is ${bytes32Values.length}`);

                for (let i = 0; i < expectedListSize; i++) {
                    assert.strictEqual(texts[i + offset], web3.utils.toAscii(bytes32Values[i]));
                }
            });
        });

        describe('removeBytes32Key', async () => {
            it("should revert when not called by latest version", async () => {
                await truffleAssert.reverts(iterableEternalStorage.removeBytes32Key(listId, values[0], {from: accounts[1]}));
            });

            it("should revert when a non-existing key is given", async () => {
                await truffleAssert.reverts(iterableEternalStorage.removeBytes32Key(listId, valueNotInList));
            });

            it("should remove a key and decrease the key size", async () => {
                await truffleAssert.passes(iterableEternalStorage.removeBytes32Key(listId, values[randomIndex]));
                // remove item which has been deleted in the smart contract
                texts.splice(randomIndex, 1);

                let newListSize = await iterableEternalStorage.getBytes32KeySize(listId);
                assert.isTrue(newListSize.eq(web3.utils.toBN(listSize - 1)), 'Length of list is not correct');

                const bytes32Values = await iterableEternalStorage.getBytes32Keys(listId);

                let textValues = [];
                bytes32Values.forEach((value) => textValues.push(web3.utils.toAscii(value)) );

                // sort, because the values can be in a different order
                texts = texts.sort();

                textValues.sort().forEach((text, index) => assert.strictEqual(texts[index], text) );
            });

            it("should remove the last key and decrease the key size", async () => {
                await truffleAssert.passes(iterableEternalStorage.removeBytes32Key(listId, values[listSize - 1]));
                // remove last item of array
                values.pop();

                let newListSize = await iterableEternalStorage.getBytes32KeySize(listId);
                assert.isTrue(newListSize.eq(web3.utils.toBN(listSize - 1)), 'Length of list is not correct');

                const bytes32Values = await iterableEternalStorage.getBytes32Keys(listId);

                for (let i = 0; i < newListSize; i++) {
                    assert.strictEqual(texts[i], web3.utils.toAscii(bytes32Values[i]));
                }
            });
        });

        describe('existsBytes32Key', async () => {
            it("should return true for an existing key", async () => {
                const keyExists = await iterableEternalStorage.existsBytes32Key(listId, values[0]);
                assert.isTrue(keyExists);
            });

            it("should false for a non-existing key", async () => {
                const keyExists = await iterableEternalStorage.existsBytes32Key(listId, valueNotInList);
                assert.isFalse(keyExists);
            });
        });
    });

    describe('String', () => {
        beforeEach(async () => {
            for (let i = 0; i < listSize; i++) {
                let value;

                while (true) {
                    value = randomString.generate();

                    if (!values.includes(value)) {
                        break;
                    }
                }

                await iterableEternalStorage.addStringKey(listId, value);
                values.push(value);
            }

            while (true) {
                valueNotInList = randomString.generate();

                if (!values.includes(valueNotInList)) {
                    break;
                }
            }
        });

        describe('addStringKey', async () => {
            it("should revert when not called by latest version", async () => {
                await truffleAssert.reverts(iterableEternalStorage.addStringKey(listId, valueNotInList, {from: accounts[1]}));
            });

            it("should revert when an existing values is added", async () => {
                await truffleAssert.reverts(iterableEternalStorage.addStringKey(listId, values[0]));
            });

            it("should add a key and increase the key size", async () => {
                let actualListSize = await iterableEternalStorage.getStringKeySize(listId);
                assert.isTrue(actualListSize.eq(web3.utils.toBN(listSize)), 'Length of list is not correct');

                for (let i = 0; i < listSize; i++) {
                    const stringValue = await iterableEternalStorage.getStringKeyByIndex(listId, i);
                    assert.strictEqual(values[i], stringValue, 'Incorrect value was saved');
                }
            });
        });

        describe('removeStringKey', async () => {
            it("should revert when not called by latest version", async () => {
                await truffleAssert.reverts(iterableEternalStorage.removeStringKey(listId, values[0], {from: accounts[1]}));
            });

            it("should revert when a non-existing key is given", async () => {
                await truffleAssert.reverts(iterableEternalStorage.removeStringKey(listId, valueNotInList));
            });

            it("should remove a key and decrease the key size", async () => {
                await truffleAssert.passes(iterableEternalStorage.removeStringKey(listId, values[randomIndex]));
                // remove item which has been deleted in the smart contract
                values.splice(randomIndex, 1);

                let newListSize = await iterableEternalStorage.getStringKeySize(listId);
                assert.isTrue(newListSize.eq(web3.utils.toBN(listSize - 1)), 'Length of list is not correct');

                let stringValues = [];

                for (let i = 0; i < newListSize; i++) {
                    const stringValue = await iterableEternalStorage.getStringKeyByIndex(listId, i);
                    stringValues.push(stringValue);
                }

                // sort, because the values can be in a different order
                stringValues.sort();
                values.sort();

                for (let i = 0; i < newListSize; i++) {
                    assert.strictEqual(values[i], stringValues[i]);
                }
            });

            it("should remove the last key and decrease the key size", async () => {
                await truffleAssert.passes(iterableEternalStorage.removeStringKey(listId, values[listSize - 1]));
                // remove last item of array
                values.pop();

                let newListSize = await iterableEternalStorage.getStringKeySize(listId);
                assert.isTrue(newListSize.eq(web3.utils.toBN(listSize - 1)), 'Length of list is not correct');

                for (let i = 0; i < newListSize; i++) {
                    const stringValue = await iterableEternalStorage.getStringKeyByIndex(listId, i);

                    assert.strictEqual(values[i], stringValue);
                }
            });
        });

        describe('existsStringKey', async () => {
            it("should return true for an existing key", async () => {
                const keyExists = await iterableEternalStorage.existsStringKey(listId, values[0]);
                assert.isTrue(keyExists);
            });

            it("should false for a non-existing key", async () => {
                const keyExists = await iterableEternalStorage.existsStringKey(listId, valueNotInList);
                assert.isFalse(keyExists);
            });
        });
    });

    describe('Bytes', () => {
        beforeEach(async () => {
            for (let i = 0; i < listSize; i++) {
                let value;

                while (true) {
                    value = web3.utils.toHex(randomString.generate());

                    if (!values.includes(value)) {
                        break;
                    }
                }

                await iterableEternalStorage.addBytesKey(listId, value);
                values.push(value);
            }

            while (true) {
                valueNotInList = web3.utils.toHex(randomString.generate());

                if (!values.includes(valueNotInList)) {
                    break;
                }
            }
        });

        describe('addBytesKey', async () => {
            it("should revert when not called by latest version", async () => {
                await truffleAssert.reverts(iterableEternalStorage.addBytesKey(listId, valueNotInList, {from: accounts[1]}));
            });

            it("should revert when an existing values is added", async () => {
                await truffleAssert.reverts(iterableEternalStorage.addBytesKey(listId, values[0]));
            });

            it("should add a key and increase the key size", async () => {
                let actualListSize = await iterableEternalStorage.getBytesKeySize(listId);
                assert.isTrue(actualListSize.eq(web3.utils.toBN(listSize)), 'Length of list is not correct');

                for (let i = 0; i < listSize; i++) {
                    const bytesValue = await iterableEternalStorage.getBytesKeyByIndex(listId, i);
                    assert.strictEqual(values[i], bytesValue, 'Incorrect value was saved');
                }
            });
        });

        describe('removeBytesKey', async () => {
            it("should revert when not called by latest version", async () => {
                await truffleAssert.reverts(iterableEternalStorage.removeBytesKey(listId, values[0], {from: accounts[1]}));
            });

            it("should revert when a non-existing key is given", async () => {
                await truffleAssert.reverts(iterableEternalStorage.removeBytesKey(listId, valueNotInList));
            });

            it("should remove a key and decrease the key size", async () => {
                await truffleAssert.passes(iterableEternalStorage.removeBytesKey(listId, values[randomIndex]));
                // remove item which has been deleted in the smart contract
                values.splice(randomIndex, 1);

                let newListSize = await iterableEternalStorage.getBytesKeySize(listId);
                assert.isTrue(newListSize.eq(web3.utils.toBN(listSize - 1)), 'Length of list is not correct');

                let bytesValues = [];

                for (let i = 0; i < newListSize; i++) {
                    const bytesValue = await iterableEternalStorage.getBytesKeyByIndex(listId, i);
                    bytesValues.push(bytesValue);
                }

                // sort, because the values can be in a different order
                bytesValues.sort();
                values.sort();

                for (let i = 0; i < newListSize; i++) {
                    assert.strictEqual(values[i], bytesValues[i]);
                }
            });

            it("should remove the last key and decrease the key size", async () => {
                await truffleAssert.passes(iterableEternalStorage.removeBytesKey(listId, values[listSize - 1]));
                // remove last item of array
                values.pop();

                let newListSize = await iterableEternalStorage.getBytesKeySize(listId);
                assert.isTrue(newListSize.eq(web3.utils.toBN(listSize - 1)), 'Length of list is not correct');

                for (let i = 0; i < newListSize; i++) {
                    const bytesValue = await iterableEternalStorage.getBytesKeyByIndex(listId, i);

                    assert.strictEqual(values[i], bytesValue);
                }
            });
        });

        describe('existsBytesKey', async () => {
            it("should return true for an existing key", async () => {
                const keyExists = await iterableEternalStorage.existsBytesKey(listId, values[0]);
                assert.isTrue(keyExists);
            });

            it("should false for a non-existing key", async () => {
                const keyExists = await iterableEternalStorage.existsBytesKey(listId, valueNotInList);
                assert.isFalse(keyExists);
            });
        });
    });
});
