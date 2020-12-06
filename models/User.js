const { Schema, model } = require("mongoose");
//Utilisation de Joi pour valider nos données 
const Joi = require('joi');

//On va définir la "shape" de notre document représentant un user en DB
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 255
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    createdAt: {
        type: String,
        required: true
    }
})

//On va valider les données de notre utilisateur
const validateUser = (user) => {
    const schema = Joi.object({
        username: Joi.string()
            .alphanum()
            .min(5)
            .max(50)
            .required(),

        email: Joi.string()
            .email()
            .min(5)
            .max(255)
            .required(),

        password: Joi.string()
            .min(4)
            .max(1024)
            .required(),

        confirmPassword: Joi.any().equal(Joi.ref('password'))
            .required()
            .label('Confirm password')
            .messages({ 'any.only': '{{#label}} does not match' }),

    })

    return schema.validate(user);
}

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

module.exports = { User, validateUser, userSchema };