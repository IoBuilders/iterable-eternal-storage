module.exports = {
    networks: {
        development: {
            host: "localhost",
            port: 7545,
            network_id: "*",
            gas: 8000000,
        },
        coverage: {
            host: "localhost",
            network_id: "*",
            port: 8555,
            gas: 0xfffffffffff,
            gasPrice: 0x01
        }
    },
    compilers: {
        solc: {
            version: '0.7.5',
            docker: true,
            settings: {
                optimizer: {
                    enabled: true,
                    runs: 1
                }
            }
        }
    },
    plugins: [
        "truffle-contract-size",
        "solidity-coverage",
    ]
};
