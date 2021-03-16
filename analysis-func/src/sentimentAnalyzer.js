'use strict';

async function analyzeFeedbackSentiment(feedback) {
   
    try {
        console.log('start -- analyzing sentiment : ${feedback}')
        feedback.classified = true,
        feedback.sentimentScore = 100,
        feedback.sentimentMangnitude = 44,
        feedback.classifiedAt = new Date(Date.now()).toISOString();
        console.log('end - analyzed sentiment : ${feedback}')
       
    } catch (error) {
      console.error(`Received error while analyzing feedback sentiment: ${error.message}`);
      throw error;
    }
  }

  module.exports = {analyzeFeedbackSentiment};