
const UserModel = require('../models/user');
const cryptoRandomString = require('crypto-random-string');

const passport = require('passport');
const LocalStategy = require('passport-local').Strategy;
const mailer = require('../utils/mailer'); 

passport.use(new LocalStategy(
    {
        usernameField: 'email',
        passwordField : 'password'
    },
    async function (email, password, done) {

        try {
            let user = await UserModel.findOne({ email: email});
            if (!user) { return done(null, false); }

            if(!user.verified){
                return done(null , false); 
            }
            let result = await user.verifyPassword(password); 
            console.log("@result password " , result); 
            if (!result) { return done(null, false); }
            
            return done(null, user);
        } catch (ex) {
            console.log(ex.message);
            return done(null, false);
        }

    }
));

async function emailExist(email){
    try{
        let result = await UserModel.findOne({ email : email }); 
        if(result) return true; 
        return false; 
    }catch{
        return true;
    }
    
}

module.exports = {

    signup: async (req, res) => {
        const password = req.body.password ; 
        const email = req.body.email ;
        const name = req.body.name ; 
        let errors = []; 
        if(password.length < 8){
            errors.push({key : "password" , message: "password length should be greater than 8"}); 
        }
        if(!email) { // regex validate email pattern 
            errors.push({key : "email" , message: "please enter a valid email"}); 
        }
        if(!name){ // if name is empty
            errors.push({key : "name" , message: "name can't be empty "}); 
        }

        // email exists already  
        if(await emailExist(email)) {
            errors.push({key : "email" , message: "Email exists already"}); 
        }
        if(errors.length){
            res.status(422);
            res.send({errors : errors });
            return; 
        }
        try {

            let code = cryptoRandomString({length: 20, type: 'url-safe'});
            let user = {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password, 
                code : code 
            };            
            try{
                await mailer.sendVerificationCode(email , "http://localhost:3000/api/verify/" + code ); 
            }catch (ex){
                res.status(500);
                console.error(ex);
                res.send({ error : { message : "couldn't send verification email. please try again later"} });
                return; 
            }
            let response = await UserModel.create(user);
            res.send(response);

        } catch (ex) {
            res.status(400);
            res.send(ex.message);
        }
    },
    login: passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash:false 
    }) , 
    verify : async (req, res) => {
        const code = req.params.code; 
        let user = await UserModel.findOne({ code : code }); 
        user.verified= true ; 
        await user.save(); 
        res.send('Email verified');         
    }
}