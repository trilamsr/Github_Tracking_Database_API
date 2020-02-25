const request = require('request')
const db = require('../db/database')

const buildInsertQuery = (table, parameters) => {
    const n = parameters.length
    const params = parameters.join(', ')
    const question = "?, ".repeat(n).substring(0, 3*n-2)
    const query = `INSERT OR IGNORE INTO ${table} (${params}) VALUES (${question})`
    return query
}

const buildGetQuery = (table, parameters = [], conditions = []) => {
    let con = ""
    for (let i in parameters) {
        con += i == 0 ? "WHERE " : ""
        con += `${conditions[i]} = ${parameters[i]}`
        con += i != parameters.length - 1 ? " AND " : ""
    }
    const query = `SELECT * FROM ${table} ${con}`
    return query
}

const insertToTable = (table, keys, values) => {
    return db.run(buildInsertQuery(table, keys), values)
}

const getFromTableById = (table, id, res) => {
    db.get(buildGetQuery(table.toLowerCase(), [id], ["id"])).then(data => {
        if (!data) {
			console.log("________________________________REUSE HANDLER")
			res.json({}).status(404).end()
		} else {
            res.json(data).status(200).end()
        }
    })
}

const dropTable = (table, req, res) => {
    const query = `DELETE FROM ${table}`

    db.run(query).catch(err => {
		res.json(err).end()
	}).then(() => {
		// We can choose to TRUNCATE (empty) -- DELETE in SQLite -- table or to DROP it completely. Dropping the table is recommended since we have to clear unused space in SQLite using VACUUM command.
		// We can initialize here because we used "CREATE TABLE IF NOT EXISTS"
		res.status(200).end()
	})
}

const getByIdThroughAPI = (route, id) => {
    request.get({
        uri: `/${route}/${id}`
    }, (err, res, body) => {
        return body
    })
}

const makeDataThroughAPI = (route, body) => {
	request.post({
		uri: `/${route}`,
		body: body,
	}, (err, res, body) => {
		return body
	})
}

module.exports = {
    _dropTable: dropTable,
    _buildGetQuery: buildGetQuery,
    _insertToTable: insertToTable,
    _getFromTableById: getFromTableById,
    _buildInsertQuery: buildInsertQuery,
    _getByIdThroughAPI: getByIdThroughAPI,
    _makeDataThroughAPI: makeDataThroughAPI,
}