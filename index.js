const { ApolloServer, gql } = require('apollo-server');
const { connect, Schema, model } = require("mongoose");
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
connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error("Couldn't connect to MongoDB...", err);
    })

//On va définir la "shape" de notre document représentant un user en DB
const userSchema = new Schema({
    username: String,
    email: String,
    password: String,
    createdAt: String
})

//On va compiler notre schema en model => Le model est le blueprint à partir duquel on va créer nos objet en DB
//User = classe; user = instance 
const User = model("User", userSchema);

const user = new User({
    username: 'johndoe',
    email: 'johndoe@email.com',
    password: 'test',
    createdAt: '2020-12-06T13:27:29'
})

//la shape de notre document représentant un post en DB
const postSchema = new Schema({
    body: String,
    title: String,
    createdAt: String,
    comments: [
        {
            body: String,
            username: String,
            createdAt: String
        }
    ],
    likes: [
        {
            username: String,
            createdAt: String
        }
    ],
    //On précise entre le champs "user" et la collection "users" => pas nécessaire avec un DB non relationnelle comme MongoDB
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
});

const Post = model('Post', postSchema);

const post = new Post({
    body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt voluptatem officiis molestias sint eveniet quod pariatur consequatur voluptas soluta cupiditate, accusamus eligendi tenetur dolore cumque deleniti possimus cum magnam molestiae?",
    title: "First post",
    createdAt: "2020-12-06T13:27:29",
    comments: [{
        body: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
        createdAt: "2020-12-06T13:27:29",
        username: "johndoe"
    }],
    likes: [{
        createdAt: "2020-12-06T13:27:29",
        username: "johndoe"
    }]
})

console.log(post);

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});