var GoogleSpreadsheet = require('google-spreadsheet');
var creds = require('./client_secret.json');
 
// Create a document object using the ID of the spreadsheet - obtained from its URL.
var doc = new GoogleSpreadsheet('1XhFDcj4bgYa2-XTHXaedQVnEye-oROtaa4DfynJdCsY');
 
// Authenticate with the Google Spreadsheets API.
doc.useServiceAccountAuth(creds, function (err) {
 
  // Get all of the rows from the spreadsheet.
  doc.getRows(1, function (err, rows) {
    console.log(rows);
  });
});
