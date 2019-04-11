const IterableEternalStorage = artifacts.require("IterableEternalStorage");

module.exports = function (deployer) {
    deployer.deploy(IterableEternalStorage);
};
