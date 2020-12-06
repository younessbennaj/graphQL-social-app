const { Schema, model } = require("mongoose");

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

//E.G
// const post = new Post({
//     body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt voluptatem officiis molestias sint eveniet quod pariatur consequatur voluptas soluta cupiditate, accusamus eligendi tenetur dolore cumque deleniti possimus cum magnam molestiae?",
//     title: "First post",
//     createdAt: "2020-12-06T13:27:29",
//     comments: [{
//         body: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
//         createdAt: "2020-12-06T13:27:29",
//         username: "johndoe"
//     }],
//     likes: [{
//         createdAt: "2020-12-06T13:27:29",
//         username: "johndoe"
//     }]
// })

module.exports = {
    Post
}