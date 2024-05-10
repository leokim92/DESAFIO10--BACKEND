const passport = require ("passport");
const LocalStrategy = require ("passport-local");

const UserModel = require("../models/user.model.js")
const { createHash, isValidPassworld } = require("../utils/hashbcrypt.js");

const GitHubStrategy = require("passport-github2");

const initializePassport = () => {

    //Creamos la estrategia para el registro
    passport.use("register", new LocalStrategy({

        //Le digo que quiero acceder al objeto request.
        passReqToCallback: true,
        usernameField: "email",
        //Le digo que el campo para el usuario sera el email.

    }, async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        try {

            // Verificamos si ya existe un registro con ese mail.
            let user = await UserModel.findOne({ email });
            if (user) return done(null, false);

            //Si no existe, voy a crear un registro para el nuevo usuario:
            let newUser = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password)
            }

            //Lo guardamos en la base de datos.
            let result = await UserModel.create(newUser)
            return done(null, result);
        } catch (error) {
            return done(error);
        }
    }))

    //Creamos la estrategia para el login del usuario
    passport.use("login", new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
        try {
            //Primero verifico si existe un usuario con ese email.
            const user = await UserModel.findOne({ email });
            if (!user) {
                console.log("User doesn't exist");
                return done(null, false)
            }

            //si Existe verifico la contrase;a
            if (!isValidPassworld(password, user)) return done(null, false);

            return done(null, user);

        } catch (error) {
            return done(error)
        }
    }))

    //Serializar  usuario: Coloca el usuario y lo retira cada vez que se van o logean
    passport.serializeUser((user, done) => {
        done(null, user._id);
    })

    passport.deserializeUser(async (id, done) => {
        let user = await UserModel.findById({ _id: id });
        done(null, user);
    })

    //Estrategia de GitHub
    //Instalamos : npm i passport-github2
    passport.use("github", new GitHubStrategy({
        clientID: "Iv1.d81b80563f31e8fb",
        clientSecret: "0ecdc02b9d0f55bea73c6627bd842b53c9715502",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
    
        try {
            let user = await UserModel.findOne({ email: profile._json.email });

            if (!user) {
                let newUser = {
                    first_name: profile._json.name,
                    last_name: "User",
                    age: 36,
                    email: profile._json.email,
                    password: "holacoderhouse",
                }
                let result = await UserModel.create(newUser);
                done(null, result);
            } else {
                done(null, user);
            }
        } catch (error) {
            return done(error);
        }
    }))

}

module.exports = initializePassport;