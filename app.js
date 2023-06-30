const express = require('express');
const admin = require('firebase-admin');
const app = express();

const serviceAccount = require("./dnvrml-firebase-adminsdk-4324d-ed280e5d01.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const firestore = admin.firestore();

app.set('port', (process.env.PORT || 3001));

app.get('*', (req, res) => {
    res.send('Madden Companion Exporter');
});

app.post('/:username/:platform/:leagueId/leagueteams', async (req, res) => {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', async () => {
        const { leagueTeamInfoList: teams } = JSON.parse(body);
        const {params: { username, leagueId }} = req;

        for (let team of teams) {
            const teamRef = firestore.doc(`data/${username}/${leagueId}/teams/${team.teamId}`);
            await teamRef.set(team);
        }

        res.sendStatus(200);
    });
});

app.post('/:username/:platform/:leagueId/standings', async (req, res) => {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', async () => {
        const { teamStandingInfoList: teams } = JSON.parse(body);
        const {params: { username, leagueId }} = req;

        for(let team of teams) {
            const teamRef = firestore.doc(`data/${username}/${leagueId}/teams/${team.teamId}`);
            await teamRef.set(team);
        }

        res.sendStatus(200);
    });
});

app.post('/:username/:platform/:leagueId/week/:weekType/:weekNumber/:dataType', async (req, res) => {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', async () => {
        const property = `player${capitalizeFirstLetter(req.params.dataType)}StatInfoList`;
        const items = JSON.parse(body)[property];
        const {params: { username, leagueId, weekType, weekNumber }} = req;

        for(let item of items) {
            const itemRef = firestore.doc(`data/${username}/${leagueId}/${weekType}/${weekNumber}/teams/${item.teamId}/player-stats/${item.rosterId}`);
            await itemRef.set(item);
        }

        res.sendStatus(200);
    });
});

app.listen(app.get('port'), function () {
    console.log('Server started on port ' + app.get('port'));
});

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
