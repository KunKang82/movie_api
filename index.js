//Importing all needed packages locally
const express = require("express"),
    bodyParser = require("body-parser");
    uuid = require('uuid');
    morgan = require("morgan");
const
    app = express();
const
    mongoose = require("mongoose");
    Models = require("./models.js");
const
    Movies = Models.Movie;
    Users = Models.User;
    Genres = Models.Genre;
    Directors = Models.Director;


//Integrating Mongoose with RESTAPI cfDB is the name of database with movies and users
mongoose.connect('mongodb://localhost:27017/cfDB', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(morgan('common'));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

// GET requests
app.get('/', (req, res) => {
    res.send("Welcome to my Movie app!");
});

//Read
app.get('/movies', (req, res) => {
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
app.get("/movies/:Title", (req, res) => {
    Movies.findOne({ Title: req.params.Title })
        .then(movie => {
            res.json(movie);
        })
        .catch(err => {
            console.error(err);
            res.status(500).send("Error: " + err);
        });
});

//Search movie by genre
app.get('/movies/genre/:genreName', (req, res) => {
    Movies.findOne({ "Genre.Name": req.params.genreName })
        .then((movies) => { /* sending the response with user data back to the client */
            res.json(movies.Genre);
        })
        .catch((err) => { /* error handling */
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

//Search movie by director name
app.get('/movies/directors/:directorName', (req, res) => {
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

//CREATE
app.post('/users', (req, res) => {
    Users.findOne({ Username: req.body.Username })
        .then((user) => {
            if (user) {
                return res.status(400).send(req.body.Username + 'already exists');
            } else {
                Users.create({
                        Username: req.body.Username,
                        Password: req.body.Password,
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
app.post('/users/:Username/movies/:MovieID', (req, res) => {
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

// Update a user's info, by username
/* We’ll expect JSON in this format
{
    Username: String,
    (required)
    Password: String,
    (required)
    Email: String,
    (required)
    Birthday: Date
}*/
app.put('/users/:Username', (req, res) => {
    Users.findOneAndUpdate(
        { Username: req.params.Username },
        {
            $set: {
            Username: req.body.Username,
            Password: req.body.Password,
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
app.delete("/users/:Username/movies/:MovieID", (req, res) => {
    Users.findOneAndUpdate(
        { Username: req.params.Username },
        { $push: { FavoriteMovies: req.params.MovieID } },
        { new: true} // This line makes sure that he updated document is returned
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

// listen for requests
app.listen(8080, () => {
    console.log("Your app is listening on port 8080.");
});
