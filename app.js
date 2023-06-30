const express = require('express');
const admin = require('firebase-admin');
const serviceAccount = require("./dnvrml-firebase-adminsdk-4324d-ed280e5d01.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const app = express();

app.set('port', (process.env.PORT || 3001));

app.get('*', (req, res) => {
  res.send('Madden Companion Exporter');
});

app.post('/:username/:platform/:leagueId/standings', (req, res) => {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', async () => {
    console.log(body); // Added debug log
    const { teamStandingInfoList: teams } = JSON.parse(body);
    const {params: { username, leagueId }} = req;

    for(let team of teams) {
      const teamRef = db.collection(`data/${username}/${leagueId}/teams`).doc(`${team.teamId}`);
      await teamRef.set(team)
        .then(() => console.log(`Wrote team ${team.teamId} to Firestore`)) // Log successful writes
        .catch(err => console.error(`Error writing team ${team.teamId} to Firestore: ${err}`)); // Log errors
    }

    res.sendStatus(200);
  });
});

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

app.post('/:username/:platform/:leagueId/week/:weekType/:weekNumber/:dataType', (req, res) => {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', async () => {
    console.log(body); // Added debug log
    const {params: { username, leagueId, weekType, weekNumber, dataType }} = req;
    const statsPath = `data/${username}/${leagueId}/stats`;
    const property = `player${capitalizeFirstLetter(dataType)}StatInfoList`;
    const stats = JSON.parse(body)[property];

    for(let stat of stats) {
      const weekRef = db.collection(`${statsPath}/${weekType}/${weekNumber}/${stat.teamId}/player-stats`).doc(`${stat.rosterId}`);
      await weekRef.set(stat)
        .then(() => console.log(`Wrote stat for player ${stat.rosterId} to Firestore`)) // Log successful writes
        .catch(err => console.error(`Error writing stat for player ${stat.rosterId} to Firestore: ${err}`)); // Log errors
    }

    res.sendStatus(200);
  });
});

app.listen(app.get('port'), function () {
  console.log('Server started on port ' + app.get('port'));
});
