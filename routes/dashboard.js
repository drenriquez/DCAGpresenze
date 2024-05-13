

const express = require('express');
const router = express.Router();
const { userAuth } = require('../middleware/userAuth');

/* GET home page. */
router.get('/dashboard', userAuth, function(req, res, next) {
  // Calcola o recupera i dati necessari dal backend
  const daysInMonth = 31; // Numero di giorni nel mese di maggio 2024
  const isNonWorkingDay = (date) => {
    // Ottieni il giorno della settimana (0 = Domenica, 1 = Lunedì, ..., 6 = Sabato)
    const dayOfWeek = date.getDay();
    // Ritorna true se il giorno della settimana è Sabato (6) o Domenica (0), altrimenti false
    return dayOfWeek === 0 || dayOfWeek === 6;
  };
  const rows = [
    { name: 'PRIMARIGA' },
    { name: 'SECONDARIGA' },
    { name: 'TERZARIGA' },
    { name: 'quartaRIGA' }
  ]; // Righe con intestazioni
  
  // Passa i dati al template EJS
  res.render('dashboard', { daysInMonth, isNonWorkingDay, rows });
});

module.exports = router;