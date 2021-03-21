'use strict';
const language = require('@google-cloud/language');

async function stubFeedbackSentiment(feedback) {
   
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

  async function analyzeFeedbackSentiment(feedback) {

   console.log(`started sentiment analysis-------`)
   try {

        // Instantiates a client
      const client = new language.LanguageServiceClient();
      // The text to analyze
      const text = feedback.feedback;
      console.log(`Feedback Text ${text}`)

      const document = {
         content: text,
         type: 'PLAIN_TEXT',
      };

      // Detects the sentiment of the text
      const [result] = await client.analyzeSentiment({document: document});
      const sentiment = result.documentSentiment;
     
      const sentimentResult = {
        score:sentiment.score,
        magnitude: sentiment.magnitude
      }

      console.log(`Sentiment Result: ${sentimentResult.score} :  ${sentimentResult.mangnitude}`);
      console.log(`succesfully completed sentiment analysis-------`);
      return sentimentResult;
      
      } catch (error) {
        console.error(`Received error while analyzing feedback sentiment: ${error.message}`);
        throw error;
      }
  }

  module.exports = {analyzeFeedbackSentiment};