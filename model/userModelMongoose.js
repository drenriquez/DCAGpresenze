const mongoose = require('mongoose');

/* // Definizione dello schema per la collezione
const UserSchema = new mongoose.Schema({
    anagrafica: {
        nome: String,
        cognome: String,
        codice_fiscale: String
    },
    amministrazione: String,
    qualifica: String,
    ufficio: String,
    livelloUser: Number,
    assenze: [{
        data: String,
        motivo: String
    }]
}); */



// Definizione dello schema per le assenze annuali e mensili
const MonthlyAbsencesSchema = new mongoose.Schema({
    type: Map,
    of: String
}, { _id: false });

const YearlyAbsencesSchema = new mongoose.Schema({
    type: Map,
    of: MonthlyAbsencesSchema
}, { _id: false });

// Definizione dello schema per la collezione
const UserSchema = new mongoose.Schema({
    anagrafica: {
        nome: String,
        cognome: String,
        codiceFiscale: String // Modificato in camelCase per coerenza con i dati
    },
    amministrazione: String,
    qualifica: String,
    ufficio: String,
    livelloUser: Number,
    assenze: {
        type: Map,
        of: YearlyAbsencesSchema
    }
});

// Creazione del modello e definizione delle operazioni CRUD
const User = mongoose.model('User', UserSchema);

// Metodi per l'accesso ai dati degli utenti
User.getAllUsers = async () => {
    return await User.find({});
};

User.getUserById = async (userId) => {
    return await User.findById(userId);
};

User.createUser = async (userData) => {
    return await User.create(userData);
};

User.updateUser = async (userId, newData) => {
    return await User.findByIdAndUpdate(userId, newData, { new: true });
};

User.deleteUser = async (userId) => {
    return await User.findByIdAndDelete(userId);
};

// Funzione per trovare un utente per codice fiscale
User.getUserByCodiceFiscale = async (codiceFiscale) => {
    return await User.findOne({ 'anagrafica.codiceFiscale': codiceFiscale });
};

// Funzione per trovare tutti gli utenti di un particolare ufficio
User.getUsersByUfficio = async (ufficio) => {
    return await User.find({ ufficio: ufficio });
};

module.exports = User;