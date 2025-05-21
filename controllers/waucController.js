const express = require('express');

const { ricercaPerUsername, ricercaPerCognome, ricercaAnagrafica } = require('../config/waucService');

class WaucController {
    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
        
    }

    initializeRoutes() {
        this.router.get('/waucCercaPerCognome/:cognome', this.cercaPerCognome);
        this.router.get('/waucCercaPerUseername/:userename', this.cercaPerUsername);
        this.router.get('/waucCercaPerCodiceFiscale/:codiceFiscale', this.cercaPerCodiceFiscale);


    }
    async cercaPerCognome(req,res){
        try {
            const user = await ricercaPerCognome(req.params.cognome);
            //console.log("******************user id:",req.params.id)
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(user);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async cercaPerUsername(req,res){
        try {
            const user = await ricercaPerUsername(req.params.username);
            //console.log("******************user id:",req.params.id)
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(user);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async cercaPerCodiceFiscale(req,res){
        try {
            console.log('-*-----tedst controller cercaPerCodiceFiscale------ ')
            const user = await ricercaAnagrafica(req.params.codiceFiscale);
            //console.log("******************user id:",req.params.id)
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(user);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    getRouter() {
        return this.router;
    }
    
}
module.exports = WaucController