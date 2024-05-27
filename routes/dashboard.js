
const users=require("../personale.json");
const express = require('express');
const router = express.Router();
const { userAuth } = require('../middleware/userAuth');
const userModel = require('../model/userModel');

/* GET home page. */
router.get('/dashboard', userAuth,async function(req, res, next) {
  // Calcola o recupera i dati necessari dal backend
  //const daysInMonth = 3; // Numero di giorni nel mese di maggio 2024
  const isNonWorkingDay = (date) => {
    // Ottieni il giorno della settimana (0 = Domenica, 1 = Lunedì, ..., 6 = Sabato)
    const dayOfWeek = date.getDay();
    // Ritorna true se il giorno della settimana è Sabato (6) o Domenica (0), altrimenti false
    return dayOfWeek === 0 || dayOfWeek === 6;
  };
  const usersInOrder=await userModel.getAllUsersInOrdineCognome()
  console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAa",usersInOrder)
  
  // Passa i dati al template EJS
  res.render('dashboard', { usersTable: usersInOrder, userCodFisc: req.session.codiceFiscale, livelloUser: req.session.livelloUser });
});

module.exports = router;