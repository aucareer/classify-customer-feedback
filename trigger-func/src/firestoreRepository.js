'use strict';

const Firestore = require('@google-cloud/firestore');
const {publishMessage } =  require('./pubsubManager');

const TOPIC_FEEDBACK_CREATED = "feedback-created";
const projectId = process.env.PROJECT_ID || "customer-feedback-1";

// const firestoreCredentials = {
//     client_email: clientEmail,
//     private_key: authKey
// };

// const db = new Firestore({
//     projectId: projectId,
//     keyFilename: 'config/fstore-key.json',
//  });

 const db = new Firestore();
 console.log("db.....>>", db);
 
 const persistFeedbackToStore = async (feedbackText) => {

   const feedback = {
    createdAt: new Date(Date.now()).toISOString(),
    feedback: feedbackText,
    classified: false,
    classifiedAt: new Date(Date.now()).toISOString(),
    sentimentScore: -1,
    sentimentMagnitude: -1
  };

  try {
    const res = await db.collection('feedbacks').add(feedback);
    console.log('Successfully perisisted feedback to firestore with ID: ', res.id);
    feedback.docId = res.id;
    const feedbackIdObj = {};
    feedbackIdObj.feedbackId = res.id;
    const messageId = await publishMessage(TOPIC_FEEDBACK_CREATED, feedbackIdObj);
    return messageId;
  }catch(err){
    console.error('Error occured while persisting feedback to firestore: ', err);
    throw err;
  }
}

module.exports = {persistFeedbackToStore};