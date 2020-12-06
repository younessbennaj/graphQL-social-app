const { ApolloServer, AuthenticationError } = require('apollo-server');
//Package pour hasher le mdp de l'utilisateur

const bcrypt = require('bcrypt');

// *** MONGODB *** 
const { connect, Schema, model, Types, set } = require("mongoose");
//On importe l'URI de notre base de donnée depuis le fichier de config
//On ajoute ce fichier à .gitignore pour ne pas le pusher sur le repo publique
const { MONGODB } = require("./config");

// *** MODELS *** //

//On importe nos model pour créer ou récupérer nos instances en DB
const { User, validateUser } = require("./models/User");
const { Post } = require("./models/Post");

// *** TYPEDEFS ***

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
        register: (_, { registerInput: { username, email, password, confirmPassword } }) => {
            const { error } = validateUser({ username, email, password, confirmPassword });
            //Si le model de donnée de l'utilisateur n'est pas validé, on envoi une erreur d'autentification
            if (error) throw new AuthenticationError(error.details[0].message);

            //On va ensute vérifier que l'utilisateur n'existe pas en DB 
            User.findOne({ email })
                .then(doc => {
                    //Si l'utilisateur est déjà présent en DB...
                    if (doc) {
                        throw new AuthenticationError("User already registred.");
                    } else {
                        //Sinon on peut passer à la création d'un nouvel utilisateur en DB... 

                        //On va d'abord hasher le mot de passe pour le stocker en DB de manière sécurisé
                        bcrypt.genSalt(10, function (err, salt) {
                            bcrypt.hash(password, salt, function (err, hash) {

                                let user = new User({
                                    username,
                                    email,
                                    password: hash,
                                    createdAt: new Date().toISOString()
                                })

                                console.log(user);

                                // user.save().then(doc => {
                                //     return doc;
                                // }).catch(err => {
                                //     console.log(err);
                                // });
                            });
                        });
                        // let user = new User({
                        //     username,
                        //     email,
                        //     password,
                        //     confirmPassword,
                        //     createdAt
                        // })

                        // User.create(user).then(user => {
                        //     console.log(user);
                        // });

                    }
                })
            // User.create({ username })
            //     .then(user => console.log(user))
            //     .catch(err => console.error(err.message))
            //On va hasher notre mot de passe 
            // bcrypt.genSalt(10, function (err, salt) {
            //     bcrypt.hash(password, salt, function (err, hash) {
            //         console.log(hash);
            //     });
            // });

        }
    }
}

//On va utiliser mongoose, qui sert d'interface de programmation entre notre server et mongoDB
//On va se connecter à notre base de donnée via l'URI fourni par MongoDB Atlas
set('useCreateIndex', true);
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