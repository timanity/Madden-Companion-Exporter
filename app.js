const express = require('express');
const admin = require('firebase-admin');
const serviceAccount = require('./dnvrml-firebase-adminsdk-4324d-ed280e5d01.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const app = express();

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response) {
  response.send('Hello World!')
});

app.post('/:username/:platform/:leagueId/standings', (req, res) => {
  console.log('Received a request for standings');
  
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', async () => {
    console.log('Request data:', body);
    const { teamStandingInfoList: teams } = JSON.parse(body);
    const {params: { username, leagueId }} = req;

    for(let team of teams) {
      const teamRef = db.collection(`data/${username}/${leagueId}/teams`).doc(`${team.teamId}`);
      await teamRef.set(team);
    }

    res.sendStatus(200);
  });
});

app.post('/:username/:platform/:leagueId/:weekType/:weekNumber/:dataType', (req, res) => {
  console.log('Received a request for week data');
  
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', async () => {
    console.log('Request data:', body);
    const { teamStatInfoList: teams } = JSON.parse(body);
    const {params: { username, leagueId, weekType, weekNumber, dataType }} = req;

    const statsPath = `data/${username}/${leagueId}/weeks/${weekType}/${weekNumber}/${dataType}`;

    for(let team of teams) {
      const teamRef = db.collection(`${statsPath}/teams`).doc(`${team.teamId}`);
      await teamRef.set(team);
    }

    if(dataType === 'player') {
      const property = `player${capitalizeFirstLetter(dataType)}StatInfoList`;
      const stats = JSON.parse(body)[property];
      console.log('Stats:', stats);

      for(let stat of stats) {
        const weekRef = db.collection(`${statsPath}/${weekType}/${weekNumber}/${stat.teamId}/player-stats`).doc(`${stat.rosterId}`);
        await weekRef.set(stat);
      }
    }

    res.sendStatus(200);
  });
});

app.listen(app.get('port'), function() {
  console.log('Server started on port ' + app.get('port'));
});

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
