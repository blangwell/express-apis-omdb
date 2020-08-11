require('dotenv').config();
const express = require('express');
const axios = require('axios');
const ejsLayouts = require('express-ejs-layouts');
const app = express();
const db = require('./models')

let API_KEY = process.env.API_KEY;

// Sets EJS as the view engine
app.set('view engine', 'ejs');
// Specifies the location of the static assets folder
app.use(express.static('static'));
// Sets up body-parser for parsing form data
app.use(express.urlencoded({ extended: false }));
// Enables EJS Layouts middleware
app.use(ejsLayouts);

app.use('/faves', require('./routes/faves'));
// Adds some logging to each request
app.use(require('morgan')('dev'));

// Routes
// HOME ROUTE - index.ejs
app.get('/', (req, res) => {
  console.log('home route hit!');
  res.render('index');
});

// RESULT ROUTE
app.get('/results', (req, res)=> {
  let qs = {
    params: {
      s: req.query.q,
      apikey: API_KEY
    }
  }

  axios.get('http://www.omdbapi.com', qs)
  .then(response => {
    let results = response.data.Search;
    // console.log(results);
    res.render('results', {movies: results});
  })
})

// MOVIES ROUTE detail.ejs
app.get('/movies/:movie_id', (req, res)=> {
  let qs = {
    params: {
      i: req.params.movie_id,
      apikey: API_KEY
    }
  }
  axios.get('http://www.omdbapi.com', qs)
  .then(response => {
    let results = response.data;
    // console.log(results);
    res.render('detail', {movie: results});
  })
})


// app.get('/faves', (req, res) => {
//   const faveMovies =  db.fave.findAll();
//   res.render('faves', {movies: faveMovies})
// })

// app.post('/faves', (req, res) => {
//   console.log(req.body)
//   db.fave.findOrCreate({
//     where: {
//       Title: req.body.Title
//     }
//   }).then(m => {
//     // console.log('created: ',   m.Title)
//   }).catch(err => {
//     console.log('ya got an error ya dingus ', err)
//   })
//   res.redirect('faves', {movie: req.body})
// })

// app.post('/faves', (req, res) => {})


// The app.listen function returns a server handle
var server = app.listen(process.env.PORT || 3000);

// We can export this server to other servers like this
module.exports = server;
