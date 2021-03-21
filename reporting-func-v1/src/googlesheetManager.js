'use strict';

const { google, sheets_v4 } = require('googleapis');

const updateGoogleSheet = async (sheetId, feedback) => {

  if(!feedback) {
    const error = new ReferenceError("feedback data not defined");
    console.error('feedback data not presesnt : ', error);
    throw err;
  }
      
  try {

    const sheets = new sheets_v4.Sheets({
      auth: await (new google.auth.GoogleAuth({
        scopes: [
          'https://www.googleapis.com/auth/spreadsheets',
        ],
      })).getClient(),
    });

    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      // using the sheet name for range will append to the bottom of the sheet
      range: 'Data',
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      valueInputOption:'USER_ENTERED',
      resource: {
        // Each value is a row, which is an array of cells left to right
        values: [
          [
            feedback.createdAt,
            feedback.feedback,
            feedback.classified,
            feedback.classifiedAt,
            feedback.sentimentScore,
            feedback.sentimentMagnitude,
            'v1'
          ],
        ],
      },
    });
    console.log('Appended classified feedback row to sheet.');
        // const valueRows = [];
        // valueRows.push(feedback);
       
        // const sheetHelper  = new SheetsHelper();
        // const messge = await sheetHelper.syncAppend(sheetId,valueRows);
        // console.log('Successfully updated feedback to google sheet message ', messge);
      
    }catch(err){
      console.error('Error occured while updating google sheet : ', err);
      throw err;
    }
  }
  module.exports = {updateGoogleSheet};