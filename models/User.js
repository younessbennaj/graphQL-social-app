const { Schema, model } = require("mongoose");

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

//E.G
// const user = new User({
//     username: 'johndoe',
//     email: 'johndoe@email.com',
//     password: 'test',
//     createdAt: '2020-12-06T13:27:29'
// })

module.exports = { User }