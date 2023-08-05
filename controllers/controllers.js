const passport = require("passport");
const users = require("../models/model");
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
require("dotenv").config();



/* The code `passport.use(new GoogleStrategy({ ... }))` is configuring and setting up the Google
authentication strategy for Passport.js. */
passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL,
    passReqToCallback   : true
},
function(request, accessToken, refreshToken, profile, done) {
    done(null,profile);
}
));


/* `passport.serializeUser((user,done) =>{ done(null,user); });` is a function that is used to
serialize the user object. */
passport.serializeUser((user,done) =>{
    /* In the context of the code snippet provided, `done` is a callback function that is used to
    indicate the completion of a task or operation. It is typically called with an error (if any) as
    the first argument and the result or data as the second argument. */
    done(null,user);
});

passport.deserializeUser((user,done) =>{
    done(null,user);
});

async function check_user_email(user){
    // Rechercher l'utilisateur dans la base de données par son email
    if (!user) {
        return res.status(401).json({ message: 'L\'email est incorrect' });
    }
}

async function check_user_password(user,password){
    // Vérifier le mot de passe haché
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: 'L\'email ou le mot de passe est incorrect' });
    }
}

module.exports = {check_user_email,check_user_password,passport};