const { fetch } = require('../utils.js');


/////////////////////////////////////////
//  UTILS
/////////////////////////////////////////


function formatDate(date) {
    let year = date.getFullYear();
    let month = String(date.getMonth()).padStart(2, '0');
    let day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}


/////////////////////////////////////////
//  OUI SNCF
/////////////////////////////////////////


module.exports = class OuiSNCF {


    /////////////////////////////////////
    //  SELF
    /////////////////////////////////////


    authenticate(email, password) {
        return fetch(`https://www.oui.sncf/customer/api/clients/customer/authentication`, {
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email }),
            method: 'POST'
        })
            .then(res => res.json());
    }

    getMe() {
        return fetch(`https://www.oui.sncf/api/gtw/v2/clients/customers/me`)
            .then(res => res.json());
    }

    getCarts() {
        return fetch(`https://www.oui.sncf/cart/web/carts`)
            .then(res => res.json());
    }


    /////////////////////////////////////
    //  STATIC
    /////////////////////////////////////


    static getTrainInfos(numero, date) {
        return fetch(`https://www.sncf.com/api/iv/1.0/infoVoy/rechercherListeCirculations?numero=${numero}&dateCirculation=${date}&typeHoraire=TEMPS_REEL&codeZoneArretDepart&codeZoneArretArrivee&compositions=1&format=html`, {
            headers: {
                "Authorization": "Basic YWRtaW46JDJ5JDEwJFF2eFdTUzRmNURJRlNrQW11Qm9WOU9KRzNNMmJoZWM5ZDNGMi5ZblVMQk10cHpLQXEyS1Mu",
            }
        })
            .then(res => res.json())
            .then(res => res.reponseRechercherListeCirculations.reponse)
            .then(res => res.listeResultats.resultat[0].donnees)
            .then(res => res.listeCirculations.circulation[0]);
    }

    static searchTrainsCalendar(options) {
        return fetch(`https://www.oui.sncf/apim/calendar/v5/outward/${options.codeA}-${options.codeB}/${options.startDate}/${options.endDate}/12-NO_CARD?market=fr&vehicleTypes=TRAIN,%20BUS_TRAIN&travelClass=2&extendedToLocality=true&additionalFields=hours&currency=EUR&client=VSD`)
            .then(res => res.json());
    }

    static searchTrainsByDate(options) {
        return fetch("https://www.oui.sncf/api/vsd/travels/outward/train/best-price", {
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                context: {
                    paginationContext: {
                        selectedTime: `${options.selectedTime}:00`
                    }
                },
                wish: {
                    mainJourney: {
                        origin: {
                            code: options.codeA,
                        },
                        destination: {
                            code: options.codeB
                        }
                    },
                    directTravel: false,
                    schedule: {
                        outward: `${options.date}T06:00:00`,
                        outwardType: "DEPARTURE_FROM"
                    },
                    travelClass: "SECOND",
                    passengers: [
                        {
                            typology: "YOUNG",
                            age: 19,
                            discountCards: [
                                {
                                    code: "NONE",
                                    number: null,
                                    dateOfBirth: null
                                }
                            ],
                            fidelityCard: {
                                type: "NONE",
                                number: null
                            },
                            promoCode: null,
                            bicycle: null,
                            disabilityInformation: null,
                            disability: null
                        }
                    ],
                    salesMarket: "fr-FR",
                    pets: []
                }
            }),
            method: "POST"
        })
            .then(res => res.json())
            .then(res => res.travelProposals);
    }


    static searchStations(term) {
        return fetch(`https://www.oui.sncf/booking/autocomplete-d2d?uc=fr-FR&searchField=origin&searchTerm=${term}`)
            .then(res => res.json())
            .then(res => res.filter(item => {
                return item.category == 'station';
            }));
    }

    static searchBestOffer(options) {
        return searchTrainsCalendar({
            codeA: options.codeA,
            codeB: options.codeB,
            startDate: options.date,
            endDate: options.date
        })
            .then(([offer]) => {
                return searchTrainsByDate({
                    codeA: options.codeA,
                    codeB: options.codeB,
                    date: offer.date,
                    selectedTime: offer.hours[0]
                })
                    .then((offers, cheaper) => {
                        cheaper = offers.sort((a, b) => (a.minPrice - b.minPrice))[0];
                        offers = cheaper.secondClassOffers.offers;
                        cheaper = offers.sort((a, b) => (a.amount - b.amount))[0];

                        return cheaper;

                        // getTrainInfos(cheaper.offerSegments[0].vehicleNumber).then(train => {
                        //     console.log(train);
                        // });
                    });
            });
    }

};
