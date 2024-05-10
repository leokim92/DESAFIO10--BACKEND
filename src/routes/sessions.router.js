const express = require("express");
const router = express.Router(); 
const UserModel = require ("../models/user.model.js")
const passport = require ("passport")

//import {createHash, isValidPassworld} from "../utils/hashbcrypt.js"
const {createHash, isValidPassworld} = require ("../utils/hashbcrypt.js")

//Registro: 
router.post("/", async (req, res) => {
    const {first_name, last_name, email, password, age} = req.body; 

    try {
        const userExist = await UserModel.findOne({email:email});
        if(userExist) {
            return res.status(400).send("Email is already in use");
        }

        //Rol-New User
        const role = email === "admincoder@coder.com" ? "admin" : "user"; 
        const newUser = await UserModel.create({first_name, last_name, email, password: createHash(password), age, role});

        //Armamos la session: 
        req.session.login = true;
        req.session.user = {...newUser._doc}

        res.redirect("/profile");

    } catch (error) {
        res.status(500).send("Internal server error")
    }
})

//Login: 
router.post("/login", async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await UserModel.findOne({email:email}); 
        if(user) {
            if (isValidPassworld(password, user)){
                req.session.login = true;
                req.session.user = {
                    email: user.email, 
                    age: user.age,
                    first_name: user.first_name, 
                    last_name: user.last_name
                }
                res.redirect("/products");
            } else {
                res.status(401).send("Password incorrect");
            }

        } else {
            res.status(404).send("User not found");
        }
        
    } catch (error) {
        res.status(500).send("Internal server error")
    }

})

//Version para Passport:
//Registro:
router.post("/", passport.authenticate("register", {
    failureRedirect: "/api/sessions/failedregister"
}), async (req, res) => {

    if (!req.user) return res.status(400).send("Invalid credentials");

    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email
    };

    req.session.login = true;

    res.redirect("/profile");
})

router.get("/failedregister", (req, res) => {
    res.send("registro fallido");
})

//Login:
router.post("/login", passport.authenticate("login", { failureRedirect: "/api/sessions/faillogin" }), async (req, res) => {

    if (!req.user) return res.status(400).send("Invalid credentials");

    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email
    };

    req.session.login = true;

    res.redirect("/profile");
})

router.get("/faillogin", async (req, res) => {
    res.send("Failed")
})

//Version para GitHub:
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }), async (req, res) => { })

router.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/login" }), async (req, res) => {
    //La estrategia de github nos retornara el usuario, entonces lo agregamos a nuestro objeto de sesion:
    req.session.user = req.user;
    req.session.login = true;
    res.redirect('/profile');
})

//Logout
router.get("/logout", (req, res) => {
    if(req.session.login) {
        req.session.destroy();
    }
    res.redirect("/login");
})

module.exports = router;