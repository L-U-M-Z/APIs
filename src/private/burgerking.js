const { fetch } = require("../utils.js");


/////////////////////////////////////////
//  BURGER KING
/////////////////////////////////////////


module.exports = class BurgerKing {

    static getStoreList() {
        return fetch(`https://webapi.burgerking.fr/blossom/api/v11/public/store-locator`)
            .then(res => res.json());
    }

    static getStoreInfo(code) {
        return fetch(`https://webapi.burgerking.fr/blossom/api/v11/public/restaurant/${code}`)
            .then(res => res.json());
    }

    static getStoreDetails(label) {
        return fetch(`https://webapi.burgerking.fr/blossom/api/v11/public/restaurant/${label}/page`)
            .then(res => res.json());
    }
};
