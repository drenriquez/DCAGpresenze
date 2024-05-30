const express = require('express');
const router = express.Router();
const { userAuth } = require('../middleware/userAuth');
const userModel = require('../model/userModel');
/* GET users listing. */
router.get('/getUsersTable', userAuth, async function(req, res, next) {
  
  const usersInOrder=await userModel.getAllUsersInOrdineCognome()
 
  res.json(usersInOrder);
});

module.exports = router;
