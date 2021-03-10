'use strict';

const express = require('express')
const _ = require('lodash');

const config = {
    // Cloud Run provides port via env var
    port: process.env.PORT || 8080,
};

// App
const app = express();
app.use(express.json()); //Used to parse JSON bodies
app.use(express.urlencoded()); //Parse URL-encoded bodies

app.get('/', (req, res) => {
    res.send('OK');
})

app.post('/', async function (req, res) {

    const input = req.body;

    console.log("input data >>", input);

    if (_.isNil(input.feedback)) {
        res.status(400).send(`Missing input param "feedback".`);
        return;
      }

    res.status(201).send();
    
})

app.listen(config.port, () => {
    console.log(`trigger-func app listening 🚀at http://localhost:${config.port}`)
});
