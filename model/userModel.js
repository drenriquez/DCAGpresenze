const { MongoClient, ObjectId } = require('mongodb');
const databaseConfig = require('../config/database');

class UserModel {
    constructor() {
        this.mongoClient = new MongoClient(databaseConfig.dbURI);
        this.db = null;
        this.usersCollection = null;
        this.initializeDatabase();
    }

    async initializeDatabase() {
        try {
            await this.mongoClient.connect();
            console.log('Connected to MongoDB');
            this.db = this.mongoClient.db(databaseConfig.dbName);
            this.usersCollection = this.db.collection('users');
        } catch (error) {
            console.error('Error connecting to MongoDB:', error);
        }
    }

    async getAllUsers() {
        try {
            return await this.usersCollection.find({}).toArray();
        } catch (error) {
            console.error("Error fetching all users:", error);
            throw error;
        }
    }

    async getAllUsersInOrdineCognome() {
        try {
            return await this.usersCollection.find({}).sort({ 'anagrafica.cognome': 1 }).toArray();
        } catch (error) {
            console.error("Error fetching all users ordered by surname:", error);
            throw error;
        }
    }

    async getUserById(userId) {
        try {
            return await this.usersCollection.findOne({ _id: new ObjectId(userId) });
        } catch (error) {
            console.error("Error fetching user by ID:", error);
            throw error;
        }
    }

    async createUser(userData) {
        try {
            const result = await this.usersCollection.insertOne(userData);
            return result.ops[0];
        } catch (error) {
            console.error("Error creating user:", error);
            throw error;
        }
    }

    async updateUser(userId, newData) {
        try {
            const result = await this.usersCollection.findOneAndUpdate(
                { _id: new ObjectId(userId) },
                { $set: newData },
                { returnOriginal: false }
            );
            return result.value;
        } catch (error) {
            console.error("Error updating user:", error);
            throw error;
        }
    }

    async deleteUser(userId) {
        try {
            const result = await this.usersCollection.findOneAndDelete({ _id: new ObjectId(userId) });
            return result.value;
        } catch (error) {
            console.error("Error deleting user:", error);
            throw error;
        }
    }

    async getUserByCodiceFiscale(codiceFiscale) {
        try {
            return await this.usersCollection.findOne({ 'anagrafica.codiceFiscale': codiceFiscale });
        } catch (error) {
            console.error("Error fetching user by codice fiscale:", error);
            throw error;
        }
    }

    async getUsersByUfficio(ufficio) {
        try {
            return await this.usersCollection.find({ ufficio: ufficio }).toArray();
        } catch (error) {
            console.error("Error fetching users by ufficio:", error);
            throw error;
        }
    }

    async getLivelloUserByCodiceFiscale(codiceFiscale) {
        try {
            const user = await this.getUserByCodiceFiscale(codiceFiscale);
            return user ? user.livelloUser : null;
        } catch (error) {
            console.error("Error fetching livello user by codice fiscale:", error);
            throw error;
        }
    }

    async getUsersByUffici(uffici) {
        try {
            return await this.usersCollection.find({ ufficio: { $in: uffici } }).sort({ 'anagrafica.cognome': 1 }).toArray();
        } catch (error) {
            console.error("Error fetching users by uffici:", error);
            throw error;
        }
    }

    async addAbsenceByCodiceFiscale(codiceFiscale, data, motivo) {
        try {
            const user = await this.getUserByCodiceFiscale(codiceFiscale);
            if (!user) {
                throw new Error('User not found');
            }

            const date = new Date(data);
            const year = date.getFullYear().toString();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');

            const updateQuery = { [`assenze.${year}.${month}.${day}`]: motivo };

            const result = await this.usersCollection.updateOne(
                { 'anagrafica.codiceFiscale': codiceFiscale },
                { $set: updateQuery }
            );

            if (result.matchedCount === 0) {
                throw new Error('User not found');
            }

            return await this.getUserByCodiceFiscale(codiceFiscale);
        } catch (error) {
            console.error("Error adding absence by codice fiscale:", error);
            throw error;
        }
    }

    async deleteAbsenceByCodiceFiscale(codiceFiscale, data) {
        try {
            const user = await this.getUserByCodiceFiscale(codiceFiscale);
            if (!user) {
                throw new Error('User not found');
            }

            const date = new Date(data);
            const year = date.getFullYear().toString();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');

            const updateQuery = { $unset: { [`assenze.${year}.${month}.${day}`]: 1 } };

            const result = await this.usersCollection.updateOne(
                { 'anagrafica.codiceFiscale': codiceFiscale },
                updateQuery
            );

            if (result.matchedCount === 0) {
                throw new Error('User not found');
            }

            return await this.getUserByCodiceFiscale(codiceFiscale);
        } catch (error) {
            console.error("Error deleting absence by codice fiscale:", error);
            throw error;
        }
    }

