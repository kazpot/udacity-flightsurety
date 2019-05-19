
var Test = require('../config/testConfig.js');
//var BigNumber = require('bignumber.js');

contract('Oracles', async (accounts) => {

    const TEST_ORACLES_COUNT = 5;

    const STATUS_CODE_UNKNOWN = 0;
    const STATUS_CODE_ON_TIME = 10;
    const STATUS_CODE_LATE_AIRLINE = 20;
    const STATUS_CODE_LATE_WEATHER = 30;
    const STATUS_CODE_LATE_TECHNICAL = 40;
    const STATUS_CODE_LATE_OTHER = 50;
    
    var config;
    
    before('setup contract', async () => {
        config = await Test.Config(accounts);
    });

    it('can register oracles', async () => {
       let fee = await config.flightSuretyApp.REGISTRATION_FEE.call();
       for(let i=1; i < TEST_ORACLES_COUNT; i++) {      
           await config.flightSuretyApp.registerOracle({ from: accounts[i], value: fee });
           let result = await config.flightSuretyApp.getMyIndexes.call({from: accounts[i]});
           console.log(`Oracle Registered: ${result[0]}, ${result[1]}, ${result[2]}`);
       }
    });

    it('can request flight status', async () => {
        let flight = 'ND1309';
        let timestamp = Math.floor(Date.now() / 1000);

        for(let i=1; i < TEST_ORACLES_COUNT; i++) {
            await config.flightSuretyApp.fetchFlightStatus(accounts[i], flight, timestamp);

            var event = config.flightSuretyApp.OracleRequest();
            var random;
            await event.watch((err, res) => {
                console.log("===OracleRequest===");
                console.log(res.args);
            })

            let oracleIndexes = await config.flightSuretyApp.getMyIndexes.call({from: accounts[i]});
            
            for(let j=0; j < 3; j++) {
                try {
                    await config.flightSuretyApp.submitOracleResponse(oracleIndexes[j], config.firstAirline, flight, timestamp, STATUS_CODE_ON_TIME, {from: accounts[i]});
                    
                    var event = config.flightSuretyApp.OracleReport();
                    await event.watch((err, res) => {
                        console.log("===OracleReport===");
                        console.log(res.args);
                    })

                    var event = config.flightSuretyApp.FlightStatusInfo();
                    await event.watch((err, res) => {
                        console.log("===FlightStatusInfo===");
                        console.log(res.args);
                    })
                }
                catch(e) {
                    console.log(e.message);
                    console.log('\nError', j, oracleIndexes[j].toNumber(), flight, timestamp);
                }
            }
        }
    });
});
