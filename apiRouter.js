const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secrets = require('./config/secrets');
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

router.post('/login', validateUser, async (req, res) => {
    try {
        let user = await userModel.getByUsername(req.body.username);
        if (user && bcrypt.compareSync(req.body.password, user.password)) {
            let token = generateToken(user);
            res.status(200).json({
                message: `Welcome, ${user.username}.`,
                token: token
            });
        } else {
            res.status(400).json({ message: 'Invalid credentials.' });
        }
    } catch (err) {
        res.status(500).json({ error: 'There was an error logging in.' });
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

function generateToken(user) {
    let payload = {
        subject: user.id,
        username: user.username
    }

    let options = {
        expiresIn: '1d'
    }

    return jwt.sign(payload, secrets.jwtSecret, options);
}

module.exports = router;