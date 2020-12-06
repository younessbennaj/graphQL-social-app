const { ApolloServer, gql } = require('apollo-server');
const { connect, Schema, model } = require("mongoose");
//On importe l'URI de notre base de donnée depuis le fichier de config
//On ajoute ce fichier à .gitignore pour ne pas le pusher sur le repo publique
const { MONGODB } = require("./config");
//On importe nos model pour créer ou récupérer nos instances en DB
const { Post } = require("./models/Post");
/* 
    apollo-server:
        
        - Permet de définir le format de notre schema de données 
        - Permet de définir comment récupérer et modifier ces données
*/
const typeDefs = gql`
    #Ce type Post défini les champs récupérable pour chaque Post en DB
    type Post {
        id: ID!
        body: String
        title: String
        createdAt: String
        username: String
    }

    #Ici on va préciser que par exemple la query Post doit retourner un array de type Post
    type Query {
        getPosts: [Post]
    }
`

const resolvers = {
    Query: {
        getPosts: () => {
            //On récupére tous les documents de notre collection "posts" via notre model Post qui agit comme intérface vis à vis de cette collection en DB
            return Post.find({})
                .then(docs => {
                    return docs
                })
        }
    }
}


//On va utiliser mongoose, qui sert d'interface de programmation entre notre server et mongoDB
//On va se connecter à notre base de donnée via l'URI fourni par MongoDB Atlas
connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
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