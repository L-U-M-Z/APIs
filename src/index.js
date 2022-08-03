const utils = require("./utils.js");


//////////////////////////////////////////////
//  MODULES
//////////////////////////////////////////////


//  PRIVATE

exports.BurgerKing      = require("./private/burgerking.js");
exports.KFC             = require("./private/kfc.js");
exports.McDonald        = require("./private/mcdonald.js");
exports.OuiSNCF         = require("./private/ouisncf.js");
exports.RootMe          = require("./private/rootme.js");

//  PUBLIC

exports.Discord         = require("./public/discord.js");

//  UTILS

exports.sleep           = utils.sleep;
exports.querystring     = utils.querystring;
exports.fetch           = utils.fetch;
exports.randomString    = utils.randomString;
exports.atob            = utils.atob;
exports.btoa            = utils.btoa;
