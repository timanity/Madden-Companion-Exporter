const express = require('express');
const admin = require('firebase-admin');

const app = express();

// TODO: Uncomment out line 13
const serviceAccount = require("./dnvrml-firebase-adminsdk-4324d-ed280e5d01.json");

// TODO: Uncomment out line 17-21
 admin.initializeApp({
   credential: admin.credential.cert(serviceAccount),
 });

app.set('port', (process.env.PORT || 3001));

app.get('*', (req, res) => {
    res.send('Madden Companion Exporter');
});

app.post('/:username/:platform/:leagueId/leagueteams', async (req, res) => {
    const db = admin.firestore();
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', async () => {
        const { leagueTeamInfoList: teams } = JSON.parse(body);
        const {params: { username, leagueId }} = req;

        for (const team of teams) {
            const teamRef = db.collection(`data/${username}/${leagueId}/teams`).doc(`${team.teamId}`);
            await teamRef.set(team);
        }

        res.sendStatus(200);
    });
});

app.post('/:username/:platform/:leagueId/standings', async (req, res) => {
    const db = admin.firestore();
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', async () => {
        const { teamStandingInfoList: teams } = JSON.parse(body);
        const {params: { username, leagueId }} = req;

        for (const team of teams) {
            const teamRef = db.collection(`data/${username}/${leagueId}/teams`).doc(`${team.teamId}`);
            await teamRef.set(team);
        }

        res.sendStatus(200);
    });
});

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

app.post(
    '/:username/:platform/:leagueId/week/:weekType/:weekNumber/:dataType',
    async (req, res) => {
        const db = admin.firestore();
        const {
            params: { username, leagueId, weekType, weekNumber, dataType },
        } = req;
        const basePath = `data/${username}/${leagueId}/`;
        const statsPath = `${basePath}stats`;
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            switch (dataType) {
                case 'schedules': {
                    const weekRef = db.collection(`${basePath}schedules/${weekType}/${weekNumber}`);
                    const { gameScheduleInfoList: schedules } = JSON.parse(body);
                    for (const schedule of schedules) {
                        await weekRef.doc().set(schedule);
                    }
                    break;
                }
                case 'teamstats': {
                    const { teamStatInfoList: teamStats } = JSON.parse(body);
                    for (const stat of teamStats) {
                        const weekRef = db.collection(`${statsPath}/${weekType}/${weekNumber}/${stat.teamId}/team-stats`);
                        await weekRef.doc().set(stat);
                    }
                    break;
                }
                case 'defense': {
                    const { playerDefensiveStatInfoList: defensiveStats } = JSON.parse(body);
                    for (const stat of defensiveStats) {
                        const weekRef = db.collection(`${statsPath}/${weekType}/${weekNumber}/${stat.teamId}/player-stats`);
                        await weekRef.doc(`${statrosterId}`).set(stat);
                    });
                    break;
                }
                default: {
                    const property = `player${capitalizeFirstLetter(
                        dataType
                    )}StatInfoList`;
                    const stats = JSON.parse(body)[property];
                    for (const stat of stats) {
                        const weekRef = db.collection(`${statsPath}/${weekType}/${weekNumber}/${stat.teamId}/player-stats`);
                        await weekRef.doc(`${stat.rosterId}`).set(stat);
                    }
                    break;
                }
            }

            res.sendStatus(200);
        });
    }
);

// ROSTERS
app.post('/:username/:platform/:leagueId/freeagents/roster', async (req, res) => {
    const db = admin.firestore();
    const {
        params: { username, leagueId, teamId }
    } = req;
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', async () => {
        const { rosterInfoList } = JSON.parse(body);
        const dataRef = db.collection(`data/${username}/${leagueId}/freeagents`);
        for (const player of rosterInfoList) {
            await dataRef.doc(`${player.rosterId}`).set(player);
        }
        res.sendStatus(200);
    });    
});

app.post('/:username/:platform/:leagueId/team/:teamId/roster', async (req, res) => {
    const db = admin.firestore();
    const {
        params: { username, leagueId, teamId }
    } = req;
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', async () => {
        const { rosterInfoList } = JSON.parse(body);
        const dataRef = db.collection(`data/${username}/${leagueId}/teams/${teamId}/roster`);
        for (const player of rosterInfoList) {
            await dataRef.doc(`${player.rosterId}`).set(player);
        }
        res.sendStatus(200);
    });
});

app.listen(app.get('port'), () =>
    console.log('Madden Data is running on port', app.get('port'))
);
