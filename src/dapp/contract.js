import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import Config from './config.json';
import Web3 from 'web3';

export default class Contract {
    constructor(network, callback) {

        let config = Config[network];
        this.web3 = new Web3(new Web3.providers.HttpProvider(config.url));
        this.flightSuretyApp = new this.web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);
        this.initialize(callback);
        this.owner = null;
        this.firstAirline = null;
        this.airlines = [];
        this.passengers = [];
    }

    initialize(callback) {
        this.web3.eth.getAccounts((error, accts) => {
           
            this.owner = accts[0];
            this.firstAirline = accts[1];

            let counter = 1;
            
            while(this.airlines.length < 5) {
                this.airlines.push(accts[counter++]);
            }

            while(this.passengers.length < 5) {
                this.passengers.push(accts[counter++]);
            }

            this.flightSuretyApp.methods.registerAirline(this.firstAirline).send({from: self.firstAirline}, (error, result) => {});

            callback();
        });
    }

    isOperational(callback) {
       let self = this;
       self.flightSuretyApp.methods
            .isOperational()
            .call({from: self.owner}, callback);
    }

    registerAirline(address, callback) {
        let self = this;
        self.flightSuretyApp.methods
            .airlineRegistered(address)
            .send({from: self.firstAirline}, (error, result) => {
                callback(error, result);
            });
    }

    checkRegistration(address, callback) {
        let self = this;
        self.flightSuretyApp.methods
            .airlineRegistered(address)
            .call({from: self.owner}, callback);
    }

    submitFund(callback) {
        let self = this;
        let fee = this.web3.utils.toWei('10', 'ether');
        self.flightSuretyApp.methods
            .fund()
            .send({from: self.firstAirline, value: fee}, (error, result) => {
                callback(error, result);
            });
    }

    registerFlight(flight, callback) {
        let price = web3.toWei('0.5', 'ether');
        let timestamp = 1558232053;

        let self = this;
        self.flightSuretyApp.methods
            .registerFlight(flight, price, timestamp)
            .send({from: self.owner}, (error, result) => {
                callback(error, result);
            });
    }

    buyTicket(flight, callback) {
        let timestamp = 1558232053;
        
        // 0.5 for ticket pice and 0.1 for insurance
        let price = web3.toWei('0.6', 'ether');

        let self = this;
        self.flightSuretyApp.methods
            .buy(self.firstAirline, flight, timestamp, price)
            .send({from: self.owner}, (error, result) => {
                callback(error, result);
            });
    }

    withdraw(callback) {
        let self = this;
        self.flightSuretyApp.methods
            .withdraw()
            .send({from: self.owner}, (error, result) => {
                callback(error, result);
            });
    }

    fetchFlightStatus(flight, callback) {
        let self = this;
        let payload = {
            airline: self.airlines[0],
            flight: flight,
            timestamp: 1558232053
        } 
        self.flightSuretyApp.methods
            .fetchFlightStatus(payload.airline, payload.flight, payload.timestamp)
            .send({from: self.owner}, (error, result) => {
                callback(error, payload);
            });
    }
}