    async addAbsenceById(id, data, motivo) {
        try {
            const user = await this.getUserById(id);
            if (!user) {
                throw new Error('User not found');
            }

            const date = new Date(data);
            const year = date.getFullYear().toString();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');

            const updateQuery = { [`assenze.${year}.${month}.${day}`]: motivo };

            const result = await this.usersCollection.updateOne(
                { '_id': new ObjectId(id) },
                { $set: updateQuery }
            );

            if (result.matchedCount === 0) {
                throw new Error('User not found');
            }

            return await this.getUserById(id);
        } catch (error) {
            console.error("Error adding absence by ID:", error);
            throw error;
        }
    }

    async deleteAbsenceById(id, data) {
        try {
            const user = await this.getUserById(id);
            if (!user) {
                throw new Error('User not found');
            }

            const date = new Date(data);
            const year = date.getFullYear().toString();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');

            const updateQuery = { $unset: { [`assenze.${year}.${month}.${day}`]: 1 } };

            const result = await this.usersCollection.updateOne(
                { '_id': new ObjectId(id) },
                updateQuery
            );

            if (result.matchedCount === 0) {
                throw new Error('User not found');
            }

            return await this.getUserById(id);
        } catch (error) {
            console.error("Error deleting absence by ID:", error);
            throw error;
        }
    }
}

module.exports = UserModel;





// const { MongoClient } = require('mongodb');
// const { ObjectId } = require('mongodb');
// const databaseConfig = require('../config/database');

// // Connessione al database MongoDB
// const mongoClient = new MongoClient(databaseConfig.dbURI);

// mongoClient.connect(err => {
//     if (err) {
//         console.error('Error connecting to MongoDB:', err);
//         return;
//     }
//     console.log('Connected to MongoDB');
// });

// const db = mongoClient.db(databaseConfig.dbName);
// const usersCollection = db.collection('users');

// // Metodi per l'accesso ai dati degli utenti

// const getAllUsers = async () => {
//     return await usersCollection.find({}).toArray();
// };
// const getAllUsersInOrdineCognome = async () => {
//     return await usersCollection.find({}).sort({ 'anagrafica.cognome': 1 }).toArray();
// };
// const getUserById = async (userId) => {
//     const ObjectId = require('mongodb').ObjectId;
//     //console.log("*************************************chiamata funzione getUserById in userModel ", userId)
//     return await usersCollection.findOne({ _id: new ObjectId(userId) });
// };

// const createUser = async (userData) => {
//     const result = await usersCollection.insertOne(userData);
//     return result.ops[0];
// };

// const updateUser = async (userId, newData) => {
//     const ObjectId = require('mongodb').ObjectId;
//     const result = await usersCollection.findOneAndUpdate(
//         { _id: new ObjectId(userId) },
//         { $set: newData },
//         { returnOriginal: false }
//     );
//     return result.value;
// };

// const deleteUser = async (userId) => {
//     const ObjectId = require('mongodb').ObjectId;
//     const result = await usersCollection.findOneAndDelete({ _id: new ObjectId(userId) });
//     return result.value;
// };

// // Funzione per trovare un utente per codice fiscale
// const getUserByCodiceFiscale = async (codiceFiscale) => {
//     try {
//         const user = await usersCollection.findOne({ 'anagrafica.codiceFiscale': codiceFiscale });
//         return user;
//     } catch (error) {
//         console.error("Errore durante il recupero dell'utente:", error);
//         return null;
//     }
// };

// // Funzione per trovare tutti gli utenti di un particolare ufficio
// const getUsersByUfficio = async (ufficio) => {
//     return await usersCollection.find({ ufficio: ufficio }).toArray();
// };

// // Funzione per ottenere il livelloUser tramite codice fiscale
// const getLivelloUserByCodiceFiscale = async (codiceFiscale) => {
//     const user = await getUserByCodiceFiscale(codiceFiscale);
//     return user ? user.livelloUser : null;
// };
// // Nuova funzione per ottenere utenti per lista di uffici e ordinati per cognome
// const getUsersByUffici = async (uffici) => {
//     return await usersCollection.find({ ufficio: { $in: uffici } }).sort({ 'anagrafica.cognome': 1 }).toArray();
// };
// // Nuova funzione per aggiungere un'assenza
// const addAbsenceByCodiceFiscale = async (codiceFiscale, data, motivo) => {
//     const user = await getUserByCodiceFiscale(codiceFiscale);
//     if (!user) {
//         throw new Error('User not found');
//     }

