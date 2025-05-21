require('dotenv').config({path:'../.env'});
const express = require('express');
const router = express.Router();
const { userAuth } = require('../middleware/userAuth');

/* GET home page. */
router.get('/tabellaDipendente',userAuth, function(req, res, next) {
  const codiceFiscale = req.query.codiceFiscale;
  const apiUserURL=process.env.HOST_SERVER_API
  res.render('tabellaDipendente', { 
    // userCodFisc: req.session.codiceFiscale,
    // livelloUser: req.session.livelloUser,
    apiUserURL: apiUserURL,
    codiceFiscale:codiceFiscale
   });
});

module.exports = router;