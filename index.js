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
        register: (_, { registerInput }) => {
            const { error } = validateUser(registerInput);
            //Si le model de donnée de l'utilisateur n'est pas validé, on envoi une erreur d'autentification
            if (error) throw new AuthenticationError(error.details[0].message);

            //CreateUser() => fonction pour valider et créer un user en DB
            //Prends en argument les credentials avec lesquels on va créer l'user en DB
            function createUser({ username, email, password, confirmPassword }) {
                return new Promise((resolve, reject) => {

                    //On va ensute vérifier que l'utilisateur n'existe pas en DB 
                    User.findOne({ email })
                        .then(doc => {
                            //Si l'utilisateur est déjà présent en DB...
                            if (doc) {
                                throw new AuthenticationError("User already registred.");
                            } else {
                                //Sinon on peut passer à la création d'un nouvel utilisateur en DB... 

                                //On va hasher le password
                                hashPassword(password).then(hash => {

                                    //On créer une nouvelle instance du model User()
                                    let user = new User({
                                        username,
                                        email,
                                        password: hash,
                                        createdAt: new Date().toISOString()
                                    })

                                    //Puis on va créer notre user en DB 
                                    user.save().then(user => {
                                        //On tient notre promesse avec les données du user en DB
                                        resolve(user);
                                    }).catch(err => {
                                        //On peut rompre notre promesse avec le message d'erreur
                                        reject(err);
                                    });
                                })
                            }
                        })
                })
            } // Fin de createUser()

            function hashPassword(password) {
                //On va venir enrober notre code asynchrone avec un executeur
                return new Promise((resolve, reject) => {
                    //On  hasher le mot de passe pour le stocker en DB de manière sécurisé
                    bcrypt.genSalt(10, function (err, salt) {
                        bcrypt.hash(password, salt, function (err, hash) {
                            //Notre promesse est rompue avec le message d'erreur
                            if (err) reject(err)
                            //Sinon elle est tenue avec notre promesse est tenue avec le mot de passe hasher
                            else resolve(hash)
                        });
                    });
                })
            }

            return createUser(registerInput)
                .then(user => {
                    //On retourne en réponse à la mutation le model donnée représantant l'user en DB
                    return user;
                })

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