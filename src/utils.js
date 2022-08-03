const http      = require("http");
const https     = require("https");
const crypto    = require("crypto");


//////////////////////////////////////
//  SLEEP
//////////////////////////////////////


exports.sleep = function (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};


//////////////////////////////////////
//  REQUEST
//////////////////////////////////////


//  UTILS

function querystring(query) {
    return Object.entries(query)
        .map(([k, v]) => (k + "=" + encodeURIComponent(v)))
        .join("&");
};

function fetch(method, url, extra = {}) {

    // Parse url to URL.
    if (url instanceof URL == false)
        url = new URL(url);

    return new Promise((resolve, reject) => {
        const options = {
            method,
            timeout: extra.timeout ?? 5000,
            headers: extra.headers ?? {}
        };

        if (extra.query)
            url.search = "?" + querystring(extra.query);

        if (extra.form) {
            options.headers["content-type"] = "application/x-www-form-urlencoded";
            extra.body                      = querystring(extra.form);

        } else if (extra.json) {
            options.headers["content-type"] = "application/json";
            extra.body                      = JSON.stringify(extra.json);
        }

        function send(url) {
            const module = (url.protocol == "https:")
                ? https
                : http;

            let req = module.request(url, options, res => {

                // Follow redirects.
                if (res.statusCode == 302 || res.statusCode == 301) {
                    res.destroy();
                    return send(new URL(res.headers.location, url));
                }

                // Return stream.
                if (extra.stream)
                    return resolve(res);

                //  BUFFER

                let body = Buffer.alloc(0);

                res.raw  = () => body;
                res.text = () => body.toString("utf8");
                res.json = () => JSON.parse(body.toString("utf8"));

                //  EVENTS

                res.on("data", chunk => {
                    body = Buffer.concat([body, chunk])
                });

                res.on("end", () => {
                    (res.statusCode >= 200) && (res.statusCode <= 299)
                        ? resolve(res)
                        : reject({
                            code    : res.statusCode,
                            error   : res.headers["content-type"] == "application/json"
                                ? res.json()
                                : res.text()
                        });
                });
            });

            req.on("error", ({ code, error }) => reject({ code, error }));
            req.end(extra.body);
        }

        // Send request.
        send(url);
    });
};

//  EXPORTS

exports.querystring = querystring;
exports.fetch       = fetch;


//////////////////////////////////////
//  CRYPTO
//////////////////////////////////////


exports.randomString = function (length, encoding = "base64") {
    return crypto.randomBytes(length).toString(encoding);
};


//////////////////////////////////////
//  BASE64
//////////////////////////////////////


exports.btoa = function (str) {
    return Buffer.from(str).toString("base64");
};

exports.atob = function (str) {
    return Buffer.from(str, "base64").toString("ascii");
};


//////////////////////////////////////
//  EXTENDS
//////////////////////////////////////


Map.prototype.map = function (callback) {
    let result  = Array(this.size);
    let i       = 0;

    // Call callback.
    for (let [k, v] of this)
        if (result[i] = callback(k, v))
            i++;

    // Set final length.
    result.length = i;

    return result;
};
