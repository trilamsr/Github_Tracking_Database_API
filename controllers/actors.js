/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const db = require('../db/database')
const reuse = require('./reusable')

const getAllActors = (req, res, next) => {
	const query = `SELECT actors.* 
		FROM actors LEFT JOIN events ON (actors.id = events.actor_id)
		GROUP BY actors.id
		ORDER BY 
			COUNT(events.actor_id) DESC, 
			(SELECT MAX(created_at) FROM events WHERE actors.id = events.actor_id),
			login`
	db.each(query).then(rows => {
		res.json(rows).status(200).end()
	})
};

const updateActor = (req, res, next) => {
	const checkActor = `SELECT * FROM actors WHERE id = ?`
	const updateQuery = `UPDATE actors SET avatar_url = ? WHERE id = ?`
	db.get(checkActor, [req.body.id]).catch().then(data => {
		if (!data) {
			res.status(404).end()
		} else {
			if (data.login != req.body.login) {
				res.status(400).end()
			} else {
				db.run(updateQuery, [req.body.avatar_url, req.body.id]).then(() => res.status(200).end())
			}
		}
	})
};

const getStreak = (req, res, next) => {
	const group =
		`WITH
			groups(date, grp) AS(
				SELECT DISTINCT CAST(created_at AS DATE),
				date("date", "-" + ROW_NUMBER() OVER(ORDER BY CAST(created_at AS DATE)) + "day" )
				AS grp FROM events
			)
		SELECT
		COUNT( * ) AS consecutiveDates
		FROM groups
		GROUP BY grp
		ORDER BY 1 ASC`
	const all = `SELECT * FROM actors ORDER BY (${group})`
	db.each(all).catch().then(data => {
		res.json(data).status(200).end()
	})
};

const addActor = (req, res, next) => {
	let {
		id,
		login,
		avatar_url
	} = req.body
	reuse._insertToTable("actors", ["id", "login", "avatar_url"], [id, login, avatar_url]).then(database => {
		res.status(200).end()
	})
}

const getById = (req, res, next) => {
	reuse._getFromTableById('actors', req.params.id, res)
}

const eraseActors = (req, res, next) => {
	reuse._dropTable("actors", req, res)
};

module.exports = {
	getById: getById,
	addActor: addActor,
	getStreak: getStreak,
	updateActor: updateActor,
	eraseActors: eraseActors,
	getAllActors: getAllActors,
};