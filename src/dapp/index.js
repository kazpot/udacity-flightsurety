
import DOM from './dom';
import Contract from './contract';
import './flightsurety.css';


(async() => {

    let result = null;

    let contract = new Contract('localhost', () => {

        contract.isOperational((error, result) => {
            console.log(error,result);
            display('Operational Status', 'Check if contract is operational', [ { label: 'Operational Status', error: error, value: result} ]);
        });

        DOM.elid('register-airline').addEventListener('click', () => {
            let airlineAddress = DOM.elid('airline-address').value;
            contract.registerAirline(airlineAddress, (error, result) => {
                display('Airline', 'Register Airline', [ { label: 'Register Airline', error: error, value: 'success'} ]);
                console.log(result);
            });
        });

        DOM.elid('register-check').addEventListener('click', () => {
            let airlineAddress = DOM.elid('check-address').value;
            contract.checkRegistration(airlineAddress, (error, result) => {
                display('Airline Registration', 'Check if airline is registered', [ { label: 'Registration Status', error: error, value: result} ]);
            });
        });

        DOM.elid('submit-fund').addEventListener('click', () => {
            contract.submitFund((error, result) => {
                display('Airline', 'Submit Fund', [ { label: 'Submit Fund', error: error, value: 'success'} ]);
            });
        });

        DOM.elid('register-flight').addEventListener('click', () => {
            let flight = DOM.elid('flight').value;
            contract.registerFlight(flight, (error, result) => {
                console.log(error);
                console.log(result);
                display('Airline', 'Register Flight', [ { label: 'Register Flight', error: error, value: 'success'} ]);
            });
        });

        DOM.elid('buy-flight').addEventListener('click', () => {
            let flight = DOM.elid('flight-ticket').value;
            contract.buyTicket(flight, (error, result) => {
                console.log(error);
                console.log(result);
                display('Airline', 'Buy Ticket', [ { label: 'Buy Ticket', error: error, value: 'success'} ]);
            });
        });
    
        DOM.elid('submit-oracle').addEventListener('click', () => {
            let flight = DOM.elid('flight-number').value;
            contract.fetchFlightStatus(flight, (error, result) => {
                display('Oracles', 'Trigger oracles', [ { label: 'Fetch Flight Status', error: error, value: result.flight + ' ' + result.timestamp} ]);
            });
        });

        DOM.elid('claim').addEventListener('click', () => {
            contract.withdraw((error, result) => {
                display('Oracles', 'Withdraw request', [ { label: 'Withdraw request', error: error, value: 'success'} ]);
            });
        });
    });
})();


function display(title, description, results) {
    let displayDiv = DOM.elid("display-wrapper");
    let section = DOM.section();
    section.appendChild(DOM.h2(title));
    section.appendChild(DOM.h5(description));
    results.map((result) => {
        let row = section.appendChild(DOM.div({className:'row'}));
        row.appendChild(DOM.div({className: 'col-sm-4 field'}, result.label));
        row.appendChild(DOM.div({className: 'col-sm-8 field-value'}, result.error ? String(result.error) : String(result.value)));
        section.appendChild(row);
    })
    displayDiv.append(section);
}







