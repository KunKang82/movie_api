const express = require("express"),
    bodyParser = require("body-parser");
    uuid = require('uuid');
    morgan = require("morgan");   
    app = express();

app.use(morgan('common'));
app.use(express.static('public'));
app.use(bodyParser.json());

let users = [
    {
        id: 1,
        name: "Paul Jackson",
        favoriteMovies: []
    },
    {
        id: 2,
        name: "Matthew Johnson",
        favoriteMovies: []
    },
    {
        id: 3,
        name: "Kevin Smith",
        favoriteMovies: []
    },
];

let movies = [
    {
        Title: "Avatar: The Way of Water",
        Description: "Jake Sully and Ney'tiri have formed a family and are doing everything to stay together. However, they must leave their home and explore the regions of Pandora. When an ancient threat resurfaces, Jake must fight a difficult war against the humans.",
        Year: "2022",
        Genre: {
            Name: "Science fiction",
            Description: "Science fiction (or sci-fi) is a film genre that uses speculative, fictional science-based depictions of phenomena that are not fully accepted by mainstream science, such as extraterrestrial lifeforms, spacecraft, robots, cyborgs, dinosaurs, interstellar travel, time travel, or other technologies."
        },
        Director: {
            Name: "James Cameron",
            Bio: "James Cameron, (born August 16, 1954, Kapuskasing, Ontario, Canada), Canadian filmmaker known for his expansive vision and innovative special-effects films, most notably Titanic (1997), for which he won an Academy Award for best director, and Avatar (2009).",
            Birthyear: "1954",
            Deathyear: "Present"
        },
        ImageUrl: "https://www.imdb.com/title/tt1630029/mediaviewer/rm92486145/?ref_=tt_ov_i",
        Featured: "yes"
    },
    {
        Title: "The Matrix Revolutions",
        Description: "In a dystopia overrun by robots, Neo (Keanu Reeves), mankind's greatest hope, is trapped in a limbo world. Meanwhile, the majority of the planet's population remains in a state of suspended virtual reality. The few humans who are cognizant of the grim realities of the world desperately try to hold off their mechanical enemies long enough for Neo to escape and save the day, but things turn disastrous when all-powerful computer program Agent Smith (Hugo Weaving) arrives in the flesh.",
        Year: "2003",
        Genre: {
            Name: "Science fiction",
            Description: "Science fiction (or sci-fi) is a film genre that uses speculative, fictional science-based depictions of phenomena that are not fully accepted by mainstream science, such as extraterrestrial lifeforms, spacecraft, robots, cyborgs, dinosaurs, interstellar travel, time travel, or other technologies."
        },
        Director: {
            Name: "Lana Wachowski, Lilly Wachoswki",
            Bio: "Lana Wachowski (born June 21, 1965, formerly known as Larry Wachowski)[1] and Lilly Wachowski (born December 29, 1967, formerly known as Andy Wachowski)[2] are American film and television directors, writers and producers",
            Birthyear: "1965",
            Deathyear: "Present"
        },
        ImageUrl: "https://www.imdb.com/title/tt0242653/mediaviewer/rm1810127616/?ref_=tt_ov_i",
        Featured: "yes"
    },
    {
        Title: "Avengers: Endgame",
        Description: "Adrift in space with no food or water, Tony Stark sends a message to Pepper Potts as his oxygen supply starts to dwindle. Meanwhile, the remaining Avengers -- Thor, Black Widow, Captain America and Bruce Banner -- must figure out a way to bring back their vanquished allies for an epic showdown with Thanos -- the evil demigod who decimated the planet and the universe.",
        Year: "2019",
        Genre: {
            Name: "Superhero",
            Description: "A superhero film (or superhero movie) is a film that focuses on the actions of superheroes. Superheroes are individuals who possess superhuman abilities and are dedicated to protecting the public. These films typically feature action, adventure, fantasy, or science fiction elements."
        },
        Director: {
            Name: "Anthony Russo, Joe Russo",
            Bio: "Anthony Russo (born February 3, 1970) and Joseph Russo (born July 18, 1971), collectively known as the Russo brothers (ROO-so), are American directors, producers, and screenwriters. They direct most of their work together.",
            Birthyear: "1970, 1971",
            Deathyear: "Present"
        },
        ImageUrl: "https://www.imdb.com/title/tt4154796/mediaviewer/rm2775147008/?ref_=tt_ov_i",
        Featured: "yes"
    },
    {
        Title: "John Wick",
        Description: "Legendary assassin John Wick (Keanu Reeves) retired from his violent career after marrying the love of his life. Her sudden death leaves John in deep mourning. When sadistic mobster Iosef Tarasov (Alfie Allen) and his thugs steal John's prized car and kill the puppy that was a last gift from his wife, John unleashes the remorseless killing machine within and seeks vengeance. Meanwhile, Iosef's father (Michael Nyqvist) -- John's former colleague -- puts a huge bounty on John's head.",
        Year: "2014",
        Genre: {
            Name: "Action thriller",
            Description: "Action thriller is a blend of both action and thriller film in which the protagonist confronts dangerous adversaries, obstacles, or situations which he/she must conquer, normally in an action setting."
        },
        Director: {
            Name: "Chad Stahelski",
            Bio: "Chad Stahelski (born September 20, 1968) is an American stuntman and film director. He is known for directing the 2014 film John Wick and directing its three sequels. He has worked as a stuntman, stunt coordinator and second unit director on several films.",
            Birthyear: "1968",
            Deathyear: "Present"
        },
        ImageUrl: "https://www.imdb.com/title/tt2911666/mediaviewer/rm1723909376/?ref_=tt_ov_i",
        Featured: "yes"
    },
    {
        Title: "The Dark Knight",
        Description: "With the help of allies Lt. Jim Gordon (Gary Oldman) and DA Harvey Dent (Aaron Eckhart), Batman (Christian Bale) has been able to keep a tight lid on crime in Gotham City. But when a vile young criminal calling himself the Joker (Heath Ledger) suddenly throws the town into chaos, the caped Crusader begins to tread a fine line between heroism and vigilantism.",
        Year: "2008",
        Genre: {
            Name: "Superhero",
            Description: "A superhero film (or superhero movie) is a film that focuses on the actions of superheroes. Superheroes are individuals who possess superhuman abilities and are dedicated to protecting the public. These films typically feature action, adventure, fantasy, or science fiction elements."
        },
        Director: {
            Name: "Christopher Nolan",
            Bio: "Christopher Nolan, (born July 30, 1970, London, England), British film director and writer acclaimed for his noirish visual aesthetic and unconventional, often highly conceptual narratives. Nolan was raised by an American mother and a British father, and his family spent time in both Chicago and London.",
            Birthyear: "1970",
            Deathyear: "Present"
        },
        ImageUrl: "https://www.imdb.com/title/tt0468569/mediaviewer/rm4023877632/?ref_=tt_ov_i",
        Featured: "yes"
    },
    {
        Title: "Avengers: Infinity War",
        Description: "Iron Man, Thor, the Hulk and the rest of the Avengers unite to battle their most powerful enemy yet -- the evil Thanos. On a mission to collect all six Infinity Stones, Thanos plans to use the artifacts to inflict his twisted will on reality. The fate of the planet and existence itself has never been more uncertain as everything the Avengers have fought for has led up to this moment.",
        Year: "2018",
        Genre: {
            Name: "Superhero",
            Description: "A superhero film (or superhero movie) is a film that focuses on the actions of superheroes. Superheroes are individuals who possess superhuman abilities and are dedicated to protecting the public. These films typically feature action, adventure, fantasy, or science fiction elements."
        },
        Director: {
            Name: "Anthony Russo, Joe Russo",
            Bio: "Anthony Russo (born February 3, 1970) and Joseph Russo (born July 18, 1971), collectively known as the Russo brothers (ROO-so), are American directors, producers, and screenwriters. They direct most of their work together.",
            Birthyear: "1970, 1971",
            Deathyear: "Present"
        },
        ImageUrl: "https://www.imdb.com/title/tt4154756/mediaviewer/rm4044245504/?ref_=tt_ov_i",
        Featured: "yes"
    },
    {
        Title: "Iron man",
        Description: "A billionaire industrialist and genius inventor, Tony Stark (Robert Downey Jr.), is conducting weapons tests overseas, but terrorists kidnap him to force him to build a devastating weapon. Instead, he builds an armored suit and upends his captors. Returning to America, Stark refines the suit and uses it to combat crime and terrorism.",
        Year: "2008",
        Genre: {
            Name: "Superhero",
            Description: "A superhero film (or superhero movie) is a film that focuses on the actions of superheroes. Superheroes are individuals who possess superhuman abilities and are dedicated to protecting the public. These films typically feature action, adventure, fantasy, or science fiction elements."
        },
        Director: {
            Name: "Jon Favreau",
            Bio: "Jonathan Kolia Favreau (/ˈfævroʊ/; born October 19, 1966)[1] is an American actor and filmmaker. As an actor, Favreau has appeared in films such as Rudy (1993), PCU (1994), Swingers (1996), Very Bad Things (1998), Deep Impact (1998), The Replacements (2000), Daredevil (2003), and The Break-Up (2006). He has also appeared in films such as Four Christmases (2008), Couples Retreat (2009), I Love You, Man (2009), People Like Us (2012), The Wolf of Wall Street (2013), Chef (2014), and several films created by Marvel Studios. As a filmmaker, Favreau has been significantly involved with the Marvel Cinematic Universe.",
            Birthyear: "1966",
            Deathyear: "Present"
        },
        ImageUrl: "https://www.imdb.com/title/tt0371746/mediaviewer/rm1544850432/?ref_=tt_ov_i",
        Featured: "yes"
    },
    {
        Title: "Gone in Sixty Seconds",
        Description: "A car thief is forced to steal 50 luxury vehicles in one night in order to save the life of his brother, who has fallen foul of a dangerous crime lord. Once the most successful car thief in California, he must reassemble his old gang to fulfil the almost impossible mission. His task is further hampered by a rival band of thieves and, of course, the local police.",
        Year: "2000",
        Genre: {
            Name: "Action heist",
            Description: "A heist film's plot revolves around a group of people trying to steal something. This “thing” can be money, jewels, secret files, priceless art, or other valuable objects. The crime involves intricate planning and challenges so a simple hold-‐up or mugging is not part of the heist genre."
        },
        Director: {
            Name: "Dominic Sena",
            Bio: "Dominic Sena was born on April 26, 1949, in Ohio. He began his career by directing music videos for many singers, including, Janet Jackson. His feature directorial debut was Kalifornia in 1993. He is known for Gone in 60 Seconds(2000), starring Nicolas Cage and Swordfish (2001).",
            Birthyear: "1949",
            Deathyear: "Present"
        },
        ImageUrl: "https://www.imdb.com/title/tt0187078/mediaviewer/rm2251462656/?ref_=tt_ov_i",
        Featured: "yes"
    },
    {
        Title: "Ocean's Eleven",
        Description: "Dapper Danny Ocean (George Clooney) is a man of action. Less than 24 hours into his parole from a New Jersey penitentiary, the wry, charismatic thief is already rolling out his next plan. Following three rules: Don't hurt anybody, don't steal from anyone who doesn't deserve it, and play the game like you've got nothing to lose. Danny orchestrates the most sophisticated, elaborate casino heist in history.",
        Year: "2001",
        Genre: {
            Name: "Heist comedy",
            Description: "A heist film's plot revolves around a group of people trying to steal something. This “thing” can be money, jewels, secret files, priceless art, or other valuable objects. The crime involves intricate planning and challenges so a simple hold-‐up or mugging is not part of the heist genre."
        },
        Director: {
            Name: "Steven Soderbergh",
            Bio: "Steven Andrew Soderbergh (/ˈsoʊdərbɜːrɡ/; born January 14, 1963) is an American film director, producer, screenwriter, cinematographer and editor. A pioneer of modern independent cinema, Soderbergh is an acclaimed and prolific filmmaker. Atlanta, Georgia, U.S.",
            Birthyear: "1963",
            Deathyear: "Present"
        },
        ImageUrl: "https://www.imdb.com/title/tt0240772/mediaviewer/rm3370325760/?ref_=tt_ov_i",
        Featured: "yes"
    },
    {
        Title: "Training Day",
        Description: 'Police drama about a veteran officer who escorts a rookie on his first day with the LAPD\'s tough inner-city narcotics unit. "Training Day" is a blistering action drama that asks the audience to decide what is necessary, what is heroic and what crosses the line in the harrowing gray zone of fighting urban crime. Does law-abiding law enforcement come at the expense of justice and public safety? If so, do we demand safe streets at any cost?',
        Year: "2001",
        Genre: {
            Name: "Crime thriller",
            Description: "Crime thriller as an genre is a hybrid type of both crime films and thrillers, which offers a suspenseful account of a successful or failed crime or crimes. Such films often focus on the criminal(s) rather than a policeman."
        },
        Director: {
            Name: "Antoine Fuqua",
            Bio: "Antoine Fuqua (born May 30, 1965) is an American filmmaker, known for his work in the action and thriller genres. He was originally known as a director of music videos, and made his film debut in 1998 with The Replacement Killers. His critical breakthrough was the award-winning 2001 crime thriller Training Day.",
            Birthyear: "1965",
            Deathyear: "Present"
        },
        ImageUrl: "https://www.imdb.com/title/tt0139654/mediaviewer/rm1018705920/?ref_=tt_ov_i",
        Featured: "yes"
    }
];

