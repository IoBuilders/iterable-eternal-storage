const truffleAssert = require('truffle-assertions');
const rn = require('random-number');
const randomString = require("randomstring");

const IterableEternalStorage = artifacts.require("IterableEternalStorage");

let listSize;
let values;
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

    describe('UInt8', () => {
        beforeEach(async () => {
            for (let i = 0; i < listSize; i++) {
                let value;

                while (true) {
                    value = getRandomUInt();

                    if (!values.includes(value)) {
                        break;
                    }
                }

                await iterableEternalStorage.addUInt8Key(listId, value);
                values.push(value);
            }

            while (true) {
                valueNotInList = getRandomUInt();

                if (!values.includes(valueNotInList)) {
                    break;
                }
            }
        });

        describe('addUInt8Key', async () => {
            it("should revert when not called by latest version", async () => {
                await truffleAssert.reverts(iterableEternalStorage.addUInt8Key(listId, valueNotInList, {from: accounts[1]}));
            });

            it("should revert when an existing values is added", async () => {
                await truffleAssert.reverts(iterableEternalStorage.addUInt8Key(listId, values[0]));
            });

            it("should add a key and increase the key size", async () => {
                const uint8Value = await iterableEternalStorage.getUInt8KeyByIndex(listId, 0);
                assert.isTrue(uint8Value.eq(web3.utils.toBN(values[0])), 'Incorrect value was saved');

                let actualListSize = await iterableEternalStorage.getUInt8KeySize(listId);
                assert.isTrue(actualListSize.eq(web3.utils.toBN(listSize)), 'Length of list is not correct');
            });
        });

        describe('getUInt8Keys', async () => {
            it("should return all items added by addUInt8Key", async () => {
                const uint8Values = await iterableEternalStorage.getUInt8Keys(listId);

                assert.strictEqual(listSize, uint8Values.length, `Expected size of returned array to be ${listSize}, but is ${uint8Values.length}`);

                for (let i = 0; i < listSize; i++) {
                    assert.isTrue(uint8Values[i].eq(web3.utils.toBN(values[i])));
                }
            });
        });

        describe('getRangeOfUInt8Keys', async () => {
            it('should revert if the offset is out of range', async () => {
                await truffleAssert.reverts(iterableEternalStorage.getRangeOfUInt8Keys(listId, listSize, 1));
            });

            it("should return a range of items added by addUInt8Key", async () => {
                const uint8Values = await iterableEternalStorage.getRangeOfUInt8Keys(listId, offset, limit);

                assert.strictEqual(expectedListSize, uint8Values.length, `Expected size of returned array to be ${expectedListSize}, but is ${uint8Values.length}`);

                for (let i = 0; i < expectedListSize; i++) {
                    assert.isTrue(uint8Values[i].eq(web3.utils.toBN(values[i + offset])));
                }
            });
        });

        describe('removeUInt8Key', async () => {
            it("should revert when not called by latest version", async () => {
                await truffleAssert.reverts(iterableEternalStorage.removeUInt8Key(listId, values[0], {from: accounts[1]}));
            });

            it("should revert when a non-existing key is given", async () => {
                await truffleAssert.reverts(iterableEternalStorage.removeUInt8Key(listId, valueNotInList));
            });

            it("should remove a key and decrease the key size", async () => {
                await truffleAssert.passes(iterableEternalStorage.removeUInt8Key(listId, values[randomIndex]));
                // remove item which has been deleted in the smart contract
                values.splice(randomIndex, 1);

                const newListSize = await iterableEternalStorage.getUInt8KeySize(listId);
                assert.isTrue(newListSize.eq(web3.utils.toBN(listSize - 1)), 'Length of list is not correct');

                const uint8Values = await iterableEternalStorage.getUInt8Keys(listId);

                // sort, because the values can be in a different order
                uint8Values.sort();
                values.sort();

                for (let i = 0; i < newListSize; i++) {
                    assert.isTrue(uint8Values[i].eq(web3.utils.toBN(values[i])));
                }
            });

            it("should remove the last key and decrease the key size", async () => {
                await truffleAssert.passes(iterableEternalStorage.removeUInt8Key(listId, values[listSize - 1]));
                // remove last item of array
                values.pop();

                let newListSize = await iterableEternalStorage.getUInt8KeySize(listId);
                assert.isTrue(newListSize.eq(web3.utils.toBN(listSize - 1)), 'Length of list is not correct');

                const uint8Values = await iterableEternalStorage.getUInt8Keys(listId);

                for (let i = 0; i < newListSize; i++) {
                    assert.isTrue(uint8Values[i].eq(web3.utils.toBN(values[i])));
                }
            });
        });

        describe('existsUInt8Key', async () => {
            it("should return true for an existing key", async () => {
                const keyExists = await iterableEternalStorage.existsUInt8Key(listId, values[0]);
                assert.isTrue(keyExists);
            });

            it("should false for a non-existing key", async () => {
                const keyExists = await iterableEternalStorage.existsUInt8Key(listId, valueNotInList);
                assert.isFalse(keyExists);
            });
        });
    });

    describe('UInt128', () => {
        beforeEach(async () => {
            for (let i = 0; i < listSize; i++) {
                let value;

                while (true) {
                    value = getRandomUInt();

                    if (!values.includes(value)) {
                        break;
                    }
                }
                await iterableEternalStorage.addUInt128Key(listId, value);
                values.push(value);
            }

            while (true) {
                valueNotInList = getRandomUInt();

                if (!values.includes(valueNotInList)) {
                    break;
                }
            }
        });

        describe('addUInt128Key', async () => {
            it("should revert when not called by latest version", async () => {
                await truffleAssert.reverts(iterableEternalStorage.addUInt128Key(listId, valueNotInList, {from: accounts[1]}));
            });

            it("should revert when an existing values is added", async () => {
                await truffleAssert.reverts(iterableEternalStorage.addUInt128Key(listId, values[0]));
            });

            it("should add a key and increase the key size", async () => {
                const uint128Value = await iterableEternalStorage.getUInt128KeyByIndex(listId, 0);
                assert.isTrue(uint128Value.eq(web3.utils.toBN(values[0])), 'Incorrect value was saved');

                let actualListSize = await iterableEternalStorage.getUInt128KeySize(listId);
                assert.isTrue(actualListSize.eq(web3.utils.toBN(listSize)), 'Length of list is not correct');
            });
        });

        describe('getUInt128Keys', async () => {
            it("should return all items added by addUInt128Key", async () => {
                const uint128Values = await iterableEternalStorage.getUInt128Keys(listId);

                assert.strictEqual(listSize, uint128Values.length, `Expected size of returned array to be ${listSize}, but is ${uint128Values.length}`);

                for (let i = 0; i < listSize; i++) {
                    assert.isTrue(uint128Values[i].eq(web3.utils.toBN(values[i])));
                }
            });
        });

        describe('getRangeOfUInt128Keys', async () => {
            it('should revert if the offset is out of range', async () => {
                await truffleAssert.reverts(iterableEternalStorage.getRangeOfUInt128Keys(listId, listSize, 1));
            });

            it("should return a range of items added by addUInt128Key", async () => {
                const uint128Values = await iterableEternalStorage.getRangeOfUInt128Keys(listId, offset, limit);

                assert.strictEqual(expectedListSize, uint128Values.length, `Expected size of returned array to be ${expectedListSize}, but is ${uint128Values.length}`);

                for (let i = 0; i < expectedListSize; i++) {
                    assert.isTrue(uint128Values[i].eq(web3.utils.toBN(values[i + offset])));
                }
            });
        });

        describe('removeUInt128Key', async () => {
            it("should revert when not called by latest version", async () => {
                await truffleAssert.reverts(iterableEternalStorage.removeUInt128Key(listId, values[0], {from: accounts[1]}));
            });

            it("should revert when a non-existing key is given", async () => {
                await truffleAssert.reverts(iterableEternalStorage.removeUInt128Key(listId, valueNotInList));
            });

            it("should remove a key and decrease the key size", async () => {
                await truffleAssert.passes(iterableEternalStorage.removeUInt128Key(listId, values[randomIndex]));
                // remove item which has been deleted in the smart contract
                values.splice(randomIndex, 1);

                let newListSize = await iterableEternalStorage.getUInt128KeySize(listId);
                assert.isTrue(newListSize.eq(web3.utils.toBN(listSize - 1)), 'Length of list is not correct');

                const uint128Values = await iterableEternalStorage.getUInt128Keys(listId);

                // sort, because the values can be in a different order
                uint128Values.sort();
                values.sort();

                for (let i = 0; i < newListSize; i++) {
                    assert.isTrue(uint128Values[i].eq(web3.utils.toBN(values[i])));
                }
            });

            it("should remove the last key and decrease the key size", async () => {
                await truffleAssert.passes(iterableEternalStorage.removeUInt128Key(listId, values[listSize - 1]));
                // remove last item of array
                values.pop();

                let newListSize = await iterableEternalStorage.getUInt128KeySize(listId);
                assert.isTrue(newListSize.eq(web3.utils.toBN(listSize - 1)), 'Length of list is not correct');

                const uint128Values = await iterableEternalStorage.getUInt128Keys(listId);

                for (let i = 0; i < newListSize; i++) {
                    assert.isTrue(uint128Values[i].eq(web3.utils.toBN(values[i])));
                }
            });
        });

        describe('existsUInt128Key', async () => {
            it("should return true for an existing key", async () => {
                const keyExists = await iterableEternalStorage.existsUInt128Key(listId, values[0]);
                assert.isTrue(keyExists);
            });

            it("should false for a non-existing key", async () => {
                const keyExists = await iterableEternalStorage.existsUInt128Key(listId, valueNotInList);
                assert.isFalse(keyExists);
            });
        });
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

    describe('Int8', () => {
        beforeEach(async () => {
            for (let i = 0; i < listSize; i++) {
                let value;

                while (true) {
                    value = getRandomInt();

                    if (!values.includes(value)) {
                        break;
                    }
                }

                await iterableEternalStorage.addInt8Key(listId, value);
                values.push(value);
            }

            while (true) {
                valueNotInList = getRandomInt();

                if (!values.includes(valueNotInList)) {
                    break;
                }
            }
        });

        describe('addInt8Key', async () => {
            it("should revert when not called by latest version", async () => {
                await truffleAssert.reverts(iterableEternalStorage.addInt8Key(listId, valueNotInList, {from: accounts[1]}));
            });

            it("should revert when an existing values is added", async () => {
                await truffleAssert.reverts(iterableEternalStorage.addInt8Key(listId, values[0]));
            });

            it("should add a key and increase the key size", async () => {
                const int8Value = await iterableEternalStorage.getInt8KeyByIndex(listId, 0);
                assert.isTrue(int8Value.eq(web3.utils.toBN(values[0])), 'Incorrect value was saved');

                let actualListSize = await iterableEternalStorage.getInt8KeySize(listId);
                assert.isTrue(actualListSize.eq(web3.utils.toBN(listSize)), 'Length of list is not correct');
            });
        });

        describe('getInt8Keys', async () => {
            it("should return all items added by addInt8Key", async () => {
                const int8Values = await iterableEternalStorage.getInt8Keys(listId);

                assert.strictEqual(listSize, int8Values.length, `Expected size of returned array to be ${listSize}, but is ${int8Values.length}`);

                for (let i = 0; i < listSize; i++) {
                    assert.isTrue(int8Values[i].eq(web3.utils.toBN(values[i])));
                }
            });
        });

        describe('getRangeOfInt8Keys', async () => {
            it('should revert if the offset is out of range', async () => {
                await truffleAssert.reverts(iterableEternalStorage.getRangeOfInt8Keys(listId, listSize, 1));
            });

            it("should return a range of items added by addInt8Key", async () => {
                const int8Values = await iterableEternalStorage.getRangeOfInt8Keys(listId, offset, limit);

                assert.strictEqual(expectedListSize, int8Values.length, `Expected size of returned array to be ${expectedListSize}, but is ${int8Values.length}`);

                for (let i = 0; i < expectedListSize; i++) {
                    assert.isTrue(int8Values[i].eq(web3.utils.toBN(values[i + offset])));
                }
            });
        });

        describe('removeInt8Key', async () => {
            it("should revert when not called by latest version", async () => {
                await truffleAssert.reverts(iterableEternalStorage.removeInt8Key(listId, values[0], {from: accounts[1]}));
            });

            it("should revert when a non-existing key is given", async () => {
                await truffleAssert.reverts(iterableEternalStorage.removeInt8Key(listId, valueNotInList));
            });

            it("should remove a key and decrease the key size", async () => {
                await truffleAssert.passes(iterableEternalStorage.removeInt8Key(listId, values[randomIndex]));
                // remove item which has been deleted in the smart contract
                values.splice(randomIndex, 1);

                let newListSize = await iterableEternalStorage.getInt8KeySize(listId);
                assert.isTrue(newListSize.eq(web3.utils.toBN(listSize - 1)), 'Length of list is not correct');

                const int8Values = await iterableEternalStorage.getInt8Keys(listId);

                // sort, because the values can be in a different order
                int8Values.sort();
                values.sort();

                for (let i = 0; i < newListSize; i++) {
                    assert.isTrue(int8Values[i].eq(web3.utils.toBN(values[i])));
                }
            });

            it("should remove the last key and decrease the key size", async () => {
                await truffleAssert.passes(iterableEternalStorage.removeInt8Key(listId, values[listSize - 1]));
                // remove last item of array
                values.pop();

                let newListSize = await iterableEternalStorage.getInt8KeySize(listId);
                assert.isTrue(newListSize.eq(web3.utils.toBN(listSize - 1)), 'Length of list is not correct');

                const int8Values = await iterableEternalStorage.getInt8Keys(listId);

                for (let i = 0; i < newListSize; i++) {
                    assert.isTrue(int8Values[i].eq(web3.utils.toBN(values[i])));
                }
            });
        });

        describe('existsInt8Key', async () => {
            it("should return true for an existing key", async () => {
                const keyExists = await iterableEternalStorage.existsInt8Key(listId, values[0]);
                assert.isTrue(keyExists);
            });

            it("should false for a non-existing key", async () => {
                const keyExists = await iterableEternalStorage.existsInt8Key(listId, valueNotInList);
                assert.isFalse(keyExists);
            });
        });
    });

    describe('Int128', () => {
        beforeEach(async () => {
            for (let i = 0; i < listSize; i++) {
                let value;

                while (true) {
                    value = getRandomInt();

                    if (!values.includes(value)) {
                        break;
                    }
                }

                await iterableEternalStorage.addInt128Key(listId, value);
                values.push(value);
            }

            while (true) {
                valueNotInList = getRandomInt();

                if (!values.includes(valueNotInList)) {
                    break;
                }
            }
        });

        describe('addInt128Key', async () => {
            it("should revert when not called by latest version", async () => {
                await truffleAssert.reverts(iterableEternalStorage.addInt128Key(listId, valueNotInList, {from: accounts[1]}));
            });

            it("should revert when an existing values is added", async () => {
                await truffleAssert.reverts(iterableEternalStorage.addInt128Key(listId, values[0]));
            });

            it("should add a key and increase the key size", async () => {
                const int128Value = await iterableEternalStorage.getInt128KeyByIndex(listId, 0);
                assert.isTrue(int128Value.eq(web3.utils.toBN(values[0])), 'Incorrect value was saved');

                let actualListSize = await iterableEternalStorage.getInt128KeySize(listId);
                assert.isTrue(actualListSize.eq(web3.utils.toBN(listSize)), 'Length of list is not correct');
            });
        });

        describe('getInt128Keys', async () => {
            it("should return all items added by addInt128Key", async () => {
                const int128Values = await iterableEternalStorage.getInt128Keys(listId);

                assert.strictEqual(listSize, int128Values.length, `Expected size of returned array to be ${listSize}, but is ${int128Values.length}`);

                for (let i = 0; i < listSize; i++) {
                    assert.isTrue(int128Values[i].eq(web3.utils.toBN(values[i])));
                }
            });
        });

        describe('getRangeOfInt128Keys', async () => {
            it('should revert if the offset is out of range', async () => {
                await truffleAssert.reverts(iterableEternalStorage.getRangeOfInt128Keys(listId, listSize, 1));
            });

            it("should return a range of items added by addInt128Key", async () => {
                const int128Values = await iterableEternalStorage.getRangeOfInt128Keys(listId, offset, limit);

                assert.strictEqual(expectedListSize, int128Values.length, `Expected size of returned array to be ${expectedListSize}, but is ${int128Values.length}`);

                for (let i = 0; i < expectedListSize; i++) {
                    assert.isTrue(int128Values[i].eq(web3.utils.toBN(values[i + offset])));
                }
            });
        });

        describe('removeInt128Key', async () => {
            it("should revert when not called by latest version", async () => {
                await truffleAssert.reverts(iterableEternalStorage.removeInt128Key(listId, values[0], {from: accounts[1]}));
            });

            it("should revert when a non-existing key is given", async () => {
                await truffleAssert.reverts(iterableEternalStorage.removeInt128Key(listId, valueNotInList));
            });

            it("should remove a key and decrease the key size", async () => {
                await truffleAssert.passes(iterableEternalStorage.removeInt128Key(listId, values[randomIndex]));
                // remove item which has been deleted in the smart contract
                values.splice(randomIndex, 1);

                let newListSize = await iterableEternalStorage.getInt128KeySize(listId);
                assert.isTrue(newListSize.eq(web3.utils.toBN(listSize - 1)), 'Length of list is not correct');

                const int128Values = await iterableEternalStorage.getInt128Keys(listId);

                // sort, because the values can be in a different order
                int128Values.sort();
                values.sort();

                for (let i = 0; i < newListSize; i++) {
                    assert.isTrue(int128Values[i].eq(web3.utils.toBN(values[i])));
                }
            });

            it("should remove the last key and decrease the key size", async () => {
                await truffleAssert.passes(iterableEternalStorage.removeInt128Key(listId, values[listSize - 1]));
                // remove last item of array
                values.pop();

                let newListSize = await iterableEternalStorage.getInt128KeySize(listId);
                assert.isTrue(newListSize.eq(web3.utils.toBN(listSize - 1)), 'Length of list is not correct');

                const int128Values = await iterableEternalStorage.getInt128Keys(listId);

                for (let i = 0; i < newListSize; i++) {
                    assert.isTrue(int128Values[i].eq(web3.utils.toBN(values[i])));
                }
            });
        });

        describe('existsInt128Key', async () => {
            it("should return true for an existing key", async () => {
                const keyExists = await iterableEternalStorage.existsInt128Key(listId, values[0]);
                assert.isTrue(keyExists);
            });

            it("should false for a non-existing key", async () => {
                const keyExists = await iterableEternalStorage.existsInt128Key(listId, valueNotInList);
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

                for (let i = 0; i < addressValues.length; i++) {
                    addressValues[i] = (addressValues[i]).toLowerCase();
                }

                // sort, because the values can be in a different order
                addressValues.sort();
                values.sort();

                for (let i = 0; i < newListSize; i++) {
                    assert.strictEqual(values[i], addressValues[i]);
                }
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

    describe('Bytes8', () => {
        beforeEach(async () => {
            for (let i = 0; i < listSize; i++) {
                let value;

                while (true) {
                    value = web3.utils.hexToBytes(web3.utils.randomHex(8));

                    if (!values.includes(value)) {
                        break;
                    }
                }

                await iterableEternalStorage.addBytes8Key(listId, value);
                values.push(value);
            }

            while (true) {
                valueNotInList = web3.utils.hexToBytes(web3.utils.randomHex(8));

                if (!values.includes(valueNotInList)) {
                    break;
                }
            }
        });

        describe('addBytes8Key', async () => {
            it("should revert when not called by latest version", async () => {
                await truffleAssert.reverts(iterableEternalStorage.addBytes8Key(listId, valueNotInList, {from: accounts[1]}));
            });

            it("should revert when an existing values is added", async () => {
                await truffleAssert.reverts(iterableEternalStorage.addBytes8Key(listId, values[0]));
            });

            it("should add a key and increase the key size", async () => {
                const bytes8Value = await iterableEternalStorage.getBytes8KeyByIndex(listId, 0);
                assert.strictEqual(web3.utils.bytesToHex(values[0]), bytes8Value, 'Incorrect value was saved');

                let actualListSize = await iterableEternalStorage.getBytes8KeySize(listId);
                assert.isTrue(actualListSize.eq(web3.utils.toBN(listSize)), 'Length of list is not correct');
            });
        });

        describe('getBytes8Keys', async () => {
            it("should return all items added by addBytes8Key", async () => {
                const bytes8Values = await iterableEternalStorage.getBytes8Keys(listId);

                assert.strictEqual(listSize, bytes8Values.length, `Expected size of returned array to be ${listSize}, but is ${bytes8Values.length}`);

                for (let i = 0; i < listSize; i++) {
                    assert.strictEqual(web3.utils.bytesToHex(values[i]), bytes8Values[i]);
                }
            });
        });

        describe('getRangeOfBytes8Keys', async () => {
            it('should revert if the offset is out of range', async () => {
                await truffleAssert.reverts(iterableEternalStorage.getRangeOfBytes8Keys(listId, listSize, 1));
            });

            it("should return a range of items added by addBytes8Key", async () => {
                const bytes8Values = await iterableEternalStorage.getRangeOfBytes8Keys(listId, offset, limit);

                assert.strictEqual(expectedListSize, bytes8Values.length, `Expected size of returned array to be ${expectedListSize}, but is ${bytes8Values.length}`);

                for (let i = 0; i < expectedListSize; i++) {
                    assert.strictEqual(web3.utils.bytesToHex(values[i + offset]), bytes8Values[i]);
                }
            });
        });

        describe('removeBytes8Key', async () => {
            it("should revert when not called by latest version", async () => {
                await truffleAssert.reverts(iterableEternalStorage.removeBytes8Key(listId, values[0], {from: accounts[1]}));
            });

            it("should revert when a non-existing key is given", async () => {
                await truffleAssert.reverts(iterableEternalStorage.removeBytes8Key(listId, valueNotInList));
            });

            it("should remove a key and decrease the key size", async () => {
                await truffleAssert.passes(iterableEternalStorage.removeBytes8Key(listId, values[randomIndex]));
                // remove item which has been deleted in the smart contract
                values.splice(randomIndex, 1);

                let newListSize = await iterableEternalStorage.getBytes8KeySize(listId);
                assert.isTrue(newListSize.eq(web3.utils.toBN(listSize - 1)), 'Length of list is not correct');

                const bytes8Values = await iterableEternalStorage.getBytes8Keys(listId);

                for (let i = 0; i < bytes8Values.length; i++) {
                    values[i] = web3.utils.bytesToHex(values[i]);
                }

                // sort, because the values can be in a different order
                bytes8Values.sort();
                values.sort();

                for (let i = 0; i < newListSize; i++) {
                    assert.strictEqual(values[i], bytes8Values[i]);
                }
            });

            it("should remove the last key and decrease the key size", async () => {
                await truffleAssert.passes(iterableEternalStorage.removeBytes8Key(listId, values[listSize - 1]));
                // remove last item of array
                values.pop();

                let newListSize = await iterableEternalStorage.getBytes8KeySize(listId);
                assert.isTrue(newListSize.eq(web3.utils.toBN(listSize - 1)), 'Length of list is not correct');

                const bytes8Values = await iterableEternalStorage.getBytes8Keys(listId);

                for (let i = 0; i < newListSize; i++) {
                    assert.strictEqual(web3.utils.bytesToHex(values[i]), bytes8Values[i]);
                }
            });
        });

        describe('existsBytes8Key', async () => {
            it("should return true for an existing key", async () => {
                const keyExists = await iterableEternalStorage.existsBytes8Key(listId, values[0]);
                assert.isTrue(keyExists);
            });

            it("should false for a non-existing key", async () => {
                const keyExists = await iterableEternalStorage.existsBytes8Key(listId, valueNotInList);
                assert.isFalse(keyExists);
            });
        });
    });

    describe('Bytes16', () => {
        beforeEach(async () => {
            for (let i = 0; i < listSize; i++) {
                let value;

                while (true) {
                    value = web3.utils.hexToBytes(web3.utils.randomHex(16));

                    if (!values.includes(value)) {
                        break;
                    }
                }

                await iterableEternalStorage.addBytes16Key(listId, value);
                values.push(value);
            }

            while (true) {
                valueNotInList = web3.utils.hexToBytes(web3.utils.randomHex(16));

                if (!values.includes(valueNotInList)) {
                    break;
                }
            }
        });

        describe('addBytes16Key', async () => {
            it("should revert when not called by latest version", async () => {
                await truffleAssert.reverts(iterableEternalStorage.addBytes16Key(listId, valueNotInList, {from: accounts[1]}));
            });

            it("should revert when an existing values is added", async () => {
                await truffleAssert.reverts(iterableEternalStorage.addBytes16Key(listId, values[0]));
            });

            it("should add a key and increase the key size", async () => {
                const bytes16Value = await iterableEternalStorage.getBytes16KeyByIndex(listId, 0);
                assert.strictEqual(web3.utils.bytesToHex(values[0]), bytes16Value, 'Incorrect value was saved');

                let actualListSize = await iterableEternalStorage.getBytes16KeySize(listId);
                assert.isTrue(actualListSize.eq(web3.utils.toBN(listSize)), 'Length of list is not correct');
            });
        });

        describe('getBytes16Keys', async () => {
            it("should return all items added by addBytes16Key", async () => {
                const bytes16Values = await iterableEternalStorage.getBytes16Keys(listId);

                assert.strictEqual(listSize, bytes16Values.length, `Expected size of returned array to be ${listSize}, but is ${bytes16Values.length}`);

                for (let i = 0; i < listSize; i++) {
                    assert.strictEqual(web3.utils.bytesToHex(values[i]), bytes16Values[i]);
                }
            });
        });

        describe('getRangeOfBytes16Keys', async () => {
            it('should revert if the offset is out of range', async () => {
                await truffleAssert.reverts(iterableEternalStorage.getRangeOfBytes16Keys(listId, listSize, 1));
            });

            it("should return a range of items added by addBytes16Key", async () => {
                const bytes16Values = await iterableEternalStorage.getRangeOfBytes16Keys(listId, offset, limit);

                assert.strictEqual(expectedListSize, bytes16Values.length, `Expected size of returned array to be ${expectedListSize}, but is ${bytes16Values.length}`);

                for (let i = 0; i < expectedListSize; i++) {
                    assert.strictEqual(web3.utils.bytesToHex(values[i + offset]), bytes16Values[i]);
                }
            });
        });

        describe('removeBytes16Key', async () => {
            it("should revert when not called by latest version", async () => {
                await truffleAssert.reverts(iterableEternalStorage.removeBytes16Key(listId, values[0], {from: accounts[1]}));
            });

            it("should revert when a non-existing key is given", async () => {
                await truffleAssert.reverts(iterableEternalStorage.removeBytes16Key(listId, valueNotInList));
            });

            it("should remove a key and decrease the key size", async () => {
                await truffleAssert.passes(iterableEternalStorage.removeBytes16Key(listId, values[randomIndex]));
                // remove item which has been deleted in the smart contract
                values.splice(randomIndex, 1);

                let newListSize = await iterableEternalStorage.getBytes16KeySize(listId);
                assert.isTrue(newListSize.eq(web3.utils.toBN(listSize - 1)), 'Length of list is not correct');

                const bytes16Values = await iterableEternalStorage.getBytes16Keys(listId);

                for (let i = 0; i < bytes16Values.length; i++) {
                    values[i] = web3.utils.bytesToHex(values[i]);
                }

                // sort, because the values can be in a different order
                bytes16Values.sort();
                values.sort();

                for (let i = 0; i < newListSize; i++) {
                    assert.strictEqual(values[i], bytes16Values[i]);
                }
            });

            it("should remove the last key and decrease the key size", async () => {
                await truffleAssert.passes(iterableEternalStorage.removeBytes16Key(listId, values[listSize - 1]));
                // remove last item of array
                values.pop();

                let newListSize = await iterableEternalStorage.getBytes16KeySize(listId);
                assert.isTrue(newListSize.eq(web3.utils.toBN(listSize - 1)), 'Length of list is not correct');

                const bytes16Values = await iterableEternalStorage.getBytes16Keys(listId);

                for (let i = 0; i < newListSize; i++) {
                    assert.strictEqual(web3.utils.bytesToHex(values[i]), bytes16Values[i]);
                }
            });
        });

        describe('existsBytes16Key', async () => {
            it("should return true for an existing key", async () => {
                const keyExists = await iterableEternalStorage.existsBytes16Key(listId, values[0]);
                assert.isTrue(keyExists);
            });

            it("should false for a non-existing key", async () => {
                const keyExists = await iterableEternalStorage.existsBytes16Key(listId, valueNotInList);
                assert.isFalse(keyExists);
            });
        });
    });

    describe('Bytes32', () => {
        beforeEach(async () => {
            for (let i = 0; i < listSize; i++) {
                let value;

                while (true) {
                    value = web3.utils.hexToBytes(web3.utils.randomHex(32));

                    if (!values.includes(value)) {
                        break;
                    }
                }

                await iterableEternalStorage.addBytes32Key(listId, value);
                values.push(value);
            }

            while (true) {
                valueNotInList = web3.utils.hexToBytes(web3.utils.randomHex(32));

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
                assert.strictEqual(web3.utils.bytesToHex(values[0]), bytes32Value, 'Incorrect value was saved');

                let actualListSize = await iterableEternalStorage.getBytes32KeySize(listId);
                assert.isTrue(actualListSize.eq(web3.utils.toBN(listSize)), 'Length of list is not correct');
            });
        });

        describe('getBytes32Keys', async () => {
            it("should return all items added by addBytes32Key", async () => {
                const bytes32Values = await iterableEternalStorage.getBytes32Keys(listId);

                assert.strictEqual(listSize, bytes32Values.length, `Expected size of returned array to be ${listSize}, but is ${bytes32Values.length}`);

                for (let i = 0; i < listSize; i++) {
                    assert.strictEqual(web3.utils.bytesToHex(values[i]), bytes32Values[i]);
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
                    assert.strictEqual(web3.utils.bytesToHex(values[i + offset]), bytes32Values[i]);
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
                values.splice(randomIndex, 1);

                let newListSize = await iterableEternalStorage.getBytes32KeySize(listId);
                assert.isTrue(newListSize.eq(web3.utils.toBN(listSize - 1)), 'Length of list is not correct');

                const bytes32Values = await iterableEternalStorage.getBytes32Keys(listId);

                for (let i = 0; i < bytes32Values.length; i++) {
                    values[i] = web3.utils.bytesToHex(values[i]);
                }

                // sort, because the values can be in a different order
                bytes32Values.sort();
                values.sort();

                for (let i = 0; i < newListSize; i++) {
                    assert.strictEqual(values[i], bytes32Values[i]);
                }
            });

            it("should remove the last key and decrease the key size", async () => {
                await truffleAssert.passes(iterableEternalStorage.removeBytes32Key(listId, values[listSize - 1]));
                // remove last item of array
                values.pop();

                let newListSize = await iterableEternalStorage.getBytes32KeySize(listId);
                assert.isTrue(newListSize.eq(web3.utils.toBN(listSize - 1)), 'Length of list is not correct');

                const bytes32Values = await iterableEternalStorage.getBytes32Keys(listId);

                for (let i = 0; i < newListSize; i++) {
                    assert.strictEqual(web3.utils.bytesToHex(values[i]), bytes32Values[i]);
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
});
