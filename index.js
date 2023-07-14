//Importing all needed packages locally
const express = require("express"),
    bodyParser = require("body-parser"),
    uuid = require('uuid'),
    morgan = require("morgan");
const
    app = express();
const
    mongoose = require("mongoose"),
    Models = require("./models.js");
const
    Movies = Models.Movie,
    Users = Models.User,
    Genres = Models.Genre,
    Directors = Models.Director;

const { check, validationResult } = require('express-validator'); //Import the express validator library into index.js


//Integrating Mongoose with RESTAPI cfDB is the name of database with movies and users
// mongoose.connect('mongodb://127.0.0.1:27017/cfDB', { useNewUrlParser: true, useUnifiedTopology: true });
// mongoose.connect('mongodb+srv://kunkang82:Password1@cfdb.iyxpqo3.mongodb.net/cfDB?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
/**
 * connection to online database hosted by MongoDB
 */
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Use Cross-Origin Resource Sharing
const cors = require('cors');
// app.use(cors()); //All origins have access, shouldn't get any CORS errors, but not recommended
// If you want only certain origins to be given access, replace app.use(cors()); with the following code:
let allowedOrigins = ['http://localhost:8080', 'http://testsite.com', 'http://localhost:1234', 'https://myflix-application.netlify.app'];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) { // If a specific origin isn’t found on the list of allowed origins
            let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
            return callback(new Error(message), false);
        }
        return callback(null, true);
    }
}));

// Turn on body-parser to read JSON from req-body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Requie passport module and import auth.js and passport.js
let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

// Turn on logging
app.use(morgan('common'));
// Direct requests to public folder
app.use(express.static('public'));

// GET requests
/**
 * Welcom page text response
 */
app.get('/', (req, res) => {
    res.send("Welcome to my Movie app!");
});

//Read
/**
 * Retrieves a list of all movies
 */
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.find()
        .then(movies => {
            res.status(200).json(movies);
        })
        .catch(err => {
            console.error(err);
            res.status(500).send("Error: " + err);
        });
});

//Search movie by title
/**
 * Retrieves a specific movie by its' title
 */
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne({ Title: req.params.Title })
        .then(movie => {
            res.json(movie);
        })
        .catch(err => {
            console.error(err);
            res.status(500).send("Error: " + err);
        });
});

/**
 * Retrieves a specific Genre by its' title
 */
//Search movie by genre
app.get('/movies/genre/:genreName', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne({ "Genre.Name": req.params.genreName })
        .then((movies) => { /* sending the response with user data back to the client */
            res.json(movies.Genre);
        })
        .catch((err) => { /* error handling */
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

/**
 * Retrieves a specific Director by their name
 */
//Search movie by director name
app.get('/movies/directors/:directorName', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne({ "Director.Name": req.params.directorName })
        .then((movies) => { /* sending the response with user data back to the client */
            res.json(movies.Director);
        })
        .catch((err) => { /* error handling */
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// Get all users
/**
 * Retrieves all registered users
 */
app.get('/users', (req, res) => {
    Users.find()
        .then((users) => {
            res.status(201).json(users);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// Get a user by username
/**
 * Retrieves a specifc user by their name
 */
app.get('/users/:Username', (req, res) => {
    Users.findOne({ Username: req.params.Username })
        .then((users) => {
            res.json(users);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

//CREATE - Add a user
/***
 * Allows users to register by filling out require information
 */
app.post('/users',
    // Validation logic here for request
    //you can either use a chain of methods like .not().isEmpty()
    //which means "opposite of isEmpty" in plain english "is not empty"
    //or use .isLength({min: 5}) which means
    //minimum value of 5 characters are only allowed
    [
        check('Username', 'Username is required').isLength({ min: 5 }),
        check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
        check('Password', 'Password is required').not().isEmpty(),
        check('Email', 'Email does not appear to be valid').isEmail()
    ], (req, res) => {

        // check the validation object for errors
        let errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        let hashedPassword = Users.hasPassword(req.body.Password);
        Users.findOne({ Username: req.body.Username }) // Search to see if a user with the requested username already exists
            .then((user) => {
                if (user) {
                    //If the user is found, send a response that it already exists    
                    return res.status(400).send(req.body.Username + ' already exists');
                } else {
                    Users.create({
                        Username: req.body.Username,
                        // Password: req.body.Password,
                        Password: hashedPassword,
                        Email: req.body.Email,
                        Birthday: req.body.Birthday
                    })
                        .then((user) => { res.status(201).json(user) })
                        .catch((error) => {
                            console.error(error);
                            res.status(500).send('Error: ' + error);
                        })
                }
            })
            .catch((error) => {
                console.error(error);
                res.status(500).send('Error: ' + error);
            });
    });

// Add a movie to a user's list of favorites
/**
 * Allows registered users to add a movie to their favorites
 */
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndUpdate(
        { Username: req.params.Username },
        { $push: { FavoriteMovies: req.params.MovieID } },
        { new: true }, // This line makes sure that the updated document is returned
    ).then(updatedUser => {
        res.json(updatedUser);
    }).catch(err => {
        console.error(err);
        res.statusMessage(500).send('Error: ' + err);
    });
});

/** 
 * Update a a user info by username:
 */
app.put('/users/:Username',
    [
        check('Username', 'Username is required').isLength({ min: 5 }),
        check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
        check('Password', 'Password is required').not().isEmpty(),
        check('Email', 'Email does not appear to be valid').isEmail()
    ],
    passport.authenticate('jwt', { session: false }), (req, res) => {
        let errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        let hashedPassword = Users.hasPassword(req.body.Password);

        /**
         * Update user to database
         */
        Users.findOneAndUpdate(
            { Username: req.params.Username },
            {
                $set: {
                    Username: req.body.Username,
                    // Password: req.body.Password,
                    Password: hashedPassword,
                    Email: req.body.Email,
                    Birthday: req.body.Birthday
                }
            },
            { new: true }, // This line makes sure that the updated document is returned
        ).then(updatedUser => {
            res.json(updatedUser);
        }).catch(err => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
    });

//Delete a movie to a user's list of favorites
app.delete("/users/:Username/movies/:MovieID", passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndUpdate(
        { Username: req.params.Username },
        { $pull: { FavoriteMovies: req.params.MovieID } },
        { new: true } // This line makes sure that he updated document is returned
    ).then(updatedUser => {
        res.json(updatedUser);
    }).catch(err => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
})

// Delete a user by username
app.delete('/users/:Username', (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username })
        .then((user) => {
            if (!user) {
                res.status(400).send(req.params.Username + ' was not found');
            } else {
                res.status(200).send(req.params.Username + ' was deleted.');
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

//Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Oops, something went wrong. Please try again later.');
});

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
    console.log('Listening on Port ' + port);
});
// listen for requests using port 8080
// app.listen(8080, () => {
//     console.log("Your app is listening on port 8080.");
// });
