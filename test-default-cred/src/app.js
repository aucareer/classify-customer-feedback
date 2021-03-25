'use strict';

const express = require('express');
const _ = require('lodash');

const config = {
    // Cloud Run provides port via env var
    port: process.env.PORT || 8080,
    apikey: process.env.API_KEY || "",
    useDefaultCrednetails: process.env.IS_DEFAULT_CRED || false
};

// App
const app = express();
app.use(express.json()); //Used to parse JSON bodies
app.use(express.urlencoded()); //Parse URL-encoded bodies

const { google, sheets_v4 } = require('googleapis');
/**
* Instead of specifying the type of client you'd like to use (JWT, OAuth2, etc)
* this library will automatically choose the right client based on the environment.
*/


async function mainWithDefaultCredentails() {
  
    // Then, call Sheets API to add the feedback as a row to the spreadsheet.
    // For the Sheets client, use the googleapis library to auto detect the
    // environment (like the Pub/Sub and Firestore clients).
    const sheets = new sheets_v4.Sheets({
      auth: await (new google.auth.GoogleAuth({
         scopes: [
          'https://www.googleapis.com/auth/spreadsheets',
        ]
      })).getClient(),
    });

   
    const spreadsheetId = "1Ka1wYgSHgTEUaqcxIi64rqmvDy2hwRelxdHFXjGnc3M";
    // https://docs.google.com/spreadsheets/d/1Ka1wYgSHgTEUaqcxIi64rqmvDy2hwRelxdHFXjGnc3M/edit?usp=sharing
    //const spreadsheetId = "16_gIqUec7KHlVEkCU8Q30tWGr9tb8eAupMtvfvLFBJ8";
    console.log(`start ....readTestSpreadsheet with id ${spreadsheetId}`);
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: spreadsheetId,
            range: 'Data',
          });

          const rows = response.data.values;
          if (rows.length === 0) {
            console.log('No data found.');
          } else {
              console.log("Rows Data ",response);
              console.log("Row.length " , rows.length);
              for (const row of rows) {
                // Print columns A and E, which correspond to indices 0 and 4.
                console.log(`${row[0]}, ${row[1]}, ${row[2]},${row[3]},${row[4]},${row[5]}, ${row[6]}`);
              }
          }
          return "Done Reading";
        }catch(err){
          console.error(`The API returned an error. ${err}`);
          throw err;
        }
}

async function mainWithAPiKey() {
  
  const sheets = new sheets_v4.Sheets({
    auth: config.apikey,
    scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
    ]
  });
  
  const spreadsheetId = "1Ka1wYgSHgTEUaqcxIi64rqmvDy2hwRelxdHFXjGnc3M";
  console.log(`start ....readTestSpreadsheet with id ${spreadsheetId}`);
  try {
      const response = await sheets.spreadsheets.values.get({
          spreadsheetId: spreadsheetId,
          range: 'Data',
        });

        const rows = response.data.values;
        if (rows.length === 0) {
          console.log('No data found.');
        } else {
            console.log("Rows Data ",response);
            console.log("Row.length " , rows.length);
            for (const row of rows) {
              // Print columns A and E, which correspond to indices 0 and 4.
              console.log(`${row[0]}, ${row[1]}, ${row[2]},${row[3]},${row[4]},${row[5]}, ${row[6]}`);
            }
        }
        return "Done Reading";
      }catch(err){
        console.error(`The API returned an error. ${err}`);
        throw err;
      }
}





app.get('/test', async (req, res) => {

  try {
    if(config.useDefaultCrednetails) {
      console.log('executing mainWithDefaultCredentails');
      await mainWithDefaultCredentails();
    }
    else {
      console.log('executing mainWithAPiKey');
      await mainWithAPiKey();
    }
  }catch(err){
    console.error(`error in main ${err}`);
  }
  res.send('OK');
    
})

app.listen(config.port, () => {
    console.log(`analysis-func app listening 🚀at http://localhost:${config.port}`)
});