// GET requests
app.get("/", (req, res) => {
    res.send("Welcome to my Movie app!");
});

//Documentation
app.get("/documentation", (req, res) => {
    res.sendFile("public/documentation.html", { root: __dirname });
});

//Read
app.get("/movies", (req, res) => {
    res.status(200).json(movies);
});

//Search movie by title
app.get('/movies/:title', (req,res) => {
    const { title } = req.params; //This is the new way, old way is const title = req.params.title;
    const movie = movies.find(movie => movie.Title === title);

    if (movie) {
        res.status(200).json(movie);
    } else {
        res.status(400).send('no such movie')
    }
})

//Search movie by genre
app.get('/movies/genre/:genreName', (req,res) => {
    const { genreName } = req.params; 
    const genre = movies.find(movie => movie.Genre.Name === genreName).Genre;

    if (genre) {
        res.status(200).json(genre);
    } else {
        res.status(400).send('no such genre')
    }
})

//Search movie by director name
app.get('/movies/directors/:directorName', (req,res) => {
    const { directorName } = req.params; 
    const director = movies.find(movie => movie.Director.Name === directorName).Director;

    if (director) {
        res.status(200).json(director);
    } else {
        res.status(400).send('no such director')
    }
})

//CREATE
app.post('/users', (req, res) => {
    const newUser = req.body;

    if (newUser.name) {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).json(newUser)
    } else {
        res.status(400).send('users need names')
    }
})

