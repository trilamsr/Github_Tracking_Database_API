/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const db = require('../db/database')
const reuse = require('./reusable.js')

const addRepo = (req, res, next) => {
	let {
		id,
		name,
		url
	} = req.body
	reuse._insertToTable("repos", ["id", "name", "url"], [id, name, url])
};

const getById = (req, res, next) => {
	reuse._getFromTableById('repos', req.params.id, res)
}

const getAllRepos = (req, res, next) => {
	db.each(`SELECT * FROM repos ORDER BY id`).then(rows => {
		res.json(rows).status(200).end()
	})
};

const eraseRepos = (req, res, next) => {
	reuse._dropTable("repos", req, res)
};


module.exports = {
	getById: getById,
	addRepo: addRepo,
	eraseRepos: eraseRepos,
	getAllRepos: getAllRepos,
};