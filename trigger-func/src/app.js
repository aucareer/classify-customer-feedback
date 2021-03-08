'use strict';

const express = require('express')

// Constants
const PORT = 3000;
const HOST = '0.0.0.0';

// App
const app = express();

app.use(express.json()); //Used to parse JSON bodies

app.use(express.urlencoded()); //Parse URL-encoded bodies

const application_port = process.env.PORT || PORT;

app.get('/', (req, res) => {
    res.send('OK');
})

app.post('/', function (req, res) {
    console.log("data >>", req.body)
    res.status(200).send({
        status: "OK"
    });
})

app.listen(application_port, HOST);
console.log(`Trigger Func App us Running 🚀 on http://${HOST}:${PORT}`);