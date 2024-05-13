// ldapService.js
require('dotenv').config(); // Carica le variabili d'ambiente dal file .env

const ldap = require('ldapjs');
//console.log(process.env)
class LDAPService {
  constructor() {
    this.client = ldap.createClient({
      url: 'ldap://vfdipdc5.dipvvf.it',
      tlsOptions: {
        rejectUnauthorized: false, // Disabilita la verifica del certificato (solo per sviluppo)
      },
    });

    this.client.on('connect', () => {
      console.log('Connected to LDAP server');
      this.client.ldap.setOption(ldap.LDAP_OPT_PROTOCOL_VERSION, 3);
      this.client.ldap.setOption(ldap.LDAP_OPT_REFERRALS, 0);
    });

    this.client.on('error', (err) => {
      console.error('LDAP connection error:', err.message);
    });

    this.client.on('close', () => {
      console.log('LDAP connection closed');
    });
  }

  authenticate(username, password, callback) {
    //const bindDN = `uid=${username},ou=users,dc=example,dc=com`; // Adjust based on your LDAP structure

    this.client.bind(username, password, (err) => {
      if (err) {
        // Failed authentication
        console.error('LDAP bind error:', err);
        callback(err, false);
      } else {
        // Successful authentication
        console.log('LDAP bind successful');
        callback(null, true);
      }
    });
  }

  closeConnection() {
    this.client.unbind();
  }
}

module.exports = LDAPService;


const ldapService = new LDAPService();
ldapService.authenticate('enrico.notaro@dipvvf.it', 'password', (err, success) => {
    if (err || !success) {
      // Autenticazione fallita
     console.log('Autenticazione fallita.' );
    }

    // Autenticazione riuscita
    console.log('Autenticazione riuscita' );

    // Puoi eseguire ulteriori azioni dopo l'autenticazione qui

    // Chiudi la connessione LDAP quando hai finito
    ldapService.closeConnection();
  })

   