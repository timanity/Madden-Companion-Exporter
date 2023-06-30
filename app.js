const express = require('express');
const admin = require('firebase-admin');
const app = express();

const serviceAccount = require("./dnvrml-firebase-adminsdk-4324d-ed280e5d01.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

app.set('port', (process.env.PORT || 3001));

app.get('*', (req, res) => {
  res.send('Madden Companion Exporter');
});

app.post('/:username/:platform/:leagueId/leagueteams', (req, res) => {
  console.log('Received request at /leagueteams');
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', async () => {
    console.log('Received body at /leagueteams:', body);
    const { leagueTeamInfoList: teams } = JSON.parse(body);
    const {params: { username, leagueId }} = req;

    for(let team of teams) {
      const teamRef = db.collection(`data/${username}/${leagueId}/teams`).doc(`${team.teamId}`);
      await teamRef.set(team);
    }

    res.sendStatus(200);
  });
});

app.post('/:username/:platform/:leagueId/standings', (req, res) => {
  console.log('Received request at /standings');
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', async () => {
    console.log('Received body at /standings:', body);
    const { teamStandingInfoList: teams } = JSON.parse(body);
    const {params: { username, leagueId }} = req;

    for(let team of teams) {
      const teamRef = db.collection(`data/${username}/${leagueId}/teams`).doc(`${team.teamId}`);
      await teamRef.set(team);
    }

    res.sendStatus(200);
  });
});

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

app.post('/:username/:platform/:leagueId/week/:weekType/:weekNumber/:dataType', (req, res) => {
  console.log('Received request at /week');
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', async () => {
    console.log('Received body at /week:', body);
    const {params: { username, leagueId, weekType, weekNumber, dataType }} = req;
    const statsPath = `data/${username}/${leagueId}/stats`;

    switch (dataType) {
      case 'schedules':
      case 'teamstats':
      case 'defense':
        const property = `player${capitalizeFirstLetter(dataType)}StatInfoList`;
        const stats = JSON.parse(body)[property];

        for(let stat of stats) {
          const weekRef = db.collection(`${statsPath}/${weekType}/${weekNumber}/${stat.teamId}/player-stats`).doc(`${stat.rosterId}`);
          await weekRef.set(stat);
        }
        break;
    }

    res.sendStatus(200);
  });
});

app.listen(app.get('port'), function () {
  console.log('Server started on port ' + app.get('port'));
});
