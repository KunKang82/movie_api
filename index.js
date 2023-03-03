const express = require("express"),
    morgan = require("morgan");   

const app = express();

app.use(morgan('common'));
app.use(express.static('public'));

let topMovies = [
    {
        title: "Avatar: The Way of Water",
        year: "2022",
    },
    {
        title: "The Matrix Revolutions",
        year: "2003",
    },
    {
        title: "Avengers: Endgame",
        year: "2019",
    },
    {
        title: "John Wick",
        year: "2014",
    },
    {
        title: "The Dark Knight",
        year: "2008",
    },
    {
        title: "Avengers: Infinity War",
        year: "2018",
    },
    {
        title: "Iron man",
        year: "2008",
    },
    {
        title: "Gone in Sixty Seconds",
        year: "2000",
    },
    {
        title: "Ocean's Eleven",
        year: "2001",
    },
    {
        title: "Training Day",
        year: "2001",
    }
];

// GET requests
app.get("/", (req, res) => {
    res.send("Welcome to my app!");
});

//Documentation
app.get("/documentation", (req, res) => {
    res.sendFile("public/documentation.html", { root: __dirname });
});

//API Routes
app.get("/movies", (req, res) => {
    res.json(topMovies);
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