//UPDATE
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const updatedUser = req.body;

    let user = users.find( user => user.id == id);

    if (user) {
        user.name = updatedUser.name;
        res.status(200).json(user)
    } else {
        res.status(400).send('no such user')
    }
})

//CREATE
app.post('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find( user => user.id == id);

    if (user) {
        user.favoriteMovies.push(movieTitle);
        res.status(200).send(`${movieTitle} has been added to user ${id}'s favorite list`);
    } else {
        res.status(400).send('no such user')
    }
})

//DELETE
app.delete('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find( user => user.id == id);

    if (user) {
        user.favoriteMovies = user.favoriteMovies.filter( title => title !== movieTitle);
        res.status(200).send(`${movieTitle} has been removed from the user ${id}'s favorite list`);
    } else {
        res.status(400).send('no such user')
    }
})

app.delete('/users/:id/', (req, res) => {
    const { id } = req.params;

    let user = users.find( user => user.id == id);

    if (user) {
        users = users.filter( user=> user.id != id);
        //res.json(users) - to test if deleted
        res.status(200).send(`user ${id} has been deleted`);
    } else {
        res.status(400).send('no such user')
    }
})

//Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Oops, something went wrong. Please try again later.');
});

// listen for requests
app.listen(8080, () => {
    console.log("Your app is listening on port 8080.");
});
