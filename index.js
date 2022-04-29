// add code in here to create an API with ExpressJS
const express = require('express');
const cors = require('cors')
const app = express();
const jwt = require('jsonwebtoken')
const fs = require('fs')
// import the dataset to be used here
const garments = require('./garments.json');

// enable the static folder...
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors())


function checkToken(req, res, next) {

    const token =req.query.token;
    console.log(token);
    const decoded = jwt.verify(token,'QueenPresident@Mmabatho');

    // find the username in the token ?
    const { username } = decoded;

    console.log(username);

    // check if the username in the token is 'avermeulen'
    if (username && username === 'President') {
        next();
    } else {
        res.sendStatus(403);
    }

}

app.get('/api/garments', function (req, res) {

    const token =req.params.token
    console.log(token)
    const gender = req.query.gender;
    const season = req.query.season;

    const filteredGarments = garments.filter(garment => {
        // if both gender & season was supplied
        if (gender != 'All' && season != 'All') {
            return garment.gender === gender
                && garment.season === season;
        } else if (gender != 'All') { // if gender was supplied
            return garment.gender === gender
        } else if (season != 'All') { // if season was supplied
            return garment.season === season
        }
        return true;
    });
});

app.get('/api/login', function (req, res) {
    var token = jwt.sign({ username: 'President'},'QueenPresident@Mmabatho');
    console.log(token)

    var decoded = jwt.decode(token);
    console.log(decoded)

    res.json({
         token
    });
});


app.get('/api/garments/price/:price',checkToken, function (req, res) {
    const token =req.query.token
    console.log(token)
    const maxPrice = Number(req.params.price);
    const filteredGarments = garments.filter(garment => {
        // filter only if the maxPrice is bigger than maxPrice
        if (maxPrice > 0) {
            return garment.price <= maxPrice;
        }
        return true;
    });

    res.json({
        garments: filteredGarments
    });
});

app.post('/api/garments', (req, res) => {

    // get the fields send in from req.body
    const {
        description,
        img,
        gender,
        season,
        price
    } = req.body;


    if (!description || !img || !price) {
        res.json({
            status: 'error',
            message: 'Required data not supplied',
        });
    } else {

        // you can check for duplicates here using garments.find

        // add a new entry into the garments list
        garments.push({
            description,
            img,
            gender,
            season,
            price
        });

        res.json({
            status: 'success',
            message: 'New garment added.',
        });
    }

});

const PORT = process.env.PORT || 4017;
app.listen(PORT, function () {
    console.log(`App started on port ${PORT}`)

});