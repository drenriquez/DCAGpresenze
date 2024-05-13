const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/users', function(req, res, next) {
  console.log(req.session.id);
  res.send(req.session.id);
});

module.exports = router;
