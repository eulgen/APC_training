const express = require("express");
const users = require("../models/model");
const validuser = require("../configs/validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const {check_user_email,check_user_password,passport,get_userByEmail} = require("../controllers/controllers");


const router = express.Router();


router.post('/register',(req,res) => {
    const {value,error} = validuser(req.body);
    if(error){
        res.status(400).json({message:error.details});
    }else{
        res.status(200).json(value);
    }
});

router.get('/auth/google',
    passport.authenticate('google', { scope:
        [ 'email', 'profile' ] }
));

router.get( '/auth/google/callback',
    passport.authenticate( 'google', {
        successRedirect: '/api/users/auth/google/protected',
        failureRedirect: '/api/users/auth/google/failure'
}));

router.get('/auth/google/failure',(req,res) => {
    res.status(400).json({message:"Something went wrong"});
});

/**
 * Checks if a user is logged in and authenticated before allowing access to a protected route.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The callback function to proceed to the next middleware or route handler.
 * @return {undefined}
 */
function isLoggedIn(req,res,next){
    /* `req.user` is a property provided by Passport.js. It represents the currently authenticated
    user. In this code, `req.user` is used to check if a user is authenticated before allowing
    access to the protected route. If `req.user` exists (i.e., the user is authenticated), the
    `next()` function is called to proceed to the next middleware or route handler. Otherwise, a 401
    Unauthorized status code is sent back to the client. */
    req.user ? next() : res.sendStatus(401);
}


router.get('/auth/google/protected',isLoggedIn,async (req,res) => {
    const email = req.user.email;
    const user = await users.findOne({ email });
    check_user_email(user);
    // Générer un JWT (JSON Web Token)
    const token = jwt.sign({ userId: user._id }, 'ici, code secret', { expiresIn: process.env.EXPIRE_TOKEN_TIME });
    res.status(200).json({ message: 'Authentification réussie', token });
});

// Route pour la création d'un nouvel utilisateur
router.post('/signup', async (req, res) => {
    var { username, email, password,country,state } = req.body;

    try {
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await users.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'Cet email est déjà utilisé par un autre utilisateur' });
        }
        // Hasher le mot de passe avant de le stocker dans la base de données
        password = await bcrypt.hash(password, 10);

        // Créer un nouvel utilisateur
        const newUser = new users({ username,email,password,country,state});

        await newUser.save();

        res.status(201).json({ message: 'Compte créé avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Une erreur est survenue lors de la création du compte' });
    }
});

router.get('/users_datas',async(req,res) => {
    let usr=await users.find({});
    res.status(200).json(usr);
})

router.get('/user_data/:id',async(req,res) => {
    const user = await users.findById(req.params.id);
    res.status(200).json(user);
})

router.put('/update/:id',async(req,res) => {
    const user = await users.findById(req.params.id);
    if(!user){
        res.status(404).json({message:"User not found"});
    }
    const updateUser = users.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new:true}
    );

    res.status(200).json(updateUser);
});

router.delete('/delete/:id', async(req,res) => {
    const user = await users.findById(req.params.id);
    if(!user){
        res.status(404).json({message:"User not found"});
    }

    await user.remove();

    res.status(200).json({message:"user removed"});
});

//Route pour l'authentification de l'utilisateur
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Rechercher l'utilisateur dans la base de données par son email
        const user = await users.findOne({ email });

        check_user_email(user);

        check_user_password(user,password);

        // Générer un JWT (JSON Web Token)
        const token = jwt.sign({ userId: user._id }, 'ici, code secret', { expiresIn: process.env.EXPIRE_TOKEN_TIME });

        res.status(200).json({ message: 'Authentification réussie', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Une erreur est survenue lors de l\'authentification' });
    }
});

module.exports = router;