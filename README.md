# SignInBoard_nodejs

A simple cloud-based in/out board using Google Spreadsheets.

TO DO:

- Fix bug from adding new users
- Integrate with Heroku
- Make pretty logo
- Make pretty on screen keyboard
- First Aid attendant functionality
- Password protect access + set cookie
- *Launch alpha?*
- Figure out how to test for disconnect failures
	- Current thinking: store cookie on client, periodically compare cookie to server. 
	- If client can't connect to server, switch to off-line mode
- Document project and train Erik/Brian/Sheila/etc

COMPLETED:
- Fix Add User process:
	- Erase form upon submission- COMPLETE
	- Close Accordion- COMPLETE
- Figure out how to keep multiple clients in sync?- COMPLETE