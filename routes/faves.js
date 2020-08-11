const express = require('express');
const router = express.Router();
const db = require('../models');

let API_KEY = process.env.API_KEY;

router.get('/', (req, res) => {
    db.fave.findAll()
    .then(response => {
        console.log(response);
        res.render('faves' , {faves: response})
    }).catch(err => {
        console.log(err);
    })
})

router.post('/', (req, res) => {
    db.fave.findOrCreate({
        where: { title: req.body.title },
        // if title not found, defaults to: 
        defaults: { imdbid : req.body.imdbid }
    })
    .then(([newFav, created]) => {
        // created returns boolean
        console.log(`This was created: ${created}`)
        res.redirect('faves')
    })
    .catch(err => {
        console.log(err);
        res.send('Sorry, we fucked it all up.')
    })
})

module.exports = router;