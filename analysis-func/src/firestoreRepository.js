'use strict';

const Firestore = require('@google-cloud/firestore');
const {publishMessage } =  require('./pubsubManager');

const TOPIC_FEEDBACK_CREATED = "feedback-created";
const projectId = process.env.PROJECT_ID || "k8sinc-project";

const db = new Firestore();
console.log("db.....>>", db);
 
const updateFeedbackToStore = async (feedback) => {

  if(feedback){
    feedback.classified = true;
    feedback.sentimentScore = 100,
    feedback.sentimentMangnitude = 44,
    classifiedAt = new Date(Date.now()).toISOString()
  }
   
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