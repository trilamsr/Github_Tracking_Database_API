/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const db = require('../db/database')
const request = require('request')
const reuse = require('./reusable')


const getAllEvents = (req, res, next) => {
	const query = `SELECT * FROM events ORDER BY id ASC`
	db.each(query).then(rows => {
		res.status(200).json(rows).end()
	})
};

const addEvent = (req, res, next) => {
	let { id, type, actor, repo, created_at } = req.body
	db.get(`SELECT id FROM events WHERE id = ?`, [id]).catch().then(data => {
		if (data) {
			res.status(400).end()
		} else {
			reuse._insertToTable("actors", ["id", "login", "avatar_url"], [actor.id, actor.login, actor.avatar_url])
			reuse._insertToTable("repos", ["id", "name", "url"], [repo.id, repo.name, repo.url])
			reuse._insertToTable("events", ["id", "actor_id", "repo_id", "type", "created_at"], [id, actor.id, repo.id, type, created_at])
			res.status(201).end()
		}
	})
};

const getByActor = (req, res, next) => {
	const {id} = req.params
	const checkActor = `SELECT id FROM actors WHERE actors.id = ?`
	const getQuery = `SELECT * FROM events WHERE actor_id = ? ORDER BY id ASC`
	db.get(checkActor, [id]).catch(err => {
		res.json(err).end()
	}).then(data => {
		if (!data) {
			res.status(404).end()
		} else {
			db.each(getQuery, ).then(rows => {
				res.status(200).json(rows)
			})
		}
	})
};

const eraseEvents = (req, res, next) => {
	reuse._dropTable("events", req, res)
};

const getById = (req, res, next) => {
	reuse._getFromTableById('events', req.params.id, res)
};

module.exports = {
	getAllEvents: getAllEvents,
	addEvent: addEvent,
	getByActor: getByActor,
	eraseEvents: eraseEvents,
	getById: getById
};