// authController.js

function login(req, res, next) {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'password') {
      // Imposta la variabile di sessione per indicare che l'utente è autenticato
      req.session.isAuthenticated = true;
      
      // Reindirizza alla homepage
      res.redirect('/home');
    } else {
      // Credenziali errate, reindirizza alla pagina di login con un messaggio di errore
      res.redirect('/');
    }
  }
  
  module.exports = {
    login
  };
  
  