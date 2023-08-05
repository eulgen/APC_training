const express = require("express");
const users = require("../models/model");
const validuser = require("../configs/validation");
const bcrypt = require("bcrypt");
//const passport = require("passport");
const {check_user_email,check_user_password,passport} = require("../controllers/controllers");


const router = express.Router();


router.post('/',async (req,res) => {
    console.log("The request body is : ",req.body);
    const {username,email,password} = req.body;
    // if(!username || !email || !password){
    //     res.status(400).json({message:"Username or Email or Password does not exist"});
    // }
    const {value,error} = validuser(req.body);
    if(error){
        res.status(400).json({message:error.details});
    }else{
        const hashedpass = await bcrypt.hash(password, 10);
        const contact = users.create({
            username,
            email,
            hashedpass
        });
        res.status(201).json(contact);
    }
});

router.get('/',async(req,res) => {
    const contacts = users.find();
    res.status(200).json({message : contacts});
});

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
    // if(req.isAuthenticated()){
    //     return next();
    // }
    // res.redirect("/auth/google");
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
    const { username, email, password } = req.body;

    try {
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await users.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'Cet email est déjà utilisé par un autre utilisateur' });
        }

        // Hasher le mot de passe avant de le stocker dans la base de données
        const hashedPassword = await bcrypt.hash(password, 10);

        // Créer un nouvel utilisateur
        const newUser = new users({ username, email, password: hashedPassword });
        
        await newUser.save();

        res.status(201).json({ message: 'Compte créé avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Une erreur est survenue lors de la création du compte' });
    }
});

// // Route pour l'authentification de l'utilisateur
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Rechercher l'utilisateur dans la base de données par son email
        const user = await users.findOne({ email });
        // if (!user) {
        //     return res.status(401).json({ message: 'L\'email est incorrect' });
        // }

        // // Vérifier le mot de passe haché
        // const isPasswordValid = await bcrypt.compare(password, user.password);
        // if (!isPasswordValid) {
        //     return res.status(401).json({ message: 'L\'email ou le mot de passe est incorrect' });
        // }

        check_user_email(user);

        check_user_password(user,password);

        // Générer un JWT (JSON Web Token)
        const token = jwt.sign({ userId: user._id }, 'ici, code secret', { expiresIn: '1h' });

        res.status(200).json({ message: 'Authentification réussie', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Une erreur est survenue lors de l\'authentification' });
    }
});

module.exports = router;