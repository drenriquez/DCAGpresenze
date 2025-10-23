const xlsx = require('xlsx');
const { MongoClient, ObjectId } = require('mongodb');
const databaseConfig = require('../config/database');


class UserDao {
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
            console.log('++++++ TEST DAO ++++++++++++')
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
            return result;
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
            //console.log("/////////////// inUserDao 77",result)
            return result;
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
            return await this.usersCollection.find({ ufficio: ufficio }).sort({ 'anagrafica.cognome': 1 }).toArray();
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
    async getUfficioByCodiceFiscale(codiceFiscale) {
        try {
            const user = await this.getUserByCodiceFiscale(codiceFiscale);
            return user ? user.ufficio : null;
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
                console.log('User not found, codiceFiscale-> ',codiceFiscale,"data->",data,"motivo->",motivo)
                throw new Error('User not found, in userDao.addAbsenceByCodiceFiscale() ');
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


    async getAbsencesSummaryByCodiceFiscale(codiceFiscale, startDate, endDate) {
        try {
            // Converti le date in oggetti Date
            const start = new Date(startDate);
            const end = new Date(endDate);
    
            // Esegui l'aggregazione
            const result = await this.usersCollection.aggregate([
                {
                    $match: {
                        "anagrafica.codiceFiscale": codiceFiscale
                    }
                },
                {
                    $project: {
                        assenze: {
                            $filter: {
                                input: {
                                    $map: {
                                        input: { $objectToArray: "$assenze" },
                                        as: "anno",
                                        in: {
                                            year: "$$anno.k",
                                            months: {
                                                $map: {
                                                    input: { $objectToArray: "$$anno.v" },
                                                    as: "mese",
                                                    in: {
                                                        month: "$$mese.k",
                                                        days: {
                                                            $filter: {
                                                                input: { $objectToArray: "$$mese.v" },
                                                                as: "giorno",
                                                                cond: {
                                                                    $and: [
                                                                        {
                                                                            $gte: [
                                                                                {
                                                                                    $dateFromString: {
                                                                                        dateString: {
                                                                                            $concat: [
                                                                                                "$$anno.k", "-", "$$mese.k", "-", "$$giorno.k"
                                                                                            ]
                                                                                        }
                                                                                    }
                                                                                },
                                                                                start
                                                                            ]
                                                                        },
                                                                        {
                                                                            $lte: [
                                                                                {
                                                                                    $dateFromString: {
                                                                                        dateString: {
                                                                                            $concat: [
                                                                                                "$$anno.k", "-", "$$mese.k", "-", "$$giorno.k"
                                                                                            ]
                                                                                        }
                                                                                    }
                                                                                },
                                                                                end
                                                                            ]
                                                                        }
                                                                    ]
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                },
                                as: "assenzeAnno",
                                cond: { $gt: [{ $size: "$$assenzeAnno.months" }, 0] }
                            }
                        }
                    }
                },
                {
                    $unwind: "$assenze"
                },
                {
                    $unwind: "$assenze.months"
                },
                {
                    $unwind: "$assenze.months.days"
                },
                {
                    $group: {
                        _id: "$assenze.months.days.v",
                        count: { $sum: 1 }
                    }
                },
                {
                    $project: {
                        codiceGiustificativo: "$_id",
                        totale: "$count"
                    }
                }
            ]).toArray();
    
            return result;
        } catch (error) {
            console.error("Error fetching absences summary by codice fiscale:", error);
            throw error;
        }
    };
    async addAbsencesFromExcel(filePath) {
        try {
            const workbook = xlsx.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const data = xlsx.utils.sheet_to_json(sheet);
            let i=0
            for (const row of data) {
                i++
                const codiceFiscale = row['codiceFiscale'];
                let motivo = row['assenza'];
                let dataAssenza = row['dataAssenza'];
              

                // Converti la data se è in formato Excel (numero)
                if (typeof dataAssenza === 'number') {
                    dataAssenza = this.convertExcelDate(dataAssenza);
                }

                // Assicurati che tutti i campi necessari siano presenti
                if (!codiceFiscale || !motivo || !dataAssenza) {
                    console.error(`Dati mancanti nella riga: ${JSON.stringify(row)}`);
                    continue;
                }

                // Aggiungi l'assenza per il codice fiscale specificato
                if(motivo==="RC"){motivo="BO"}
                if(motivo==="A"){motivo="Ap"}

                await this.addAbsenceByCodiceFiscale(codiceFiscale, dataAssenza, motivo);
            }

            console.log('Aggiornamento assenze completato.'," righe lette -> ",i);
        } catch (error) {
            console.error('Errore durante l\'aggiornamento delle assenze dal file Excel:', error);
            throw error;
        }
    }

       // Metodo per convertire la data Excel in formato leggibile
       convertExcelDate(excelDate) {
        const epoch = new Date(1899, 12, 0); // 30 Dicembre 1899 è il giorno 0 in Excel
        const date = new Date(epoch.getTime() + excelDate * 86400000); // 86400000 = 24*60*60*1000 (ms in un giorno)
        return date.toISOString().split('T')[0]; // Restituisce la data in formato 'YYYY-MM-DD'
    }
    
}

module.exports = UserDao;
