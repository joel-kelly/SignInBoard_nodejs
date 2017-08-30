var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var GoogleSpreadsheet = require('google-spreadsheet');
var async = require('async');


app.get('/', function(req, res){
  res.sendfile('test.html');
});
http.listen(3000, function(){
  console.log('listening on *:3000');
});

//Set up Google Spreadsheet table
// Google Spreadsheet Credentials
var GoogleSpreadsheet = require('google-spreadsheet');
var creds = require('./client_secret.json');
 
// Create a document object using the ID of the spreadsheet - obtained from its URL.
var doc = new GoogleSpreadsheet('1XhFDcj4bgYa2-XTHXaedQVnEye-oROtaa4DfynJdCsY');
 var people = [];



io.on('connection', function (socket) {

    console.log('a client connected');

// Authenticate with the Google Spreadsheets API.
doc.useServiceAccountAuth(creds, function (err) {
 
  // Get all of the rows from the spreadsheet.
  doc.getRows(1, function (err, rows) {
      console.log('Data received from Db:\n');
      console.log(rows);
	  socket.emit('showrows',rows);
	});
  });
});	
