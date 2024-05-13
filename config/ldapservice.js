// ldapService.js

const ldap = require('ldapjs');

const ldap_server = 'ldap://vfdipdc5.dipvvf.it';
const username = "";
const password = '';

const client = ldap.createClient({
  url: ldap_server,
  tlsOptions: {
    rejectUnauthorized: false, // Disabilita la verifica del certificato (solo per sviluppo)
  },
});

client.bind(username, password, (err) => {
  if (err) {
    console.error('LDAP bind error:', err);
    // Gestisci l'errore di bind LDAP qui
  } else {
    console.log('LDAP bind successful');
    // Puoi eseguire altre operazioni LDAP qui

    // Chiudi la connessione LDAP quando hai finito
    client.unbind((unbindErr) => {
      if (unbindErr) {
        console.error('LDAP unbind error:', unbindErr);
      } else {
        console.log('LDAP connection closed');
      }
    });
  }
});
