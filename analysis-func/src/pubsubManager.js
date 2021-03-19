'use strict';

const {PubSub} = require('@google-cloud/pubsub');

const pubSubClient = new PubSub();

async function publishMessage(topicName, message) {
   
    try {
       
        const data = JSON.stringify(message);
        console.log("data: ", data);
        const dataBuffer = Buffer.from(data);
        
        const messageId = await pubSubClient.topic(topicName).publish(dataBuffer);
        console.log(`Message ${messageId} published.`);
        return messageId;
        
    } catch (error) {
      console.error(`Received error while publishing: ${error.message}`);
      throw error;
    }
  }

  module.exports = {publishMessage};