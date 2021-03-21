'use strict';

const express = require('express');
const _ = require('lodash');

const config = {
    // Cloud Run provides port via env var
    port: process.env.PORT || 8080,
};

const TOPIC_NAME_FEEDBACK_CLASSIFIED="feedback-classified";

const {updateGoogleSheet} = require('./googlesheetManager');

// App
const app = express();
app.use(express.json()); //Used to parse JSON bodies
app.use(express.urlencoded()); //Parse URL-encoded bodies

app.get('/', (req, res) => {
    res.send('OK');
   
})

app.post('/', async function (req, res) {
    
    
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

    try {

       //update googlesheet
       await updateGoogleSheet(feedback_obj);
       console.log(`Successfully updated googel sheet`);
        
       res.status(204).send();
   
    }catch(err){
       res.status(500).send(`OOps something happend while updating google sheets.`);
       return;
    }
   
});

app.listen(config.port, () => {
    console.log(`analysis-func app listening 🚀at http://localhost:${config.port}`)
});
