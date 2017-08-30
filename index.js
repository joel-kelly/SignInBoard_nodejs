var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var GoogleSpreadsheet = require('google-spreadsheet');

// Google Spreadsheet Credentials
var creds = require('./client_secret.json');
 
// Create a document object using the ID of the spreadsheet - obtained from its URL.
var doc = new GoogleSpreadsheet('1XhFDcj4bgYa2-XTHXaedQVnEye-oROtaa4DfynJdCsY');
 
// Google Spreadsheet table is organized as follows:
//name,	inout,	contactphone,	contactemail,	emergencyphone,	emergencyname,	emergencyrelation
//NB Google's row API strips header cells to remove whitespace characters and symbols

var people = [];



 
function generateList(doc) { 
// Authenticate with the Google Spreadsheets API.
doc.useServiceAccountAuth(creds, function (err) {
	var foo = [];
  // Get all of the rows from the spreadsheet.
  doc.getRows(1, function (err, rows) {

	rows.forEach(function (entry) {
		foo.unshift(entry);
		console.log('List size is', foo.length);
	});
	  return foo;
  });
});
}
//GS code executes last?


console.log(generateList(doc));
//console.log('Outside function list size is', people.length);

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));


// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

http.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

