'use strict';

const express = require('express');
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

app.post('/', (req, res) => {
    if (!req.body) {
      const msg = 'no Pub/Sub message received';
      console.error(`error: ${msg}`);
      res.status(400).send(`Bad Request: ${msg}`);
      return;
    }

    if (!req.body.message) {
      const msg = 'invalid Pub/Sub message format';
      console.error(`error: ${msg}`);
      res.status(400).send(`Bad Request: ${msg}`);
      return;
    }
    
    console.log( req.body);
    const pubSubMessage = req.body.message;

    const feedback_str = Buffer.from(pubSubMessage.data, 'base64').toString();
    console.log(`feedback_str ${feedback_str}!`);

    const feedback_obj = JSON.parse(feedback_str);
    console.log(`Message Feedback Data ${feedback_obj}!`);
    
    console.log(`Message ID ${pubSubMessage.messageId}!`);
    res.status(204).send();
});

app.listen(config.port, () => {
    console.log(`trigger-func app listening 🚀at http://localhost:${config.port}`)
});
