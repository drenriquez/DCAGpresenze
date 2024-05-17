
// loginController.js
const ldapServerAuth = require('../config/ldapservice');

async function login(req, res, next) {
  const { username, password } = req.body;

  try {
    const authenticated = await ldapServerAuth(username, password);
    console.log('+++++++++++authenticated++++ : ', authenticated);

    if (authenticated) {
      // Imposta la variabile di sessione per indicare che l'utente è autenticato
      req.session.isAuthenticated = true;
      req.session.user = username;

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
  