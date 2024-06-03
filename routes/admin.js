const express = require('express');
const router = express.Router();
const { userAuth } = require('../middleware/userAuth');

/* GET home page. */
router.get('/admin',userAuth, function(req, res, next) {
  res.render('admin', { 
    title: 'DCAGpresenze',
    userCodFisc: req.session.codiceFiscale,
    livelloUser: req.session.livelloUser,
   });
});

module.exports = router;
