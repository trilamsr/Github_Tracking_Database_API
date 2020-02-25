/* eslint-disable no-console */
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./db/GitHub_Event.db')


function init() {
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS actors (id INTEGER NOT NULL PRIMARY KEY, login TEXT NOT NULL, avatar_url TEXT)`)
        db.run(`CREATE TABLE IF NOT EXISTS repos (id INTEGER NOT NULL PRIMARY KEY, name TEXT NOT NULL, url TEXT NOT NULL)`)
        db.run(`
            CREATE TABLE IF NOT EXISTS events 
            (id INTEGER NOT NULL PRIMARY KEY, 
                actor_id INTEGER REFERENCES actors(actor_id), 
                repo_id INTEGER REFERENCES repos(repo_id),
                type TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`)
        db.run(`PRAGMA foreign_keys = OFF`, [], err => {
            console.log("PRAGMA value changed")
        })
    });
}


function dbGet(query, params) {
    return new Promise((resolve, reject) => {
        db.get(query, params, (err, row) => {
            resolve(row);
            reject(err);
        });
    });
}

function dbEach(query, param = []) {
    let collectionResult = [];
    return new Promise((resolve, reject) => {
        db.each(query, param,
            (err, row) => {
                collectionResult.push(row);
            },
            (err, count) => {
                resolve(collectionResult);
                reject(err);
            }
        );
    });
}

function dbRun(query, param = []) {
    return new Promise((resolve, reject) => {
        db.run(query, param, err => {
            resolve(this);
            reject(err);
        });
    });
}


module.exports = {
    initialize: init,
    get: dbGet,
    each: dbEach,
    run: dbRun,
};