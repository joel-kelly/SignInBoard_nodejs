var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var GoogleSpreadsheet = require('google-spreadsheet');

//Start NodeJS 
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



//Set up Google Spreadsheet table
// Google Spreadsheet Credentials
var creds = require('./client_secret.json');
 
// Create a document object using the ID of the spreadsheet - obtained from its URL.
var doc = new GoogleSpreadsheet('1XhFDcj4bgYa2-XTHXaedQVnEye-oROtaa4DfynJdCsY');

//Create a socket connection- query the db and emit it
io.on('connection', function (socket) {

    console.log('a client connected');

// Authenticate with the Google Spreadsheets API.
doc.useServiceAccountAuth(creds, function (err) {
 
  // Get all of the rows from the spreadsheet.
  doc.getRows(1, function (err, rows) {
      //console.log('Data received from Db:\n');
      //console.log(rows);
	  socket.emit('showrows',rows);
	});
  });

  
//Click handling  
   socket.on('clicked', function(person) {

		console.log(person);
		
		//update GS IN/OUT status to reflect change 
		doc.getCells(1,{
			'min-col': 3,
			'max-col': 3,
			'return-empty': true
			}, function(err, cells) {
								var cell = cells[person.id];
								//checkbox status is either blank (visually indicating OUT) or checked (visually indicating IN)							
								      if(cell == "checked"){
									  cell.setValue('',function(err) {
												  if(err) {
													console.log(err);
												  }
												});
									  }else{
										  cell.setValue('checked',function(err) {
													  if(err) {
														console.log(err);
													  }
													});										  
									  }
			});
									  
		 
		
    });	//click handling
  
  
  
});	// io.on connection

