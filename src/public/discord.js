const { fetch, querystring } = require("../utils.js");


/////////////////////////////////////////
//  DISCORD
/////////////////////////////////////////


module.exports = class Discord {

    constructor(options) {
        this.client_id      = options.client_id;
        this.client_secret  = options.client_secret;
        this.redirect_uri   = options.redirect_uri;
        this.scope          = options.scope;
        this.response_type  = options.response_type;

        // Set authorize URL.
        this.authorize_url = `https://discord.com/api/oauth2/authorize?` + querystring({
            client_id       : options.client_id,
            redirect_uri    : options.redirect_uri,
            scope           : options.scope,
            response_type   : options.response_type
        });
    }

    get __appAuthorization() {
        const token = btoa(`${this.client_id}:${this.client_secret}`);

        return `Basic ${token}`;
    }


    /////////////////////////////////////
    //  AUTHORIZE
    /////////////////////////////////////


    authorize(code) {
        return fetch(`POST`, `https://discord.com/api/v10/oauth2/token`, {
            headers: {
                "Authorization" : this.__appAuthorization,
                "Content-Type"  : "application/x-www-form-urlencoded",
            },
            form: {
                grant_type      : "authorization_code",
                redirect_uri    : this.redirect_uri,
                code,
            },
        })
            .then(res => res.json());
    }

    refreshToken(token) {
        return fetch(`POST`, `https://discord.com/api/v10/oauth2/token`, {
            headers: {
                "Authorization" : this.__appAuthorization,
                "Content-Type"  : "application/x-www-form-urlencoded",
            },
            form: {
                grant_type      : "refresh_token",
                refresh_token   : token,
            },
        })
            .then(res => res.json());
    }


    /////////////////////////////////////
    //  USER
    /////////////////////////////////////


    static getUser(token) {
        return fetch(`GET`, `https://discord.com/api/v10/users/@me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(res => res.json())
    }

    static getConnections(token) {
        return fetch(`GET`, `https://discord.com/api/v10/users/@me/connections`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(res => res.json());
    }

    static getGuilds(token) {
        return fetch(`GET`, `https://discord.com/api/v10/users/@me/guilds`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(res => res.json());
    }

    static getUserProfile(token_user, user_id){
        return fetch(`GET`, `https://discord.com/api/v10/users/${user_id}/profile`, {
            headers: {
                Authorization: token_user,
            },
        })
            .then(res=>res.json())
    }

    static getSubscriptions(token_user, guild_id) {
        return fetch(`https://discord.com/api/v10/guilds/${guild_id}/premium/subscriptions`, {
            headers: {
                Authorization: token_user,
            },
        })
            .then(res => res.json());
    }
};
