const { ApolloServer } = require('apollo-server');
const { connect, Schema, model, Types } = require("mongoose");
//On importe l'URI de notre base de donnée depuis le fichier de config
//On ajoute ce fichier à .gitignore pour ne pas le pusher sur le repo publique
const { MONGODB } = require("./config");
//On importe nos model pour créer ou récupérer nos instances en DB
const { User } = require("./models/User");
const { Post } = require("./models/Post");
//On importe nos typeDefs
const { typeDefs } = require("./graphql/typeDefs");

const resolvers = {
    Query: {
        getPosts: () => {
            //On récupére tous les documents de notre collection "posts" via notre model Post qui agit comme intérface vis à vis de cette collection en DB
            return Post.find({})
                .then(docs => {
                    console.log(docs);
                    return docs
                })
                .catch(err => {
                    console.log("Couldn't find the posts collection", err)
                }
                )
        },
        getUsers: () => {
            //On récupère tous nos utilisateurs en DB 
            return User.find({})
                .then(docs => {
                    return docs
                })
                .catch(err => {
                    console.log("Couldn't find the users collection", err)
                })
        },
        getUser: (_, { _id }) => {
            const id = Types.ObjectId(_id);
            return User.findById(id)
                .then(user => {
                    return user;
                })
            // return "find user by id"
        },
    },
    Mutation: {
        register: (_, { email }) => {
            console.log(email);
            return "User registration !!"
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