var GoogleSpreadsheet = require('google-spreadsheet');
var async = require('async');

// spreadsheet key is the long id in the sheets URL
var doc = new GoogleSpreadsheet('1XhFDcj4bgYa2-XTHXaedQVnEye-oROtaa4DfynJdCsY');
var sheet;

async.series([
  function setAuth(step) {
    // see notes below for authentication instructions!
    var creds = require('./client_secret.json');
    // OR, if you cannot save the file locally (like on heroku)
    var creds_json = {
      client_email: 'yourserviceaccountemailhere@google.com',
      private_key: 'your long private key stuff here'
    }

    doc.useServiceAccountAuth(creds, step);
	
  },
  function getInfoAndWorksheets(step) {
    doc.getInfo(function(err, info) {
      console.log('Loaded doc: '+info.title+' by '+info.author.email);
      sheet = info.worksheets[0];
      step();
    });
  },
  function workingWithRows(step) {
    // google provides some query options
    sheet.getRows({
      orderby: 'name'
    }, function( err, rows ){
      console.log('Read '+rows.length+' rows');
	  rows.forEach(function (entry) {
		console.log('Name:',entry.name);
	});
      step();
    });
  },
  
], function(err){
    if( err ) {
      console.log('Error: '+err);
    }
});

console.log('End of script');