const { gql } = require('apollo-server');

/* 
    apollo-server:
        
        - Permet de définir le format de notre schema de données 
        - Permet de définir comment récupérer et modifier ces données
*/
const typeDefs = gql`
    #Ici on va définir nos schemas

    #Ce type Post défini les champs récupérable pour chaque post en DB
    type Post {
        id: ID!
        username: String
        body: String
        title: String
        createdAt: String
    }

    #Ce type Post défini les champs récupérable pour chaque user en DB
    type User {
        id: ID!
        username: String!
        password: String!
        # token: String!
        email: String!
        createdAt: String!
    }

    #Shape du de l'input de données envoyés par le client pour enregistrer un user
    input RegisterInput {
        username: String!
        password: String!
        confirmPassword: String!
        email: String!
    }


    #Ici on définir les différentes queries qui notre client peut executer pour récupérer des données présentes en DB
    type Query {
        getPosts: [Post]
        getUsers: [User]
        getUser(_id: String): User
    }

    #Ici on va définir les différentes mutations que le client peut executer pour envoyer des données au serveur dans le but de créer/modifier/supprimer des données en DB
    type Mutation {
        register(registerInput: RegisterInput): User
    }
`

module.exports = { typeDefs };