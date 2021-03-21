const express = require('express');
const app = express();
app.use(express.json()); //Used to parse JSON bodies
app.use(express.urlencoded()); //Parse URL-encoded bodies

const config = {
  // Cloud Run provides port via env var
  port: process.env.PORT || 8080,
};

const {SheetsHelper} = require('./sheets');

const sheetHelper  = new SheetsHelper();

let ModelGCP =   {
  id: '16_gIqUec7KHlVEkCU8Q30tWGr9tb8eAupMtvfvLFBJ8',
  sheetId: 703163549,
  name: 'test-feedback-2'
};

let Model =   {
  id: '1Ka1wYgSHgTEUaqcxIi64rqmvDy2hwRelxdHFXjGnc3M',
  name: 'Customer Feedback'
};

app.get('/create', async function(req, res) {

  const sheetModel = await sheetHelper.createSpreadsheet("test-feedback-2");
  Model.id = sheetModel.id;
  Model.sheetId = sheetModel.sheetId;
  Model.name = sheetModel.name;
  console.log('Model  ', Model);
  res.send('OK');
  
})

app.get('/update', async function(req, res) {

  const feedback = {
   createdAt: new Date(Date.now()),//.toISOString(),
   feedback: "This life sucks",
   classified: 'false',
   classifiedAt: new Date(Date.now()),//.toISOString(),
   sentimentScore: -1,
   sentimentMangnitude: -1,
   version: 'v1'
  };
  const feedbacks = [];
  feedbacks.push(feedback);
  feedbacks.push(feedback);
  await sheetHelper.syncAppend(ModelGCP.id,feedbacks );
  res.send('OK');
  
})

app.get('/read', async function(req, res) {

  await sheetHelper.readSpreadsheet(ModelGCP.id);
  res.send('OK');
   
})

app.listen(config.port, () => {
    console.log(`analysis-func app listening 🚀at http://localhost:${config.port}`)
});