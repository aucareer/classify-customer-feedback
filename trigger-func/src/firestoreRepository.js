'use strict';

const Firestore = require('@google-cloud/firestore');
const {publishMessage } =  require('./pubsubManager');

const TOPIC_FEEDBACK_CREATED = "feedback-created";

const db = new Firestore({
    projectId: 'k8sinc-project',
    keyFilename: 'config/fstore-key.json',
  });

const persistFeedbackToStore = async (feedbackText) => {

   const feedback = {
    createdAt: new Date(Date.now()).toISOString(),
    feedback: feedbackText,
    classified: false,
    classifiedAt: new Date(Date.now()).toISOString(),
    sentimentScore: -1,
    sentimentMangnitude: -1
  };

  try {
    const res = await db.collection('feedbacks').add(feedback);
    console.log('Successfully perisisted feedback to firestore with ID: ', res.id);
    const messageId = await publishMessage(TOPIC_FEEDBACK_CREATED, feedback);

  }catch(err){
    console.error('Error occured while persisting feedback to firestore: ', err);
    throw err;
  }
}

module.exports = {persistFeedbackToStore};