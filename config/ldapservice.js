// ldapService.js
require('dotenv').config({path:'../.env'});
const ldap = require('ldapjs');

async function ldapServerAuth(username, password) {
  return new Promise((resolve, reject) => {
    const ldap_server = process.env.LDAP_SERVER;
    console.log("+++++++++++++++++ serverldap ", ldap_server);
    console.log("+++++++++++++++++ username ", username);
    console.log("+++++++++++++++++ password ", password);

    const client = ldap.createClient({
      url: ldap_server,
      tlsOptions: {
        rejectUnauthorized: false, // Disabilita la verifica del certificato (solo per sviluppo)
      },
    });

    username = username + "@dipvvf.it";
    console.log("---------------------- username ", username);

    client.bind(username, password, (err) => {
      if (err) {
        console.error('LDAP bind error:', err);
        reject(err); // Reject se c'è un errore
      } else {
        console.log('LDAP bind successful');
        // Puoi eseguire altre operazioni LDAP qui
        // Chiudi la connessione LDAP quando hai finito
        client.unbind((unbindErr) => {
          if (unbindErr) {
            console.error('LDAP unbind error:', unbindErr);
            reject(unbindErr); // Reject se c'è un errore durante l'unbind
          } else {
            console.log('LDAP connection closed');
            client.on('close',(clos)=>{console.log('xxxxxxxx LDAP connection closed',clos);});
          
            resolve(true); // Risolve con true se l'autenticazione è riuscita
          }
        });
      }
    });
  });
}

module.exports = ldapServerAuth;