const { fetch } = require('../utils.js');


/////////////////////////////////////////
//  ROOT ME
/////////////////////////////////////////


module.exports = class RootMe {

    constructor(spip) {
        this.SPIP = spip;
    }

    async sendRootMeContactMessage(options) {
        let [ action_args, jeton ] = await fetch(`GET`, `https://www.root-me.org/?page=messagerie&inc=write&lang=fr`, {
            headers: {
                "cookie": `spip_session=${this.SPIP}`,
            }
        })
            .then(res => res.text())
            .then(res => /formulaire_action_args.+?value='(.+?)'.+?_jeton.+?value='(.+?)'/s.exec(res))
            .then(res => [res[1], res[2]]);

        return fetch(`POST`, `https://www.root-me.org/?page=messagerie&inc=write&lang=fr`, {
            headers: {
                "cookie": `spip_session=${this.SPIP}`,
            },
            form: {
                "var_ajax"              : "form",
                "page"                  : "messagerie",
                "inc"                   : "write",
                "lang"                  : "fr",
                "formulaire_action"     : "ecrire_message",
                "formulaire_action_args": action_args,
                "_jeton"                : jeton,
                "destinataires[]"       : options.to,
                "destinataire"          : "",
                "objet"                 : options.subject,
                "texte_message"         : options.message,
                "valider"               : "Envoyer",
                "email_nobot"           : "",
            }
        });
    }

    fetchAuthor(id) {
        return fetch(`GET`, `https://api.www.root-me.org/auteurs/${id}`, {
            headers: {
                "cookie": `spip_session=${this.SPIP}`,
            }
        })
            .then(res => res.json());
    }

};
