const truffleAssert = require('truffle-assertions');
const rn = require('random-number');
const randomString = require("randomstring");

const EternalStorage = artifacts.require("EternalStorage");

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

contract('EternalStorage', (accounts) => {
    let eternalStorage;
    let key;

    beforeEach(async() => {
        eternalStorage = await EternalStorage.new();
        eternalStorage.upgradeVersion(accounts[0]);
        key = web3.utils.sha3(Math.random().toString());
    });

    describe('upgradeVersion', async() => {
        it("should revert when not called by latest version", async() => {
            await truffleAssert.reverts(eternalStorage.upgradeVersion(accounts[1], {from: accounts[1]}));
        });

        it("should change latestVersion and emit a VersionUpgraded event", async() => {
            const tx = await eternalStorage.upgradeVersion(accounts[1]);

            const latestVersion = await eternalStorage.latestVersion();
            assert.strictEqual(latestVersion, accounts[1], 'upgradeVersion did not update latestVersion');

            truffleAssert.eventEmitted(tx, 'VersionUpgraded', (ev) => {
                return ev.newVersion === accounts[1];
            });
        });
    });

    it("setBool, getBool and deleteBool should work as expected", async() => {
        await truffleAssert.reverts(eternalStorage.setBool(key, true, {from: accounts[1]}));
        await truffleAssert.passes(eternalStorage.setBool(key, true));

        let boolValue = await eternalStorage.getBool(key);
        assert.strictEqual(true, boolValue);

        await eternalStorage.deleteBool(key);

        boolValue = await eternalStorage.getBool(key);
        assert.strictEqual(false, boolValue);
    });

    it("getUInt8, setUInt8 and deleteUInt8 should work as expected", async() => {
        const value = getRandomUInt();

        await truffleAssert.reverts(eternalStorage.setUInt8(key, value, {from: accounts[1]}));
        await truffleAssert.passes(eternalStorage.setUInt8(key, value));

        let uint8Value = await eternalStorage.getUInt8(key);
        assert.isTrue(uint8Value.eq(web3.utils.toBN(value)));

        await eternalStorage.deleteUInt8(key);

        uint8Value = await eternalStorage.getUInt8(key);
        assert.isTrue(uint8Value.eq(web3.utils.toBN(0)));
    });

    it("getUInt128, setUInt128 and deleteUInt128 should work as expected", async() => {
        const value = getRandomUInt();

        await truffleAssert.reverts(eternalStorage.setUInt128(key, value, {from: accounts[1]}));
        await truffleAssert.passes(eternalStorage.setUInt128(key, web3.utils.toBN(value.toString())));

        let uint128Value = await eternalStorage.getUInt128(key);
        assert.isTrue(uint128Value.eq(web3.utils.toBN(value.toString())));

        await eternalStorage.deleteUInt128(key);

        uint128Value = await eternalStorage.getUInt128(key);
        assert.isTrue(uint128Value.eq(web3.utils.toBN(0)));
    });

    it("getUInt256, setUInt256 and deleteUInt256 should work as expected", async() => {
        const value = getRandomUInt();

        await truffleAssert.reverts(eternalStorage.setUInt256(key, value, {from: accounts[1]}));
        await truffleAssert.passes(eternalStorage.setUInt256(key, web3.utils.toBN(value.toString())));

        let uint256Value = await eternalStorage.getUInt256(key);
        assert.isTrue(uint256Value.eq(web3.utils.toBN(value.toString())));

        await eternalStorage.deleteUInt256(key);

        uint256Value = await eternalStorage.getUInt256(key);
        assert.isTrue(uint256Value.eq(web3.utils.toBN(0)));
    });

    it("getInt8, setInt8 and deleteInt8 should work as expected", async() => {
        const value = getRandomInt();

        await truffleAssert.reverts(eternalStorage.setInt8(key, value, {from: accounts[1]}));
        await truffleAssert.passes(eternalStorage.setInt8(key, value));

        let int8Value = await eternalStorage.getInt8(key);
        assert.isTrue(int8Value.eq(web3.utils.toBN(value)));

        await eternalStorage.deleteInt8(key);

        int8Value = await eternalStorage.getInt8(key);
        assert.isTrue(int8Value.eq(web3.utils.toBN(0)));
    });

    it("getInt128, setInt128 and deleteInt128 should work as expected", async() => {
        const value = getRandomInt();

        await truffleAssert.reverts(eternalStorage.setInt128(key, value, {from: accounts[1]}));
        await truffleAssert.passes(eternalStorage.setInt128(key, web3.utils.toBN(value.toString())));

        let int128Value = await eternalStorage.getInt128(key);
        assert.isTrue(int128Value.eq(web3.utils.toBN(value.toString())));

        await eternalStorage.deleteInt128(key);

        int128Value = await eternalStorage.getInt128(key);
        assert.isTrue(int128Value.eq(web3.utils.toBN(0)));
    });

    it("getInt256, setInt256 and deleteInt256 should work as expected", async() => {
        const value = getRandomInt();

        await truffleAssert.reverts(eternalStorage.setInt256(key, value, {from: accounts[1]}));
        await truffleAssert.passes(eternalStorage.setInt256(key, web3.utils.toBN(value.toString())));

        let int256Value = await eternalStorage.getInt256(key);
        assert.isTrue(int256Value.eq(web3.utils.toBN(value.toString())));

        await eternalStorage.deleteInt256(key);

        int256Value = await eternalStorage.getInt256(key);
        assert.isTrue(int256Value.eq(web3.utils.toBN(0)));
    });

    it("getAddress, setAddress and deleteAddress should work as expected", async() => {
        const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
        const value = web3.utils.randomHex(20);

        await truffleAssert.reverts(eternalStorage.setAddress(key, value, {from: accounts[1]}));
        await truffleAssert.passes(eternalStorage.setAddress(key, value));

        let addressValue = await eternalStorage.getAddress(key);
        assert.strictEqual(addressValue.toLowerCase(), value);

        await eternalStorage.deleteAddress(key);

        addressValue = await eternalStorage.getAddress(key);
        assert.strictEqual(addressValue, ZERO_ADDRESS);
    });

    it("getBytes8, setBytes8 and deleteBytes8 should work as expected", async() => {
        const text = randomString.generate(8);
        const value = web3.utils.fromAscii(text);

        await truffleAssert.reverts(eternalStorage.setBytes8(key, value, {from: accounts[1]}));
        await truffleAssert.passes(eternalStorage.setBytes8(key, value));

        let bytes8Value = await eternalStorage.getBytes8(key);
        assert.strictEqual(web3.utils.toAscii(bytes8Value), text);

        await eternalStorage.deleteBytes8(key);

        bytes8Value = await eternalStorage.getBytes8(key);
        assert.strictEqual(bytes8Value, '0x0000000000000000');
    });

    it("getBytes16, setBytes16 and deleteBytes16 should work as expected", async() => {
        const text = randomString.generate(16);
        const value = web3.utils.fromAscii(text);

        await truffleAssert.reverts(eternalStorage.setBytes16(key, value, {from: accounts[1]}));
        await truffleAssert.passes(eternalStorage.setBytes16(key, value));

        let bytes16Value = await eternalStorage.getBytes16(key);
        assert.strictEqual(web3.utils.toAscii(bytes16Value), text);

        await eternalStorage.deleteBytes16(key);

        bytes16Value = await eternalStorage.getBytes16(key);
        assert.strictEqual(bytes16Value, '0x00000000000000000000000000000000');
    });

    it("getBytes32, setBytes32 and deleteBytes32 should work as expected", async() => {
        const text = randomString.generate(32);
        const value = web3.utils.fromAscii(text);

        await truffleAssert.reverts(eternalStorage.setBytes32(key, value, {from: accounts[1]}));
        await truffleAssert.passes(eternalStorage.setBytes32(key, value));

        let bytes32Value = await eternalStorage.getBytes32(key);
        assert.strictEqual(web3.utils.toAscii(bytes32Value), text);

        await eternalStorage.deleteBytes32(key);

        bytes32Value = await eternalStorage.getBytes32(key);
        assert.strictEqual(bytes32Value, '0x0000000000000000000000000000000000000000000000000000000000000000');
    });

    it("getString, setString and deleteString should work as expected", async() => {
        const value = randomString.generate();

        await truffleAssert.reverts(eternalStorage.setString(key, value, {from: accounts[1]}));
        await truffleAssert.passes(eternalStorage.setString(key, value));

        let stringValue = await eternalStorage.getString(key);
        assert.strictEqual(stringValue, value);

        await eternalStorage.deleteString(key);

        stringValue = await eternalStorage.getString(key);
        assert.strictEqual(stringValue, '');
    });

    it("getBytes, setBytes and deleteBytes should work as expected", async() => {
        const hexValue = web3.utils.toHex(
            randomString.generate()
        );
        const value = web3.utils.hexToBytes(hexValue);

        await truffleAssert.reverts(eternalStorage.setBytes(key, value, {from: accounts[1]}));
        await truffleAssert.passes(eternalStorage.setBytes(key, value));

        let bytesValue = await eternalStorage.getBytes(key);
        assert.strictEqual(bytesValue, hexValue);

        await eternalStorage.deleteBytes(key);

        stringValue = await eternalStorage.getString(key);
        assert.strictEqual(stringValue, '');
    });
});
