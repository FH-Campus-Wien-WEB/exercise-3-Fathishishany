const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const movieModel = require('./movie-model.js');

const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'files')));

app.get('/genres', function (req, res) {
  const genres = new Set();
  for (const movie of Object.values(movieModel)) {
    for (const genre of movie.Genres) {
      genres.add(genre);
    }
  }
  res.send([...genres].sort());
});

app.get('/movies', function (req, res) {
  let movies = Object.values(movieModel);
  const genre = req.query.genre;
  if (genre) {
    movies = movies.filter(movie => movie.Genres.includes(genre));
  }
  res.send(movies);
});

app.get('/movies/:imdbID', function (req, res) {
  const id = req.params.imdbID;
  const movie = movieModel[id];
  if (movie) {
    res.send(movie);
  } else {
    res.sendStatus(404);
  }
});

app.put('/movies/:imdbID', function (req, res) {
  const id = req.params.imdbID;
  const exists = id in movieModel;
  movieModel[id] = req.body;
  if (exists) {
    res.sendStatus(200);
  } else {
    res.status(201).send(req.body);
  }
});

app.listen(3000);
console.log("Server now listening on http://localhost:3000/");