//     const date = new Date(data);
//     const year = date.getFullYear().toString();
//     const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Mese in formato "MM"
//     const day = date.getDate().toString().padStart(2, '0'); // Giorno in formato "DD"

//     // Costruire l'update query dinamica
//     const updateQuery = {
//         [`assenze.${year}.${month}.${day}`]: motivo
//     };
   
//     const result = await usersCollection.updateOne(
//         { 'anagrafica.codiceFiscale': codiceFiscale },
//         { $set: updateQuery }
//     );
    
//     if (result.matchedCount === 0) {
//         throw new Error('User not found');
//     }

//     return await getUserByCodiceFiscale(codiceFiscale); // Restituisci l'utente aggiornato
// };
// // Funzione per cancellare un'assenza
// const deleteAbsenceByCodiceFiscale = async (codiceFiscale, data) => {
//     const user = await getUserByCodiceFiscale(codiceFiscale);
//     if (!user) {
//         throw new Error('User not found');
//     }

//     const date = new Date(data);
//     const year = date.getFullYear().toString();
//     const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Mese in formato "MM"
//     const day = date.getDate().toString().padStart(2, '0'); // Giorno in formato "DD"

//     // Costruire l'update query dinamica per rimuovere l'assenza
//     const updateQuery = {
//         $unset: {
//             [`assenze.${year}.${month}.${day}`]: 1
//         }
//     };

//     const result = await usersCollection.updateOne(
//         { 'anagrafica.codiceFiscale': codiceFiscale },
//         updateQuery
//     );

//     if (result.matchedCount === 0) {
//         throw new Error('User not found');
//     }

//     return await getUserByCodiceFiscale(codiceFiscale); // Restituisci l'utente aggiornato
// };



// // Nuova funzione per aggiungere un'assenza
// const addAbsenceById = async (id, data, motivo) => {
//     console.log("chiamata funzione addAbsenceById in userModel ", id, data, motivo)
//     const user = await getUserById(id);
//     //console.log("****chiamata funzione addAbsenceById  user ", user)
//     if (!user) {
//         throw new Error('User not found');
//     }

//     const date = new Date(data);
//     const year = date.getFullYear().toString();
//     const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Mese in formato "MM"
//     const day = date.getDate().toString().padStart(2, '0'); // Giorno in formato "DD"

//     const objectId = new ObjectId(id);
//     // Costruire l'update query dinamica
//     const updateQuery = {
//         [`assenze.${year}.${month}.${day}`]: motivo
//     };
//     //console.log("wwwwwwwwwwwwwwwwwwwww",updateQuery)
//     const result = await usersCollection.updateOne(
//         { '_id': objectId },
//         { $set: updateQuery }
//     );
//     //console.log("---------------------- result",result)
//     if (result.matchedCount === 0) {
//         throw new Error('User not found result.matchedCount === 0');
//     }

//     return await getUserById(id); // Restituisci l'utente aggiornato
// };
// // Funzione per cancellare un'assenza
// const deleteAbsenceById = async (id, data) => {
//     const user = await getUserById(id);
//     if (!user) {
//         throw new Error('User not found');
//     }

//     const date = new Date(data);
//     const year = date.getFullYear().toString();
//     const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Mese in formato "MM"
//     const day = date.getDate().toString().padStart(2, '0'); // Giorno in formato "DD"
//     const objectId = new ObjectId(id);
//     // Costruire l'update query dinamica per rimuovere l'assenza
//     const updateQuery = {
//         $unset: {
//             [`assenze.${year}.${month}.${day}`]: 1
//         }
//     };

//     const result = await usersCollection.updateOne(
//         { '_id': objectId },
//         updateQuery
//     );

//     if (result.matchedCount === 0) {
//         throw new Error('User not found');
//     }

//     return await getUserById(id); // Restituisci l'utente aggiornato
// };
// module.exports = {
//     getAllUsers,
//     getAllUsersInOrdineCognome,
//     getUserById,
//     createUser,
//     updateUser,
//     deleteUser,
//     getUserByCodiceFiscale,
//     getUsersByUfficio,
//     getUsersByUffici,
//     getLivelloUserByCodiceFiscale,
//     addAbsenceByCodiceFiscale,
//     deleteAbsenceByCodiceFiscale,
//     deleteAbsenceById,
//     addAbsenceById
// };
