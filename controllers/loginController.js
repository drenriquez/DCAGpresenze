// loginController.js
const ldapServerAuth = require('../config/ldapservice');
const servizioWAUC = require('../config/waucService');
const userModel = require('../model/userModel');

async function login(req, res, next) {
  const { username, password } = req.body;

  try {
    const authenticated = await ldapServerAuth(username, password);
    console.log('+++++++++++authenticated++++ : ', authenticated);

    if (authenticated) {
      // Imposta la variabile di sessione per indicare che l'utente è autenticato
      req.session.isAuthenticated = true;
      req.session.user = username;
      //chiamata ala servizio WAUC per recuperare i dati dell'user
      let dataWauc;
      try {
          dataWauc = await servizioWAUC(username);
          //console.log("TTTTTTTTTTTTTTTTTTTTTt dentro loginController, username:", dataWauc);
          req.session.name=dataWauc[0].nome;
          req.session.cognome=dataWauc[0].cognome;
          req.session.codiceFiscale=dataWauc[0].codiceFiscale;
          req.session.livelloUser = await userModel.getLivelloUserByCodiceFiscale(req.session.codiceFiscale);
          console.log("TTTTTTTTTTTTTTTTTTTTTt dentro loginController, livello:", req.session.livelloUser);
      } catch (error) {
          console.error('Errore durante il recupero dei dati WAUC:', error);
      }

      // Reindirizza alla homepage
      res.redirect('/home');
    } else {
      // Credenziali errate, reindirizza alla pagina di login con un messaggio di errore
      res.redirect('/');
    }
  } catch (error) {
    // Gestisci errori di autenticazione
    console.error('Authentication error:', error);
    res.redirect('/');
  }
}

module.exports = {
  login
};
  