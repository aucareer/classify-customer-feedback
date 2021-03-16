'use strict';

const Firestore = require('@google-cloud/firestore');
const {publishMessage } =  require('./pubsubManager');

const projectId = process.env.PROJECT_ID || "customer-feedback-1";

const db = new Firestore();

const updateFeedbackToStore = async (feedback) => {

  if(!feedback) {
      const error = new ReferenceError("feedback data not defined");
      console.error('feedback data not presesnt : ', error);
      throw err;
    }
    
  try {

      const documentId = feedback.docId;
      console.log('Document Id : ', documentId);

      await db.collection('feedbacks').doc(documentId).update(feedback);
      console.log('Successfully updated feedback to firestore with ID: ', documentId);
    
  }catch(err){
    console.error('Error occured while updating feedback to firestore: ', err);
    throw err;
  }
}

module.exports = {updateFeedbackToStore};