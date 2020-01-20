// Import required modules via npm
const express = require('express');
const cors = require('cors');
const monk = require('monk');
const Filter = require('bad-words');
const rateLimit = require("express-rate-limit");

// Create server via express
const app = express();

// Use monk module to communicate with MongoDB and get all barks
const db = monk(process.env.MONGO_URI || 'localhost/barker');
const barks = db.get('barks');
const filter = new Filter();

// Use middleware
app.use(cors());
app.use(express.json());

app.listen(5000, () => {
    console.log('Listening on http://localhost:5000')
});

app.get('/', (req, res) => {
    res.json({
        message: 'Barker!'
    });
});

app.get('/barks', (req, res) => {
    barks
        .find()
        .then(barks => {
            res.json(barks);
        })
})

// Helper function to validate barks are not empty 
function isValidBark(bark){
    return bark.name && bark.name.toString().trim() !== '' &&
        bark.content && bark.content.toString().trim() !== ''
}

app.use(rateLimit({
    windowMs: 10 * 1000, // 30
    max: 1 // limit each IP to 100 requests per windowMs
  }))

app.post('/barks', (req, res) => {
    // Validate Bark
    if(isValidBark(req.body)){
        // Create object using request data
        const bark = {
            name: filter.clean(req.body.name.toString()),
            content: filter.clean(req.body.content.toString()),
            created: new Date()
        };
        // Insert object into db and respond with that json object
        barks
            .insert(bark)
            .then(createdBark => {
                res.json(createdBark);
            })
    } else {
        res.status(422);
        res.json({
            message: 'Hey! Name and Content are required!'
        })
    }
});