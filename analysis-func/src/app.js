'use strict';

const express = require('express');
const _ = require('lodash');

const config = {
    // Cloud Run provides port via env var
    port: process.env.PORT || 8080,
};

const TOPIC_NAME_FEEDBACK_CLASSIFIED="feedback-classified";
const {updateFeedbackToStore, getFeedbackFromStore} = require('./firestoreRepository');
const {publishMessage } =  require('./pubsubManager');
const {analyzeFeedbackSentiment} = require('./sentimentAnalyzer');


// App
const app = express();
app.use(express.json()); //Used to parse JSON bodies
app.use(express.urlencoded()); //Parse URL-encoded bodies

app.get('/', (req, res) => {
    res.send('OK');
   
})

app.post('/', async function (req, res) {
    
    //1...Parse the message and extract feedbackId
    console.log('1...Parsing the received message and extracting feedbackId');
    const message = JSON.parse(Buffer.from(req.body.message.data, 'base64')
      .toString('utf-8'));
    console.log(`Received message:`, message);

    // Ignore invalid messages (right now, there's nothing else we could do
    // with them).
    if (_.isNil(message.feedbackId)) {
        console.log(`Invalid message received. Ignoring.`);
        res.status(200).send();
        return;
      }

    try {
  
        // If message is valid, get feedback out of Firestore.
        // (https://firebase.google.com/docs/firestore/query-data/get-data#node.js)
        const feedbackId = message.feedbackId;
        console.log('Parsed Feedback Id :', feedbackId);

        //2...Read Feedback Data from FireStore
        console.log('2...Reading Feedback Data from FireStore');
        const feedbckObj = await getFeedbackFromStore(feedbackId)

        //3....Analyze Sentiments using natural language API
        console.log('3...Analyzing Sentiments using natural language API');
        const sentimentResult = await analyzeFeedbackSentiment(feedbckObj);
        console.log(`Successfully analyzed sentiments`);

        //4.... update firestore with the sentiments result
        console.log('4...updating firestore with the sentiments result');
        const updatedFeedbackId = await updateFeedbackToStore(feedbackId, sentimentResult );
        console.log('Successfully updated sentiment to firestore with ID: ',updatedFeedbackId);

        //5...publish to mesage to the topic feedback-classified 
        console.log('5...publish to mesage to the topic feedback-classified');     
        const msg = {
            classifiedFeedbackId: updatedFeedbackId,
        };
        const messageId = await publishMessage(TOPIC_NAME_FEEDBACK_CLASSIFIED, msg);
        console.error(`Published message to ${TOPIC_NAME_FEEDBACK_CLASSIFIED} with id ${messageId}`);

        res.status(200).send();
   
    }catch(err){
       console.log(`Error processing message:`, err);
        //Send 200 (not 500) in case of error because right now we don't have a way to handle
        //loops caused by Pub/Sub re-sending messages forever.
       res.status(200).send();
       return;
    }
   
});

app.listen(config.port, () => {
    console.log(`analysis-func app cicd listening 🚀at http://localhost:${config.port}`)
});
