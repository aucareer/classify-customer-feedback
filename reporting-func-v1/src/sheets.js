const {google} = require('googleapis');

const scopes = [
    'https://www.googleapis.com/auth/spreadsheets',
];

async function init () {

    const auth = new google.auth.GoogleAuth({
      // Scopes can be specified either as an array or as a single, space-delimited string.
      scopes: scopes
    });
    const authClient = await auth.getClient();
    if(authClient) {
        console.log('authClient created successfully');
    }else {
        console.log('failed to create authclient');
    }

    // set auth as a global default
    google.options({
    auth: authClient
  });
    
}

const defaultAppCredentials = process.env.DEFAULT_APP_CREDENTIALS || false;
console.log('procee.env.DEFAULT_APP_CREDENTIALS ', defaultAppCredentials);
if(!defaultAppCredentials) {

    const auth = new google.auth.GoogleAuth({
    // Scopes can be specified either as an array or as a single, space-delimited string.
    //keyFile: 'src/fstore-key.json',
    scopes: scopes
    });
    // set auth as a global default
    google.options({
        auth: auth
    });
} else {
     init().catch(console.error);
}
  

const COLUMNS = [
  { field: 'createdAt', header: 'Created Date' },
  { field: 'feedback', header: 'Feedback Text'},
  { field: 'classified', header: 'Classified' },
  { field: 'classifiedAt', header: "Calssified Date" },
  { field: 'sentimentScore', header: 'Sentiment Score' },
  { field: 'sentimentMagnitude', header: 'Sentiment Magnitude' },
  { field: 'version', header: 'Version'}
];

class SheetsHelper {

  constructor() {

    this.sheetService = null;
  }

  async init() {
    
    this.sheetService = new sheets_v4.Sheets({
      auth: await (new google.auth.GoogleAuth({
        scopes: [
          'https://www.googleapis.com/auth/spreadsheets',
        ],
      })).getClient(),
    });
  }
    
   /**
   * Creates a test Spreadsheet.
   * @return {Model} Details about the spredsheet craeted.
   */
  async createSpreadsheet(title) {

    try {
      const request = {
        resource: {
          properties: {
            title: title
          },
          sheets: [
            {
              properties: {
                title: 'Data',
                gridProperties: {
                  columnCount: 7,
                  frozenRowCount: 1
                  }
                }
              },
            // TODO: Add more sheets.
            ]
          }
        };

        const response = await this.sheetService.spreadsheets.create(request);
        const spreadsheet = response.data;
        console.log('response....',spreadsheet);
        // Add header rows.
        var dataSheetId = spreadsheet.sheets[0].properties.sheetId;
        var requests = [
            this.buildHeaderRowRequest(dataSheetId),
        ];
        const model = {
          id: spreadsheet.spreadsheetId,
          sheetId: spreadsheet.sheets[0].properties.sheetId,
          name: spreadsheet.properties.title
        };
        console.log("Model   ", model)
        // TODO: Add pivot table and chart.
        const request2 = {
          spreadsheetId: spreadsheet.spreadsheetId,
          resource: {
            requests: requests
          }
        };
        const spreadsheetUpdated = await this.sheetService.spreadsheets.batchUpdate(request2);
        console.log('Successfully created a new spreadsheet....');
        return model;
      } catch(err){
        console.error(`error occured while creating spreadsheet : ${err}`)
      }
    };

    
    buildHeaderRowRequest(sheetId) {
      var cells = COLUMNS.map(function(column) {
        return {
          userEnteredValue: {
            stringValue: column.header
          },
          userEnteredFormat: {
            textFormat: {
              bold: true
            }
          }
        }
      });
      return {
        updateCells: {
          start: {
            sheetId: sheetId,
            rowIndex: 0,
            columnIndex: 0
          },
          rows: [
            {
              values: cells
            }
          ],
          fields: 'userEnteredValue,userEnteredFormat.textFormat.bold'
        }
      };
    };

