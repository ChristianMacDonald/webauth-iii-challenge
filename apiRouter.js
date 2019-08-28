const express = require('express');
const userModel = require('./users/userModel');

const router = express.Router();

router.get('/users', async (req, res) => {
    try {
        let users = await userModel.get();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json('The users information could not be retrieved.');
    }
});

module.exports = router;