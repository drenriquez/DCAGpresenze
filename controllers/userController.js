require('dotenv').config({path:'../.env'});
const express = require('express');
const basicAuth = require('express-basic-auth');
const router = express.Router();
const userModel = require('../model/userModel'); // Assumendo che il file del modello si chiami userModel.js


// Configurazione dell'autenticazione di base

router.use(basicAuth({
    users: { "admin": process.env.API_KEY },
    challenge: true
}));

// Ottenere tutti gli utenti
router.get('/users', async (req, res) => {
    try {
        const users = await userModel.getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ottenere tutti gli utenti ordinati per cognome
router.get('/users/ordinaCognome', async (req, res) => {
    console.log("RRRRRRRRRRRRRRRRRRRRRRRRRRRR")
    try {
        const users = await userModel.getAllUsersInOrdineCognome();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ottenere un utente per ID
router.get('/users/:id', async (req, res) => {
    try {
        const user = await userModel.getUserById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Creare un nuovo utente
router.post('/users', async (req, res) => {
    try {
        const user = await userModel.createUser(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Aggiornare un utente
router.put('/users/:id', async (req, res) => {
    try {
        const user = await userModel.updateUser(req.params.id, req.body);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Eliminare un utente
router.delete('/users/:id', async (req, res) => {
    try {
        const user = await userModel.deleteUser(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ottenere un utente per codice fiscale
router.get('/users/codiceFiscale/:codiceFiscale', async (req, res) => {
    try {
        const user = await userModel.getUserByCodiceFiscale(req.params.codiceFiscale);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ottenere utenti per ufficio
router.get('/users/ufficio/:ufficio', async (req, res) => {
    try {
        const users = await userModel.getUsersByUfficio(req.params.ufficio);
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ottenere il livello utente tramite codice fiscale
router.get('/users/livelloUser/:codiceFiscale', async (req, res) => {
    try {
        const livello = await userModel.getLivelloUserByCodiceFiscale(req.params.codiceFiscale);
        if (livello === null) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ livelloUser: livello });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ottenere utenti per una lista di uffici e ordinati per cognome
router.post('/users/uffici', async (req, res) => {
    try {
        const users = await userModel.getUsersByUffici(req.body.uffici);
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Aggiungere un'assenza con codicce fiscale
router.post('/users/addAbsenceByCodiceFiscale', async (req, res) => {
    try {
        const { codiceFiscale, data, motivo } = req.body;
        const user = await userModel.addAbsenceByCodiceFiscale(codiceFiscale, data, motivo);
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Cancellare un'assenza con codice fiscale
router.delete('/users/deleteAbsenceByCodiceFiscale', async (req, res) => {
    try {
        const { codiceFiscale, data } = req.body;
        const user = await userModel.deleteAbsenceByCodiceFiscale(codiceFiscale, data);
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Aggiungere un'assenza con codicce fiscale
router.post('/users/addAbsenceById', async (req, res) => {
    //console.log("/////////////////",userModel)
    try {
        const { id, data, motivo } = req.body;
        console.log("/////////////////",req.body)
        const user = await userModel.addAbsenceById(id, data, motivo);
        console.log("////////////// user in userController:",user)
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Cancellare un'assenza con codice fiscale
router.delete('/users/deleteAbsenceById', async (req, res) => {
    try {
        const { id, data } = req.body;
        const user = await userModel.deleteAbsenceById(id, data);
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
module.exports = router;
