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
		//Send the list of people from GS	
		doc.getRows(1, {orderby:'name'}, function (err, rows) {
			socket.emit('showrows',rows);
		});
  });

  
//Listen for checkbox click emissions
socket.on('clicked', function(person) {	
		console.log("server detected click");

		//update GS IN/OUT status to reflect change 
		doc.getCells(1,{
			'min-col': 3,
			'max-col': 3,
			'return-empty': true
			}, function(err, cells) {
								var cell = cells[person.id];

								//checkbox status is either blank (visually indicating OUT) or checked (visually indicating IN)							
								      if(cell.value == "checked"){
										  console.log(person.name + " signing OUT");
									  cell.setValue('',function(err) {
												  if(err) {
													console.log(err);
												  }
												});
									  }
									  else if(cell.value == ''){
										   console.log(person.name + " signing IN");
										  cell.setValue('checked',function(err) {
													  if(err) {
														console.log(err);
													  }
													});										  
									  }
			});//end update GS
									  
		//tell all other clients to update the change in status
		socket.broadcast.emit('clicked2', person);
		
    });	//end listen for click handling
  
	//Listen for new user emissions
	// This is currently what I believe is called 'callback hell', but it works
	
	socket.on('add', function(person) {
		console.log("add socket detected");
	
		doc.getRows(1, function (err, rows) {	//get the current list of people
				
			//figure out  the new person's employeeid, checkbox (default IN) & status 
			var emp =rows.length + 1;
			console.log("Adding new employee, number: " + emp);
			person.employeeid = emp;
			person.firstaid = "no";
			person.checkbox = "checked";
			var foo = person.employeeid + 1;
			person.status ='=if(C' + foo +'="checked","IN","OUT")';
			
			
			//add the new person to the GS db
			doc.addRow(1, person, function(err, rows) {
				if(err) {
					console.log(err);
				}				
				//update all clients with the new list of people
				io.sockets.emit('reload',{});

				
			});	
		});


	});	//end listen for new user 
	
});	// io.on connection

