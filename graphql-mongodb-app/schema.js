const { buildSchema } = require('graphql');
const { GraphQLDateTime } = require('graphql-iso-date');

// Definizione dello schema GraphQL
const schema = buildSchema(`
  scalar JSON

  type Query {
 
    getAllUsers: [User]
    getAllUsersInOrdineCognome: [User]
    getAllUsersAssenzePerAnnoEMese(anno: String!, mese: String!): [UserAssenzeMese]
  }

  type Mutation {
    createUser(input: UserInput!): User
    deleteUser(id: ID!): String
    updateAssenza(id: ID!, anno: String!, mese: String!, giorno: String!, tipo: String!): User
  }

  type User {
    _id: ID
    anagrafica: Anagrafica
    amministrazione: String
    qualifica: String
    ufficio: String
    livelloUser: Int
    assenze: JSON
  }
  
  type Anagrafica {
    nome: String
    cognome: String
    codiceFiscale: String
  }

  type UserAssenzeMese {
    _id: ID
    anagrafica: Anagrafica
    assenze: JSON
  }
  input UserInput {
    _id: ID
    anagrafica: AnagraficaInput!
    amministrazione: String!
    qualifica: String!
    ufficio: String!
    livelloUser: Int!
    assenze: JSON
  }

  input AnagraficaInput {
    nome: String!
    cognome: String!
    codiceFiscale: String!
  }
`);

module.exports = schema;
