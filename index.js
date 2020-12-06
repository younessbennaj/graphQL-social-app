const { ApolloServer, gql } = require('apollo-server');
const mongoose = require("mongoose");
//On importe l'URI de notre base de donnée depuis le fichier de config
//On ajoute ce fichier à .gitignore pour ne pas le pusher sur le repo publique
const { MONGODB } = require("./config");

/* 
    apollo-server:
        
        - Permet de définir le format de notre schema de données 
        - Permet de définir comment récupérer et modifier ces données
*/

const sayHi = "Hello world";

const typeDefs = gql`
    type Query {
        sayHi: String!
    }
`

const resolvers = {
    Query: {
        sayHi: () => sayHi
    }
}

//On va utiliser mongoose, qui sert d'interface de programmation entre notre server et mongoDB
//On va se connecter à notre base de donnée via l'URI fourni par MongoDB Atlas
mongoose.connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error("Couldn't connect to MongoDB...", err);
    })

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});