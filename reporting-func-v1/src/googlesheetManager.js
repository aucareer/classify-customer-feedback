'use strict';

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

const updateGoogleSheet = async (feedback) => {

  if(!feedback) {
    const error = new ReferenceError("feedback data not defined");
    console.error('feedback data not presesnt : ', error);
    throw err;
  }
      
  try {
        const valueRows = [];
        valueRows.push(feedback);
       
        const messge = await sheetHelper.syncAppend(Model.id,valueRows);
        console.log('Successfully updated feedback to google sheet message ', messge);
      
    }catch(err){
      console.error('Error occured while updating google sheet : ', err);
      throw err;
    }
  }

  module.exports = {updateGoogleSheet};