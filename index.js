const express = require('express');
const apiRouter = require('./apiRouter');

const server = express();

server.use(express.json());
server.use('/api', apiRouter);

const port = 8000;

server.listen(port, () => {
    console.log(`Server listening on port ${port}.`);
});