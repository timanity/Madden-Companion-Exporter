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

app.post('/:username/:platform/:leagueId/leagueteams', (req, res) => {
    const db = admin.firestore();
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        const { leagueTeamInfoList: teams } = JSON.parse(body);
        const {params: { username, leagueId }} = req;

        const promises = teams.map(team => {
            const teamRef = db.collection(`data/${username}/${leagueId}/teams`).doc(`${team.teamId}`);
            return teamRef.set(team);
        });

        Promise.all(promises)
            .then(() => res.sendStatus(200))
            .catch(err => {
                console.error(err);
                res.status(500).send('An error occurred while saving to Firestore');
            });
    });
});

app.post('/:username/:platform/:leagueId/standings', (req, res) => {
    const db = admin.firestore();
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        const { teamStandingInfoList: teams } = JSON.parse(body);
        const {params: { username, leagueId }} = req;

        const promises = teams.map(team => {
            const teamRef = db.collection(`data/${username}/${leagueId}/teams`).doc(`${team.teamId}`);
            return teamRef.set(team);
        });

        Promise.all(promises)
            .then(() => res.sendStatus(200))
            .catch(err => {
                console.error(err);
                res.status(500).send('An error occurred while saving to Firestore');
            });
    });
});

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

app.post(
    '/:username/:platform/:leagueId/week/:weekType/:weekNumber/:dataType',
    (req, res) => {
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
        req.on('end', () => {
            const promises = [];
            switch (dataType) {
                case 'schedules': {
                    const weekRef = db.collection(`${basePath}schedules/${weekType}/${weekNumber}`);
                    const { gameScheduleInfoList: schedules } = JSON.parse(body);
                    schedules.forEach(schedule => {
                        promises.push(weekRef.doc().set(schedule));
                    });
                    break;
                }
                case 'teamstats': {
                    const { teamStatInfoList: teamStats } = JSON.parse(body);
                    teamStats.forEach(stat => {
                        const weekRef = db.collection(`${statsPath}/${weekType}/${weekNumber}/${stat.teamId}/team-stats`);
                        promises.push(weekRef.doc().set(stat));
                    });
                    break;
                }
                case 'defense': {
                    const { playerDefensiveStatInfoList: defensiveStats } = JSON.parse(body);
                    defensiveStats.forEach(stat => {
                        const weekRef = db.collection(`${statsPath}/${weekType}/${weekNumber}/${stat.teamId}/player-stats`);
                        promises.push(weekRef.doc(`${stat.rosterId}`).set(stat));
                    });
                    break;
                }
                default: {
                    const property = `player${capitalizeFirstLetter(
                        dataType
                    )}StatInfoList`;
                    const stats = JSON.parse(body)[property];
                    stats.forEach(stat => {
                        const weekRef = db.collection(`${statsPath}/${weekType}/${weekNumber}/${stat.teamId}/player-stats`);
                        promises.push(weekRef.doc(`${stat.rosterId}`).set(stat));
                    });
                    break;
                }
            }

            Promise.all(promises)
                .then(() => res.sendStatus(200))
                .catch(err => {
                    console.error(err);
                    res.status(500).send('An error occurred while saving to Firestore');
                });
        });
    }
);

// ROSTERS
app.post('/:username/:platform/:leagueId/freeagents/roster', (req, res) => {
    const db = admin.firestore();
    const {
        params: { username, leagueId, teamId }
    } = req;
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        const { rosterInfoList } = JSON.parse(body);
        const dataRef = db.collection(`data/${username}/${leagueId}/freeagents`);
        const promises = rosterInfoList.map(player => {
            return dataRef.doc(`${player.rosterId}`).set(player);
        });

        Promise.all(promises)
            .then(() => res.sendStatus(200))
            .catch(err => {
                console.error(err);
                res.status(500).send('An error occurred while saving to Firestore');
            });
    });    
});

app.post('/:username/:platform/:leagueId/team/:teamId/roster', (req, res) => {
    const db = admin.firestore();
    const {
        params: { username, leagueId, teamId }
    } = req;
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        const { rosterInfoList } = JSON.parse(body);
        const dataRef = db.collection(`data/${username}/${leagueId}/teams/${teamId}/roster`);
        const promises = rosterInfoList.map(player => {
            return dataRef.doc(`${player.rosterId}`).set(player);
        });

        Promise.all(promises)
            .then(() => res.sendStatus(200))
            .catch(err => {
                console.error(err);
                res.status(500).send('An error occurred while saving to Firestore');
            });
    });
});

app.listen(app.get('port'), () =>
    console.log('Madden Data is running on port', app.get('port'))
);
