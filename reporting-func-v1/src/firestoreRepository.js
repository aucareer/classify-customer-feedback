'use strict';

const Firestore = require('@google-cloud/firestore');
const projectId = process.env.PROJECT_ID || "customer-feedback-1";

const db = new Firestore();

const updateFeedbackToStore = async (feedbackId,sentimentResult) => {

  if(!sentimentResult) {
      const error = new ReferenceError("sentimentResult data not defined");
      console.error('sentimentResult data not presesnt : ', error);
      throw err;
    }
    
  try {
      await db.collection('feedbacks').doc(feedbackId).update({
        classified:true,
        classifiedAt: new Date().toISOString(),
        sentimentScore: sentimentResult.score,
        sentimentMagnitude: sentimentResult.magnitude,
      }, { merge: true });
      console.log('Successfully updated feedback to firestore with ID: ', feedbackId);
      return feedbackId;
  }catch(err){
    console.error('Error occured while updating feedback to firestore: ', err);
    throw err;
  }
}

const getFeedbackFromStore = async(feedbackId) => {

  if(!feedbackId) {
    const error = new ReferenceError("feedback id not defined");
    console.error('feedback data not presesnt : ', error);
    throw err;
  }
  const feedbackDoc = await db.collection('feedbacks').doc(feedbackId).get();
  
  if (!feedbackDoc.exists) {
      const errorMessage = `No feedback doc exists with ID ${feedbackId}.`;
      console.error(errorMessage);
      throw new Error(errorMessage);
   }

   const feedbackObj = feedbackDoc.data();
   return feedbackObj;
}

module.exports = {updateFeedbackToStore,getFeedbackFromStore};