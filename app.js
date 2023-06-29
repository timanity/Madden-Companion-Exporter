const express = require('express');
const admin = require('firebase-admin');

const app = express();

const serviceAccount = require("./home/timmyallmadn/allmadn_exporter/dnvrml-firebase-adminsdk-4324d-ed280e5d01.json");

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

        for (let team of teams) {
            const teamRef = firestore.doc(`data/${username}/${leagueId}/teams/${team.teamId}`);
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
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            const {
                params: { username, leagueId, weekType, weekNumber, dataType },
            } = req;
            const basePath = `data/${username}/${leagueId}/`;
            const statsPath = `${basePath}stats`;

            switch (dataType) {
                case 'schedules': {
                    const weekRef = firestore.doc(`${basePath}schedules/${weekType}/${weekNumber}`);
                    const { gameScheduleInfoList: schedules } = JSON.parse(body);
                    await weekRef.set({schedules});
                    break;
                }
                case 'teamstats': {
                    const { teamStatInfoList: teamStats } = JSON.parse(body);
                    for (let stat of teamStats) {
                        const weekRef = firestore.doc(`${statsPath}/${weekType}/${weekNumber}/${stat.teamId}/team-stats`);
                        await weekRef.set(stat);
                    }
                    break;
                }
                case 'defense': {
                    const { playerDefensiveStatInfoList: defensiveStats } = JSON.parse(body);
                    for (let stat of defensiveStats) {
                        const weekRef = firestore.doc(`${statsPath}/${weekType}/${weekNumber}/${stat.teamId}/player-stats/${stat.rosterId}`);
                        await weekRef.set(stat);
                    }
                    break;
                }
                default: {
                    const property = `player${capitalizeFirstLetter(dataType)}Sure, here's a full modification of the code. This modification involves changing all the `admin.database()` calls to `admin.firestore()` and modifying how we access collections and documents in Firestore.

```javascript
const express = require('express');
const admin = require('firebase-admin');

const app = express();

const serviceAccount = require("./home/timmyallmadn/allmadn_exporter/dnvrml-firebase-adminsdk-4324d-ed280e5d01.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

app.set('port', (process.env.PORT || 3001));

app.get('*', (req, res) => {
    res.send('Madden Companion Exporter');
});

app.post('/:username/:platform/:leagueId/leagueteams', (req, res) => {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', async () => {
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
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', async () => {
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
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', async () => {
        const {
            params: { username, leagueId, weekType, weekNumber, dataType },
        } = req;
        const basePath = `data/${username}/${leagueId}/`;
        const statsPath = `${basePath}stats`;

        switch (dataType) {
            case 'schedules': {
                const weekRef = db.collection(`${basePath}schedules/${weekType}`).doc(`${weekNumber}`);
                const { gameScheduleInfoList: schedules } = JSON.parse(body);
                await weekRef.set({ schedules });
                break;
            }
            case 'teamstats': {
                const { teamStatInfoList: teamStats } = JSON.parse(body);
                for(let stat of teamStats) {
                    const weekRef = db.collection(`${statsPath}/${weekType}/${weekNumber}/${stat.teamId}`).doc('team-stats');
                    await weekRef.set(stat);
                }
                break;
            }
            case 'defense': {
                const { playerDefensiveStatInfoList: defensiveStats } = JSON.parse(body);
                for(let stat of defensiveStats) {
                    const weekRef = db.collection(`${statsPath}/${weekType}/${weekNumber}/${stat.teamId}/player-stats`).doc(`${stat.rosterId}`);
                    await weekRef.set(stat);
                }
                break;
            }
            default: {
                const property = `playerSure, here's a full modification of the code. This modification involves changing all the `admin.database()` calls to `admin.firestore()` and modifying how we access collections and documents in Firestore.

```javascript
const express = require('express');
const admin = require('firebase-admin');

const app = express();

const serviceAccount = require("./home/timmyallmadn/allmadn_exporter/dnvrml-firebase-adminsdk-4324d-ed280e5d01.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

app.set('port', (process.env.PORT || 3001));

app.get('*', (req, res) => {
    res.send('Madden Companion Exporter');
});

app.post('/:username/:platform/:leagueId/leagueteams', (req, res) => {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', async () => {
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
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', async () => {
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
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', async () => {
        const {
            params: { username, leagueId, weekType, weekNumber, dataType },
        } = req;
        const basePath = `data/${username}/${leagueId}/`;
        const statsPath = `${basePath}stats`;

        switch (dataType) {
            case 'schedules': {
                const weekRef = db.collection(`${basePath}schedules/${weekType}`).doc(`${weekNumber}`);
                const { gameScheduleInfoList: schedules } = JSON.parse(body);
                await weekRef.set({ schedules });
                break;
            }
            case 'teamstats': {
                const { teamStatInfoList: teamStats } = JSON.parse(body);
                for(let stat of teamStats) {
                    const weekRef = db.collection(`${statsPath}/${weekType}/${weekNumber}/${stat.teamId}`).doc('team-stats');
                    await weekRef.set(stat);
                }
                break;
            }
            case 'defense': {
                const { playerDefensiveStatInfoList: defensiveStats } = JSON.parse(body);
                for(let stat of defensiveStats) {
                    const weekRef = db.collection(`${statsPath}/${weekType}/${weekNumber}/${stat.teamId}/player-stats`).doc(`${stat.rosterId}`);
                    await weekRef.set(stat);
                }
                break;
            }
            default: {
                const property = `playerSure, here's a full modification of the code. This modification involves changing all the `admin.database()` calls to `admin.firestore()` and modifying how we access collections and documents in Firestore.

```javascript
const express = require('express');
const admin = require('firebase-admin');

const app = express();

const serviceAccount = require("./home/timmyallmadn/allmadn_exporter/dnvrml-firebase-adminsdk-4324d-ed280e5d01.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

app.set('port', (process.env.PORT || 3001));

app.get('*', (req, res) => {
    res.send('Madden Companion Exporter');
});

app.post('/:username/:platform/:leagueId/leagueteams', (req, res) => {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', async () => {
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
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', async () => {
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
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', async () => {
        const {
            params: { username, leagueId, weekType, weekNumber, dataType },
        } = req;
        const basePath = `data/${username}/${leagueId}/`;
        const statsPath = `${basePath}stats`;

        switch (dataType) {
            case 'schedules': {
                const weekRef = db.collection(`${basePath}schedules/${weekType}`).doc(`${weekNumber}`);
                const { gameScheduleInfoList: schedules } = JSON.parse(body);
                await weekRef.set({ schedules });
                break;
            }
            case 'teamstats': {
                const { teamStatInfoList: teamStats } = JSON.parse(body);
                for(let stat of teamStats) {
                    const weekRef = db.collection(`${statsPath}/${weekType}/${weekNumber}/${stat.teamId}`).doc('team-stats');
                    await weekRef.set(stat);
                }
                break;
            }
            case 'defense': {
                const { playerDefensiveStatInfoList: defensiveStats } = JSON.parse(body);
                for(let stat of defensiveStats) {
                    const weekRef = db.collection(`${statsPath}/${weekType}/${weekNumber}/${stat.teamId}/player-stats`).doc(`${stat.rosterId}`);
                    await weekRef.set(stat);
                }
                break;
            }
            default: {
                const property = `playerSure, here's a full modification of the code. This modification involves changing all the `admin.database()` calls to `admin.firestore()` and modifying how we access collections and documents in Firestore.

```javascript
const express = require('express');
const admin = require('firebase-admin');

const app = express();

const serviceAccount = require("./home/timmyallmadn/allmadn_exporter/dnvrml-firebase-adminsdk-4324d-ed280e5d01.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

app.set('port', (process.env.PORT || 3001));

app.get('*', (req, res) => {
    res.send('Madden Companion Exporter');
});

app.post('/:username/:platform/:leagueId/leagueteams', (req, res) => {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', async () => {
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
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', async () => {
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
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', async () => {
        const {
            params: { username, leagueId, weekType, weekNumber, dataType },
        } = req;
        const basePath = `data/${username}/${leagueId}/`;
        const statsPath = `${basePath}stats`;

        switch (dataType) {
            case 'schedules': {
                const weekRef = db.collection(`${basePath}schedules/${weekType}`).doc(`${weekNumber}`);
                const { gameScheduleInfoList: schedules } = JSON.parse(body);
                await weekRef.set({ schedules });
                break;
            }
            case 'teamstats': {
                const { teamStatInfoList: teamStats } = JSON.parse(body);
                for(let stat of teamStats) {
                    const weekRef = db.collection(`${statsPath}/${weekType}/${weekNumber}/${stat.teamId}`).doc('team-stats');
                    await weekRef.set(stat);
                }
                break;
            }
            case 'defense': {
                const { playerDefensiveStatInfoList: defensiveStats } = JSON.parse(body);
                for(let stat of defensiveStats) {
                    const weekRef = db.collection(`${statsPath}/${weekType}/${weekNumber}/${stat.teamId}/player-stats`).doc(`${stat.rosterId}`);
                    await weekRef.set(stat);
                }
                break;
            }
            default: {
                const property = `playerApologies for the abrupt cut-off. Here's the completion of the code:

```javascript
                const property = `player${capitalizeFirstLetter(dataType)}StatInfoList`;
                const stats = JSON.parse(body)[property];

                for(let stat of stats) {
                    const weekRef = db.collection(`${statsPath}/${weekType}/${weekNumber}/${stat.teamId}/player-stats`).doc(`${stat.rosterId}`);
                    await weekRef.set(stat);
                }
                break;
            }
        }

        res.sendStatus(200);
    });
});

app.listen(app.get('port'), function () {
    console.log('Server started on port ' + app.get('port'));
});
             
