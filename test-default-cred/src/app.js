'use strict';

const express = require('express');
const _ = require('lodash');

const config = {
    // Cloud Run provides port via env var
    port: process.env.PORT || 8080,
};

// App
const app = express();
app.use(express.json()); //Used to parse JSON bodies
app.use(express.urlencoded()); //Parse URL-encoded bodies

const {GoogleAuth} = require('google-auth-library');
const {google} = require('googleapis');

/**
* Instead of specifying the type of client you'd like to use (JWT, OAuth2, etc)
* this library will automatically choose the right client based on the environment.
*/
async function main() {
  
  const auth = new GoogleAuth({
    scopes:  'https://www.googleapis.com/auth/spreadsheets'
  });

  const client = await auth.getClient();
  const projectId = await auth.getProjectId();
  google.options({
   auth: client
  });
  console.log("authclient ", client);
  const {SheetsHelper} = require('./sheets');
  const sheetHelper  = new SheetsHelper();
  const message = await sheetHelper.readSpreadsheet("1Ka1wYgSHgTEUaqcxIi64rqmvDy2hwRelxdHFXjGnc3M");
  console.log(message);
}



app.get('/', async (req, res) => {

  try {
    await main().catch(console.error);
  }catch(err){
    console.error(`error in main ${err}`);
  }
  res.send('OK');
    
})

app.post('/', async function (req, res) {
    
    
    if (!req.body) {
      const msg = 'no Pub/Sub message received';
      console.error(`error: ${msg}`);
      res.status(400).send(`Bad Request: ${msg}`);
      return;
    }

    if (!req.body.message) {
      const msg = 'invalid Pub/Sub message format';
      console.error(`error: ${msg}`);
      res.status(400).send(`Bad Request: ${msg}`);
      return;
    }
    
    console.log( req.body);
    const pubSubMessage = req.body.message;

    const feedback_str = Buffer.from(pubSubMessage.data, 'base64').toString();
    console.log(`feedback_str ${feedback_str}!`);
    const feedback_obj = JSON.parse(feedback_str);
    console.log(`Message Feedback Data ${feedback_obj}!`);
    console.log(`Message ID ${pubSubMessage.messageId}!`);

    try {

      
       console.log(`Successfully updated googel sheet`);
        
       res.status(204).send();
   
    }catch(err){
       res.status(500).send(`OOps something happend while updating google sheets.`);
       return;
    }
   
});

app.listen(config.port, () => {
    console.log(`analysis-func app listening 🚀at http://localhost:${config.port}`)
});
