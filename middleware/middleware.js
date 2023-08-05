const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");



const app = express();

/* `app.use(express.json());` is a middleware function in Express that parses incoming requests with
JSON payloads. It allows you to access the request body as a JavaScript object. This middleware is
necessary to handle JSON data sent in the request body, such as in POST or PUT requests. */
app.use(express.json());
/* The line `app.use(express.static(path.join(__dirname,'client')));` is setting up a static file
server in Express. It tells Express to serve static files from the `client` directory, which is
located in the same directory as the current script (`__dirname`). */
app.use(express.static(path.join(__dirname,'client')));

app.use(/* The `session` middleware in Express is used to manage user sessions. It creates a session
object for each user and stores it on the server. This allows the server to keep track of
user-specific data and maintain state between multiple requests from the same user. */
session({
    secret:'secret',
    resave:false,
    saveUninitialized:true,
    cookie:{
        secure:false
    }
}))

/* `app.use(passport.initialize());` is a middleware function in Express that initializes Passport.js.
Passport.js is a popular authentication middleware for Node.js that provides a simple and flexible
way to authenticate users in web applications. */
app.use(passport.initialize());

/* `app.use(passport.session());` is a middleware function in Express that initializes and configures
Passport.js to use sessions for authentication. */
app.use(passport.session());


/* `app.use('/api/users',require(`./routes/routes`));` is setting up a route handler for the
`/api/users` endpoint. */
app.use('/api/users',require(`../routes/routes`));

module.exports = app;
