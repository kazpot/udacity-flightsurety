# FlightSurety

FlightSurety is a sample dApp runnning over Ethereum blockchain.

## Version
`Truffle v5.0.2 (core: 5.0.2)`
`Solidity - ^0.4.24 (solc-js)`

## Descriptions
* Requirement 1: Separation of concerns
  - FlightSuretyData contract for data persistence
  - FlightSuretyApp contract for app logic and oracles code
  - Dapp client for triggering contract calls
  - Server app for simulating oracles

* Requirement 2: Airlines
  - Register flight airline when contract is deployed
  - Only existing airline may register a new airline until there are at least four airlines registered
  - Registration of fifth and subsequent airlines requires multi-party consensus of 50% of registered airlines
  - Airline can be registered, but does not participate in contract until it submits funding of 10 ether

* Requirement 3: Passengers
  - Passengers may pay upto 1 ether for purchasing flight insurance
  - Flight numbers and timestamps are fixed for the purpose of the project and can be defined in the Dapp client
  - If the flight is delayed due to airline fault, passenger receives credit of 1.5x the amount they paid
  - Funds are transfered from contract to the passenger wallet only when they initiate a withdrawal

* Requirement 4: Oracles
  - Oracles are implemented as a server app
  - Upon startup, 20+ oracles are registered and their assigned indexes are persisted in memory
  - client dapp is used to trigger request to update flight status generating OracleRequest event that is captured by server
  - Server will loop through all registered oracles, identify those oracles for which the request applies, and respond by calling into app logic contract with the appropriate status code

* Requirement 5: General
  - Contracts must have operational status control
  - Funcstions must fail fast - user require() at the start of function

## Install

`npm install`
`truffle compile`

## ganache-cli with 20 accounts
`ganache-cli -m "candy maple cake sugar pudding cream honeyich smooth crumble sweet treat" -a 20`

## Develop Client

To run truffle tests:

`truffle test ./test/flightSurety.js`
`truffle test ./test/oracles.js`

To use the dapp:

`truffle migrate`
`npm run dapp`

To view dapp:

`http://localhost:8000`

## Develop Server

`npm run server`
`truffle test ./test/oracles.js`

## Deploy

To build dapp for prod:
`npm run dapp:prod`

Deploy the contents of the ./dapp folder


## Resources

* [How does Ethereum work anyway?](https://medium.com/@preethikasireddy/how-does-ethereum-work-anyway-22d1df506369)
* [BIP39 Mnemonic Generator](https://iancoleman.io/bip39/)
* [Truffle Framework](http://truffleframework.com/)
* [Ganache Local Blockchain](http://truffleframework.com/ganache/)
* [Remix Solidity IDE](https://remix.ethereum.org/)
* [Solidity Language Reference](http://solidity.readthedocs.io/en/v0.4.24/)
* [Ethereum Blockchain Explorer](https://etherscan.io/)
* [Web3Js Reference](https://github.com/ethereum/wiki/wiki/JavaScript-API)
