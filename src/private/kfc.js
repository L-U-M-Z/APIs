const { fetch } = require('../utils.js');


/////////////////////////////////////////
//  KFC
/////////////////////////////////////////


module.exports = class KFC {

    static getStoreList() {
        return fetch(`https://api.kfc.fr/stores/allStores`)
            .then(res => res.json());
    }

    static getStoreSummary(id) {
        return fetch(`https://api.kfc.fr/stores/${id}/pickup/summary`)
            .then(res => res.json());
    }

    static getMenu() {
        return fetch(`https://api.kfc.fr/menu/kfcfr-generic-menu`)
            .then(res => res.json());
    }

};
