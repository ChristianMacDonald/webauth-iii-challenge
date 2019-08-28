const express = require('express');
const bcrypt = require('bcryptjs');
const userModel = require('./users/userModel');

const router = express.Router();

router.post('/register', validateUser, async (req, res) => {
    try {
        let credentials = req.body;
        let hash = bcrypt.hashSync(credentials.password, 14);
        credentials.password = hash;
        let newUser = await userModel.insert(credentials);
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ error: 'There was an error saving the user to the database.' });
    }
});

router.get('/users', async (req, res) => {
    try {
        let users = await userModel.get();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json('The users information could not be retrieved.');
    }
});

function validateUser(req, res, next) {
    if (req.body) {
        if (req.body.username) {
            if (req.body.password) {
                next();
            } else {
                res.status(400).json('Missing required password field.');
            }
        } else {
            res.status(400).json('Missing required username field.');
        }
    } else {
        res.status(400).json('Missing user data.');
    }
}

module.exports = router;