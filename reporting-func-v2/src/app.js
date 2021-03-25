'use strict';

const express = require('express');
const _ = require('lodash');
const TOPIC_NAME_FEEDBACK_CLASSIFIED="feedback-classified";
const {updateFeedbackToStore, getFeedbackFromStore} = require('./firestoreRepository');
const {updateGoogleSheet} = require('./googlesheetManager');

const config = {
  // Cloud Run provides port via env var
  port: process.env.PORT || 8080,
  sheetId: process.env.SHEET_ID,
};

// App
const app = express();
app.use(express.json()); //Used to parse JSON bodies
app.use(express.urlencoded()); //Parse URL-encoded bodies

app.get('/', (req, res) => {

    res.send('OK');
  
})

app.post('/', async function (req, res) {

    console.log('1...Parsing classifiedFeedbackId from feedback-classified');
    if (_.isNil(req.body.message)) {
      console.log(`Invalid message received. Ignoring.: ${msg}`);
      res.status(200).send();
      return;
    }

     // Messages always come in as base64 - need to decode them.
     const message = JSON.parse(Buffer.from(req.body.message.data, 'base64')
     .toString('utf-8'));
      console.log(`Received message:`, message);

    // Ignore invalid messages (right now, there's nothing else we could do
    // with them).
    if (_.isNil(message.classifiedFeedbackId)) {
      console.log(`Invalid message received. Ignoring.`);
      res.status(200).send();
      return;
    }

    try {

      // If message is valid, get feedback out of Firestore.
      // (https://firebase.google.com/docs/firestore/query-data/get-data#node.js)
      const classifiedFeedbackId = message.classifiedFeedbackId;

      //2...Read Feedback Data from FireStore
      console.log('2...Reading Feedback Data from FireStore');
      const feedbckObj = await getFeedbackFromStore(classifiedFeedbackId)
      console.log("feedbckObj", feedbckObj);
      //update googlesheet
      //3...Updating google sheet
      console.log('3...Updating google sheet with : ',feedbckObj);
      await updateGoogleSheet(config.sheetId,feedbckObj);
      console.log(`Successfully updated google sheet`);
      res.status(200).send();
      return;

    }catch(err){
      console.log(`Error processing message:`, err);
      // Send 200 (not 500) in case of error because right now we don't have a way to handle
      // loops caused by Pub/Sub re-sending messages forever.
      res.status(200).send();
      return;
    }
});

app.listen(config.port, () => {
    console.log(`reporting-func-v1 app listening cicd at 🚀at http://localhost:${config.port}`)
});
