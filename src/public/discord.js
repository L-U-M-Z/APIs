const { fetch, querystring } = require('../utils.js');


/////////////////////////////////////////
//  DISCORD
/////////////////////////////////////////


module.exports = class Discord {

    constructor(options) {
        Object.assign(this, options);

        // Set authorize URL.
        this.authorize_url = `https://discord.com/api/oauth2/authorize?` + querystring({
            client_id       : options.client_id,
            redirect_uri    : options.redirect_uri,
            scope           : options.scope,
            response_type   : options.response_type
        });
    }


    /////////////////////////////////////
    //  AUTHORIZE
    /////////////////////////////////////


    authorizeDiscord(code) {
        return fetch(`POST`, `https://discord.com/api/oauth2/token`, {
            form: {
                client_id       : this.client_id,
                client_secret   : this.client_secret,
                redirect_uri    : this.redirect_uri,
                scope           : this.scope,
                grant_type      : 'authorization_code',
                code
            }
        })
            .then(res => res.json());
    }


    /////////////////////////////////////
    //  USER
    /////////////////////////////////////


    static getUser(token) {
        return fetch(`GET`, `https://discord.com/api/v9/users/@me`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => res.json())
    }

    static getConnections(token) {
        return fetch(`GET`, `https://discord.com/api/v9/users/@me/connections`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => res.json());
    }

    static getGuilds(token) {
        return fetch(`GET`, `https://discord.com/api/v9/users/@me/guilds`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => res.json());
    }

};
