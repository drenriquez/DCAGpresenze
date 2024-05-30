
//const users=require("../personale.json");
const express = require('express');
const router = express.Router();
const { userAuth } = require('../middleware/userAuth');
const userModel = require('../model/userModel');
const axios = require('axios');
const base64 = require('base-64');



/* GET home page. */
router.get('/dashboard', userAuth,async function(req, res, next) {
  

  //const usersInOrder=await getAllUsersInOrdineCognome()
  const usersInOrder=await userModel.getAllUsersInOrdineCognome()
  console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAa",usersInOrder)
  
  // Passa i dati al template EJS
  res.render('dashboard', { usersTable: usersInOrder, userCodFisc: req.session.codiceFiscale, livelloUser: req.session.livelloUser });
});



/* const getAllUsersInOrdineCognome = async () => {
  try {
      const response = await axios.get(`https://172.16.17.11/api//users/ordinaCognome`, {
          httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false }),
          headers: {
            'Authorization': 'Basic ' + base64.encode(`admin:${process.env.API_KEY}`)
        }
      });
      return response.data;
  } catch (error) {
      console.error('Error fetching user level:', error);
      throw error;
  }
}; */


module.exports = router;