    /**
    * Reads Spreadsheet.
    * @return Message that reading is done
    */
    async readSpreadsheet(spreadsheetId) {

      console.log(`start ....readTestSpreadsheet with id ${spreadsheetId}`);
      try {
        const response = await this.sheetService.spreadsheets.values.get({
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
    };

   /**
   * Sync the feedback to a spreadsheet.
   * @param  {string}   spreadsheetId The ID of the spreadsheet.
   * @param  {string}   sheetId       The ID of the sheet.
   * @param  {Array}    feedbacks     The list of feedbacks.
   */
  async sync (spreadsheetId, sheetId, feedbacks) {
    var requests = [];
    // Resize the sheet.
    requests.push({
      updateSheetProperties: {
        properties: {
          sheetId: sheetId,
          gridProperties: {
            rowCount: feedbacks.length + 1,
            columnCount: COLUMNS.length
          }
        },
      fields: 'gridProperties(rowCount,columnCount)'
    }
    });

    // Set the cell values.
    requests.push({
      updateCells: {
        start: {
          sheetId: sheetId
          // rowIndex: 1,
          // columnIndex: 0
        },
        rows: this.buildRowsForFeedbacks(feedbacks),
        fields: '*'
      }
    });

    // Send the batchUpdate request.
    var request = {
      spreadsheetId: spreadsheetId,
      resource: {
        requests: requests
      }
    };

    try {
      await this.sheetService.spreadsheets.batchUpdate(request);
      console.log('successfully updated feedback data to sheet');
      return "Success - Updated sheet";
    }catch(err){
      console.error(`Error while adding feedback to sheet : ${err}`);
      throw err;
    }

  };
   
  /**
   * Sync the feedback to a spreadsheet. append the feedback to teh existing grid
   * @param  {string}   spreadsheetId The ID of the spreadsheet.
   * @param  {Array}    feedbacks     The list of feedbacks.
   */
  async syncAppend (spreadsheetId, feedbacks) {
    var requests = [];
    let values = this.buildValuesForFeedbacks(feedbacks);
    console.log('values : ', values);
    let resource = {
      values,
    };
    const range = 'Data';
    const valueInputOption = 'USER_ENTERED';
    const insertDataOption = 'INSERT_ROWS';
   
    try {
        console.log('this.sheetsService : ', this.sheetsService);
        const result = await this.sheetService.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption,
        insertDataOption,
        resource,
      });
      //const response = (await sheets.spreadsheets.values.append(request)).data;
      console.log(`${result.data.spreadsheetId}  ${result.data.tableRange} ${result.data.updates.updatedRange}.`);
      return "Success - Appended sheet";
    }catch(err){
      console.error(`Error while adding feedback to sheet : ${err}`);
      throw err;
    }
  };
   
    /**
 * Builds an array of RowData from the orders provided.
 * @param  {Array} feedbacks The feedbacks.
 * @return {Array}        The RowData.
 */
  buildRowsForFeedbacks(feedbacks) {

  return feedbacks.map(function(feedback) {
    var cells = COLUMNS.map(function(column) {
      switch (column.field) {
        case 'createdAt':
          return {
            userEnteredValue: {
              stringValue: feedback.createdAt
            }
          };
          break;
        case 'feedback':
          return {
            userEnteredValue: {
              stringValue: feedback.feedback
            }
          };
          break;
        case 'classified':
          return {
            userEnteredValue: {
              stringValue: feedback.classified
            }
          };
          break;
          case 'classifiedAt':
            return {
              userEnteredValue: {
                stringValue: feedback.classifiedAt
              }
            };
          break;
          case 'sentimentScore':
            return {
              userEnteredValue: {
                numberValue: feedback.sentimentScore
              }
            };
          break;
          case 'sentimentMagnitude':
            return {
              userEnteredValue: {
                numberValue: feedback.sentimentMagnitude
              }
            };
          break;
          case 'version':
            return {
              userEnteredValue: {
                stringValue: 'v2'
              }
            };
          break;
        default:
          return {
            userEnteredValue: {
              stringValue: feedback[column.field].toString()
            }
          };
      }
    });
    return {
      values: cells
    };
  });
}

/**
 * Build the array of values 
 *  * @param {
 * } feedbacks 
 * @returns feedbackRows
 */
buildValuesForFeedbacks(feedbacks) {
  const feedbackRows = [];
  feedbacks.forEach(function(feedback) {
    const feedbackRow = [];
    feedbackRow.push(feedback.createdAt);
    feedbackRow.push(feedback.feedback);
    feedbackRow.push(feedback.classified);
    feedbackRow.push(feedback.classifiedAt);
    feedbackRow.push(feedback.sentimentScore);
    feedbackRow.push(feedback.sentimentMangnitude);
    feedbackRow.push('v1');
    feedbackRows.push(feedbackRow);
  });
  
  return feedbackRows;
}

}

module.exports = {SheetsHelper};
  


