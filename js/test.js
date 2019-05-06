var SERVER_BASE_URL = 'https://telemedicineapp.herokuapp.com/';
fetch(SERVER_BASE_URL + '/session').then(function(res) {
  return res.json()
}).then(function(res) {
  apiKey = res.apiKey;
  sessionId = res.sessionId;
  token = res.token;
  initializeSession();
}).catch(handleError);

// Handling all of our errors here by alerting them
function handleError(error) {
  if (error) {
    alert(error.message);
  }
}

function initializeSession() {
  var session = OT.initSession(apiKey, sessionId);
//   let connectionsBeforeUs = 0;
//   session.on('connectionCreated', (event) => {
//   if (event.connection.connectionId !== session.connection.connectionId &&
//      event.connection.creationTime < session.connection.creationTime) {
//     // There is a new connection and they got here before us
//     connectionsBeforeUs += 1;
//     if (connectionsBeforeUs >= 2) {
//       // We should leave there are 2 or more people already here before us
//       alert('disconnecting this room is already full');
//       session.disconnect();
//     }
//   }
// });
session.connect(token);

  // Subscribe to a newly created stream
  session.on('streamCreated', function(event) {
    session.subscribe(event.stream, 'subscriber', {
      insertMode: 'append',
      width: '100%',
      height: '100%'
    }, handleError);
  });

  // Create a publisher
  var publisher = OT.initPublisher('publisher', {
    insertMode: 'append',
    width: '100%',
    height: '100%'
  }, handleError);

  // Connect to the session
  session.connect(token, function(error) {
    // If the connection is successful, initialize a publisher and publish to the session
    if (error) {
      handleError(error);
    } else {
      session.publish(publisher, handleError);
    }
  });
}