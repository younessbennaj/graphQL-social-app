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
        username: String 
        email: String
        createdAt: String
        password: String
    }


    #Ici on définir les différentes queries qui notre client peut executer pour récupérer des données présentes en DB
    type Query {
        getPosts: [Post]
        getUsers: [User]
        getUser(_id: String): User
    }

    #Ici on va définir les différentes mutations que le client peut executer pour envoyer des données au serveur dans le but de créer/modifier/supprimer des données en DB
    type Mutation {
        register(email: String): String
    }
`

module.exports = { typeDefs };